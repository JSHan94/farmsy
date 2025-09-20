import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useZkLogin } from '../hooks/useZkLogin'
import styles from './AuthCallback.module.css'

export function AuthCallback() {
  const navigate = useNavigate()
  const { handleAuthCallback, error } = useZkLogin()

  useEffect(() => {
    const processAuth = async () => {
      // Handle the authentication callback
      const success = await handleAuthCallback()

      if (success) {
        // Successfully authenticated, redirect to Dashboard
        navigate('/', { replace: true })
      } else if (error) {
        // Authentication failed, redirect to home with error
        console.error('Authentication failed:', error)
        navigate('/', { replace: true })
      }
    }

    // Check if we have the id_token in the URL
    if (window.location.hash.includes('id_token')) {
      processAuth()
    } else {
      // No token found, redirect to home
      navigate('/', { replace: true })
    }
  }, [handleAuthCallback, navigate, error])

  return (
    <div className={styles.container}>
      <div className={styles.loadingCard}>
        <div className={styles.spinner} />
        <h2>Completing sign in...</h2>
        <p>Please wait while we authenticate your account</p>
      </div>
    </div>
  )
}