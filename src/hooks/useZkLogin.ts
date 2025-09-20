import { useState, useEffect, useCallback } from 'react'
import {
  generateZkLoginState,
  getGoogleAuthUrl,
  parseJwtFromUrl,
  decodeJwt,
  generateSuiAddress,
  storeZkLoginState,
  getZkLoginState,
  clearZkLoginState,
  validateZkLoginConfig,
  type ZkLoginState,
  type ZkLoginUserInfo
} from '../utils/zkLogin'

export interface ZkLoginSession {
  userInfo: ZkLoginUserInfo
  suiAddress: string
  jwt: string
  isAuthenticated: boolean
}

export interface UseZkLoginReturn {
  session: ZkLoginSession | null
  isLoading: boolean
  error: string | null
  configError: string | null
  initiateGoogleLogin: () => void
  logout: () => void
  handleAuthCallback: () => Promise<boolean>
}

export function useZkLogin(): UseZkLoginReturn {
  const [session, setSession] = useState<ZkLoginSession | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [configError, setConfigError] = useState<string | null>(null)

  // Validate configuration on mount
  useEffect(() => {
    const config = validateZkLoginConfig()
    if (!config.isValid) {
      setConfigError(config.errors.join(', '))
    }
  }, [])

  // Check for existing session on mount
  useEffect(() => {
    const existingSession = sessionStorage.getItem('zkLogin_session')
    if (existingSession) {
      try {
        const parsed = JSON.parse(existingSession)
        setSession(parsed)
      } catch (error) {
        console.error('Failed to parse existing session:', error)
        sessionStorage.removeItem('zkLogin_session')
      }
    }
  }, [])

  // Don't auto-handle callback here, let AuthCallback component handle it

  const initiateGoogleLogin = useCallback(() => {
    if (configError) {
      setError('zkLogin is not properly configured. Check environment variables.')
      return
    }

    try {
      setError(null)
      setIsLoading(true)

      // Generate new zkLogin state
      const zkState = generateZkLoginState()

      // Store state for later use
      storeZkLoginState(zkState)

      // Redirect to Google OAuth
      const authUrl = getGoogleAuthUrl(zkState.nonce)
      window.location.href = authUrl

    } catch (err) {
      console.error('Failed to initiate Google login:', err)
      setError('Failed to initiate Google login')
      setIsLoading(false)
    }
  }, [configError])

  const handleAuthCallback = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true)
      setError(null)

      // Parse JWT from URL
      const jwt = parseJwtFromUrl()
      if (!jwt) {
        throw new Error('No JWT found in URL')
      }

      // Get stored zkLogin state
      const zkState = getZkLoginState()
      if (!zkState) {
        throw new Error('No zkLogin state found. Please restart the login process.')
      }

      // Decode JWT
      const userInfo = decodeJwt(jwt)

      // Generate Sui address
      const suiAddress = generateSuiAddress(jwt, zkState.userSalt)

      // Create session
      const newSession: ZkLoginSession = {
        userInfo,
        suiAddress,
        jwt,
        isAuthenticated: true
      }

      // Store session
      sessionStorage.setItem('zkLogin_session', JSON.stringify(newSession))
      setSession(newSession)

      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname)

      setIsLoading(false)
      return true

    } catch (err) {
      console.error('Failed to handle auth callback:', err)
      setError(err instanceof Error ? err.message : 'Authentication failed')
      setIsLoading(false)

      // Clean up on error
      clearZkLoginState()
      sessionStorage.removeItem('zkLogin_session')

      return false
    }
  }, [])

  const logout = useCallback(() => {
    setSession(null)
    setError(null)
    clearZkLoginState()
    sessionStorage.removeItem('zkLogin_session')
  }, [])

  return {
    session,
    isLoading,
    error,
    configError,
    initiateGoogleLogin,
    logout,
    handleAuthCallback
  }
}