import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useZkLogin } from '../hooks/useZkLogin'
import styles from './AuthCallback.module.css'

export function AuthCallback() {
  const navigate = useNavigate()
  const { handleAuthCallback, isLoading, error } = useZkLogin()

  useEffect(() => {
    const processCallback = async () => {
      const success = await handleAuthCallback()
      if (success) {
        // Redirect to dashboard or previous page
        navigate('/', { replace: true })
      }
    }

    processCallback()
  }, [handleAuthCallback, navigate])

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.error}>
            <h2>Authentication Failed</h2>
            <p>{error}</p>
            <button
              className={styles.button}
              onClick={() => navigate('/', { replace: true })}
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <h2>Completing Login...</h2>
          <p>Please wait while we authenticate your account.</p>
        </div>
      </div>
    </div>
  )
}