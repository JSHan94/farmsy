import { useEffect } from 'react'
import { usePersistence } from '../contexts/PersistenceContext'
import { useCurrentAccount } from '@mysten/dapp-kit'

export function AutoReconnect() {
  const { reconnectWallet, userData } = usePersistence()
  const currentAccount = useCurrentAccount()

  useEffect(() => {
    // Only attempt auto-reconnect if:
    // 1. No wallet is currently connected
    // 2. We have previous user data indicating a previous connection
    // 3. The connection was recent (within 7 days)
    if (!currentAccount && userData.address && userData.lastSeen) {
      const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000)

      if (userData.lastSeen > sevenDaysAgo) {
        // Small delay to ensure wallet providers are ready
        const timer = setTimeout(() => {
          reconnectWallet()
        }, 1000)

        return () => clearTimeout(timer)
      }
    }
  }, [currentAccount, userData.address, userData.lastSeen, reconnectWallet])

  // This component doesn't render anything
  return null
}