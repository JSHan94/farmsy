import { useCurrentAccount } from '@mysten/dapp-kit'
import { useZkLogin } from '../hooks/useZkLogin'
import styles from './AddressDisplay.module.css'

export function AddressDisplay() {
  const currentAccount = useCurrentAccount()
  const { session: zkLoginSession } = useZkLogin()

  // Get address from either wallet or zkLogin
  const address = currentAccount?.address || zkLoginSession?.address

  if (!address) return null

  // Format address to show first 6 and last 4 characters
  const formatAddress = (addr: string) => {
    if (addr.length <= 10) return addr
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  return (
    <div className={styles.addressContainer}>
      <span className={styles.addressText}>
        {formatAddress(address)}
      </span>
    </div>
  )
}