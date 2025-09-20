import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit'
import { Button } from "./Button"
import { Wallet, User, LogOut } from "lucide-react"
import { useZkLogin } from '../hooks/useZkLogin'
import styles from './WalletConnect.module.css'

export function WalletConnect() {
  const currentAccount = useCurrentAccount()
  const { session: zkLoginSession, logout } = useZkLogin()

  const displayAddress = currentAccount?.address
    ? `${currentAccount.address.slice(0, 6)}...${currentAccount.address.slice(-4)}`
    : ''

  const displayZkAddress = zkLoginSession?.suiAddress
    ? `${zkLoginSession.suiAddress.slice(0, 6)}...${zkLoginSession.suiAddress.slice(-4)}`
    : ''

  // Show zkLogin session if authenticated
  if (zkLoginSession?.isAuthenticated) {
    return (
      <div className={styles.zkLoginConnection}>
        <div className={styles.zkLoginInfo}>
          <User size={16} />
          <span className={styles.zkLoginText}>
            {zkLoginSession.userInfo.email || displayZkAddress}
          </span>
        </div>
        <Button
          onClick={logout}
          variant="ghost"
          size="sm"
          className={styles.logoutButton}
        >
          <LogOut size={14} />
        </Button>
      </div>
    )
  }

  // Show regular wallet connection
  if (currentAccount) {
    return (
      <ConnectButton
        connectText="Connect Wallet"
        connectedText={displayAddress}
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '6px',
          padding: '8px 16px',
          color: 'inherit',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      />
    )
  }

  return (
    <ConnectButton
      connectText="Connect Wallet"
      style={{
        background: 'hsl(var(--primary))',
        color: 'hsl(var(--primary-foreground))',
        border: 'none',
        borderRadius: '6px',
        padding: '8px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        cursor: 'pointer'
      }}
    />
  )
}