import { ReactNode } from 'react'
import { useCurrentAccount } from '@mysten/dapp-kit'
import { ConnectButton } from '@mysten/dapp-kit'
import { Wallet, User } from 'lucide-react'
import styles from './WalletGuard.module.css'

interface WalletGuardProps {
  children: ReactNode
}

export function WalletGuard({ children }: WalletGuardProps) {
  const currentAccount = useCurrentAccount()

  return (
    <div className={styles.container}>
      {/* Main content with conditional blur - only affects Dashboard, Analytics, Explore, Settings */}
      <div className={!currentAccount ? styles.blurred : styles.content}>
        {children}
      </div>

      {/* Overlay when wallet is not connected - positioned only over main content */}
      {!currentAccount && (
        <div className={styles.overlay}>
          <div className={styles.connectCard}>
            <div className={styles.iconContainer}>
              <Wallet className={styles.walletIcon} />
            </div>
            <div className={styles.buttonContainer}>
              <ConnectButton
                connectText="Connect Wallet"
                style={{
                  background: 'hsl(var(--primary))',
                  color: 'hsl(var(--primary-foreground))',
                  border: 'none',
                  borderRadius: '16px',
                  padding: '16px 32px',
                  fontSize: '16px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  minHeight: '52px',
                  minWidth: '200px',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 6px 20px rgba(var(--primary), 0.3), 0 2px 8px rgba(0, 0, 0, 0.1)',
                  transform: 'translateY(0)',
                  position: 'relative',
                  marginBottom: '12px'
                }}
              />
              <button
                className={styles.zkLoginButton}
                onClick={() => {
                  // TODO: Implement zkLogin connection logic
                  console.log('zkLogin connection clicked')
                }}
              >
                <User size={20} />
                Connect with zkLogin
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}