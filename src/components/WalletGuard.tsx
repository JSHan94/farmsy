import { ReactNode } from 'react'
import { useCurrentAccount } from '@mysten/dapp-kit'
import { ConnectButton } from '@mysten/dapp-kit'
import { Wallet } from 'lucide-react'
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
                  padding: '18px 40px',
                  fontSize: '18px',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  minHeight: '58px',
                  minWidth: '240px',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 8px 25px rgba(var(--primary), 0.4), 0 4px 12px rgba(0, 0, 0, 0.2)',
                  transform: 'translateY(0)',
                  position: 'relative'
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}