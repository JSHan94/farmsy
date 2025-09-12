import { usePrivy } from '@privy-io/react-auth'
import { Button } from "./ui/button"
import { Wallet } from "lucide-react"
import styles from './WalletConnect.module.css'

export function WalletConnect() {
  const { ready, authenticated, user, login, logout } = usePrivy()

  // Don't render anything until Privy is ready
  if (!ready) {
    return (
      <Button variant="outline" disabled className={styles.walletButton}>
        <Wallet className={styles.walletIcon} />
        Loading...
      </Button>
    )
  }

  const walletAddress = user?.wallet?.address
  const displayAddress = walletAddress 
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : ''

  if (authenticated && user) {
    return (
      <Button 
        variant="outline" 
        onClick={logout}
        className={styles.walletButton}
      >
        <Wallet className={styles.walletIcon} />
        <span className={styles.walletAddress}>{displayAddress}</span>
        <span className={styles.connectedText}>Connected</span>
      </Button>
    )
  }

  return (
    <Button 
      onClick={login}
      className={styles.walletButton}
    >
      <Wallet className={styles.walletIcon} />
      Connect Wallet
    </Button>
  )
}