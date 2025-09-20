import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519'
import { generateNonce, generateRandomness, jwtToAddress } from '@mysten/sui/zklogin'
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client'
import { jwtDecode } from 'jwt-decode'

// Configuration
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''
const REDIRECT_URL = import.meta.env.VITE_REDIRECT_URL || getDefaultRedirectUrl()
const MAX_EPOCH = 10 // epochs to extend the ephemeral key pair

/**
 * Get default redirect URL based on environment
 */
function getDefaultRedirectUrl(): string {
  const baseUrl = window.location.origin
  return `${baseUrl}/auth/callback`
}

// Types
export interface ZkLoginUserInfo {
  sub: string
  aud: string
  iss: string
  email?: string
  name?: string
  picture?: string
}

export interface ZkLoginState {
  ephemeralKeyPair: Ed25519Keypair
  randomness: string
  nonce: string
  maxEpoch: number
  userSalt: string
}

// Sui client instance
const suiClient = new SuiClient({ url: getFullnodeUrl('devnet') })

/**
 * Generate ephemeral key pair and associated data for zkLogin
 */
export function generateZkLoginState(): ZkLoginState {
  const ephemeralKeyPair = new Ed25519Keypair()
  const randomness = generateRandomness()

  // Get current epoch and add buffer
  const maxEpoch = MAX_EPOCH // In production, you'd get this from the network

  const nonce = generateNonce(
    ephemeralKeyPair.getPublicKey(),
    maxEpoch,
    randomness
  )

  // Generate a random salt for the user (in production, this should be deterministic per user)
  const userSalt = generateRandomness()

  return {
    ephemeralKeyPair,
    randomness,
    nonce,
    maxEpoch,
    userSalt
  }
}

/**
 * Generate Google OAuth URL for zkLogin
 */
export function getGoogleAuthUrl(nonce: string): string {
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: REDIRECT_URL,
    response_type: 'id_token',
    scope: 'openid email profile',
    nonce: nonce,
  })

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
}

/**
 * Parse JWT from URL fragment (for implicit flow)
 */
export function parseJwtFromUrl(): string | null {
  const fragment = window.location.hash.substring(1)
  const params = new URLSearchParams(fragment)
  return params.get('id_token')
}

/**
 * Decode and validate JWT
 */
export function decodeJwt(jwt: string): ZkLoginUserInfo {
  try {
    const decoded = jwtDecode(jwt) as any

    // Basic validation
    if (!decoded.sub || !decoded.aud || !decoded.iss) {
      throw new Error('Invalid JWT: missing required fields')
    }

    return {
      sub: decoded.sub,
      aud: decoded.aud,
      iss: decoded.iss,
      email: decoded.email,
      name: decoded.name,
      picture: decoded.picture,
    }
  } catch (error) {
    console.error('Failed to decode JWT:', error)
    throw new Error('Invalid JWT format')
  }
}

/**
 * Generate Sui address from JWT and salt
 */
export function generateSuiAddress(jwt: string, userSalt: string): string {
  try {
    return jwtToAddress(jwt, userSalt)
  } catch (error) {
    console.error('Failed to generate Sui address:', error)
    throw new Error('Failed to generate Sui address from JWT')
  }
}

/**
 * Store zkLogin state in session storage
 */
export function storeZkLoginState(state: ZkLoginState): void {
  const serializedState = {
    ...state,
    ephemeralKeyPair: {
      publicKey: state.ephemeralKeyPair.getPublicKey().toSuiBytes(),
      secretKey: state.ephemeralKeyPair.getSecretKey()
    }
  }

  sessionStorage.setItem('zkLogin_state', JSON.stringify(serializedState))
}

/**
 * Retrieve zkLogin state from session storage
 */
export function getZkLoginState(): ZkLoginState | null {
  try {
    const stored = sessionStorage.getItem('zkLogin_state')
    if (!stored) return null

    const parsed = JSON.parse(stored)

    // Reconstruct the keypair
    const ephemeralKeyPair = Ed25519Keypair.fromSecretKey(parsed.ephemeralKeyPair.secretKey)

    return {
      ...parsed,
      ephemeralKeyPair
    }
  } catch (error) {
    console.error('Failed to retrieve zkLogin state:', error)
    return null
  }
}

/**
 * Clear zkLogin state from session storage
 */
export function clearZkLoginState(): void {
  sessionStorage.removeItem('zkLogin_state')
}

/**
 * Check if Google Client ID is configured
 */
export function isGoogleConfigured(): boolean {
  return Boolean(GOOGLE_CLIENT_ID)
}

/**
 * Validate environment configuration
 */
export function validateZkLoginConfig(): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!GOOGLE_CLIENT_ID) {
    errors.push('VITE_GOOGLE_CLIENT_ID environment variable is required')
  }

  if (!REDIRECT_URL) {
    errors.push('VITE_REDIRECT_URL environment variable is required')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}