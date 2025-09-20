import { ReactNode } from 'react'
import { useCurrentAccount } from '@mysten/dapp-kit'
import { ConnectButton } from '@mysten/dapp-kit'
import { Wallet, User, AlertCircle } from 'lucide-react'
import { useZkLogin } from '../hooks/useZkLogin'
import styles from './WalletGuard.module.css'

interface WalletGuardProps {
  children: ReactNode
}

export function WalletGuard({ children }: WalletGuardProps) {
  const currentAccount = useCurrentAccount()
  const {
    session: zkLoginSession,
    isLoading: zkLoginLoading,
    error: zkLoginError,
    configError: zkLoginConfigError,
    initiateGoogleLogin
  } = useZkLogin()

  // User is considered authenticated if they have either a wallet connection or zkLogin session
  const isAuthenticated = currentAccount || zkLoginSession?.isAuthenticated

  return (
    <div className={styles.container}>
      {/* Main content with conditional blur - only affects Dashboard, Analytics, Explore, Settings */}
      <div className={!isAuthenticated ? styles.blurred : styles.content}>
        {children}
      </div>

      {/* Overlay when user is not authenticated - positioned only over main content */}
      {!isAuthenticated && (
        <div className={styles.overlay}>
          <div className={styles.connectCard}>
            <div className={styles.iconContainer}>
              <Wallet className={styles.walletIcon} />
            </div>
            <div className={styles.buttonContainer}>
              <ConnectButton
                connectText="Connect with Wallet"
                className={styles.walletConnectButton}
              />
              <button
                className={styles.zkLoginButton}
                onClick={initiateGoogleLogin}
                disabled={zkLoginLoading || !!zkLoginConfigError}
              >
                {zkLoginLoading ? (
                  <>
                    <div className={styles.spinner} />
                    Connecting...
                  </>
                ) : (
                  <>
                    {/* <User size={20} /> */}
                    Connect with zkLogin
                  </>
                )}
              </button>

              {/* Error Messages */}
              {zkLoginConfigError && (
                <div className={styles.errorMessage}>
                  <AlertCircle size={16} />
                  <span>Configuration Error: {zkLoginConfigError}</span>
                </div>
              )}

              {zkLoginError && (
                <div className={styles.errorMessage}>
                  <AlertCircle size={16} />
                  <span>{zkLoginError}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}