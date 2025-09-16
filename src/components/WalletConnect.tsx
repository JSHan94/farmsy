import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit'
import { Button } from "./ui/button"
import { Wallet } from "lucide-react"
import styles from './WalletConnect.module.css'

export function WalletConnect() {
  const currentAccount = useCurrentAccount()

  const displayAddress = currentAccount?.address
    ? `${currentAccount.address.slice(0, 6)}...${currentAccount.address.slice(-4)}`
    : ''

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