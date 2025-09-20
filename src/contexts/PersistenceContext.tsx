import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useCurrentAccount, useDisconnectWallet, useConnectWallet } from '@mysten/dapp-kit'

interface UserData {
  address?: string
  currentXP: number
  currentLevel: number
  connectedAt?: number
  lastSeen?: number
}

interface PersistenceContextType {
  userData: UserData
  setUserData: (data: Partial<UserData>) => void
  persistTasks: (tasks: any[]) => void
  getPersistedTasks: () => any[]
  clearUserData: () => void
  isConnected: boolean
  reconnectWallet: () => Promise<void>
}

const STORAGE_KEYS = {
  USER_DATA: 'farmsy_user_data',
  TASKS: 'farmsy_tasks',
  WALLET_PREFERENCE: 'farmsy_wallet_preference'
} as const

const initialUserData: UserData = {
  currentXP: 0,
  currentLevel: 1
}

const PersistenceContext = createContext<PersistenceContextType | undefined>(undefined)

export function PersistenceProvider({ children }: { children: ReactNode }) {
  const [userData, setUserDataState] = useState<UserData>(initialUserData)
  const [isInitialized, setIsInitialized] = useState(false)

  const currentAccount = useCurrentAccount()
  const { mutate: disconnect } = useDisconnectWallet()
  const { mutate: connect } = useConnectWallet()

  // Load user data from localStorage
  useEffect(() => {
    const loadUserData = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEYS.USER_DATA)
        if (stored) {
          const parsedData = JSON.parse(stored)
          setUserDataState(prev => ({ ...prev, ...parsedData }))
        }
      } catch (error) {
        console.warn('Failed to load user data from localStorage:', error)
      } finally {
        setIsInitialized(true)
      }
    }

    loadUserData()
  }, [])

  // Sync user data when wallet connection changes
  useEffect(() => {
    if (!isInitialized) return

    if (currentAccount?.address) {
      // User connected - update or create user data
      const newUserData: UserData = {
        address: currentAccount.address,
        connectedAt: Date.now(),
        lastSeen: Date.now(),
        currentXP: userData.currentXP,
        currentLevel: userData.currentLevel
      }

      // If this is a different wallet, check if we have saved data for this address
      if (userData.address !== currentAccount.address) {
        const addressSpecificKey = `${STORAGE_KEYS.USER_DATA}_${currentAccount.address}`
        try {
          const addressSpecificData = localStorage.getItem(addressSpecificKey)
          if (addressSpecificData) {
            const parsedData = JSON.parse(addressSpecificData)
            newUserData.currentXP = parsedData.currentXP || 0
            newUserData.currentLevel = parsedData.currentLevel || 1
          }
        } catch (error) {
          console.warn('Failed to load address-specific data:', error)
        }
      }

      setUserDataState(newUserData)

      // Save wallet preference for auto-reconnect
      localStorage.setItem(STORAGE_KEYS.WALLET_PREFERENCE, JSON.stringify({
        address: currentAccount.address,
        lastConnected: Date.now()
      }))
    } else if (userData.address) {
      // User disconnected - keep data but mark as disconnected
      setUserDataState(prev => ({
        ...prev,
        lastSeen: Date.now()
      }))
    }
  }, [currentAccount?.address, isInitialized])

  // Auto-save user data to localStorage
  useEffect(() => {
    if (!isInitialized) return

    try {
      // Save general user data
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData))

      // Save address-specific data if user has an address
      if (userData.address) {
        const addressSpecificKey = `${STORAGE_KEYS.USER_DATA}_${userData.address}`
        localStorage.setItem(addressSpecificKey, JSON.stringify({
          currentXP: userData.currentXP,
          currentLevel: userData.currentLevel,
          lastSeen: userData.lastSeen
        }))
      }
    } catch (error) {
      console.warn('Failed to save user data to localStorage:', error)
    }
  }, [userData, isInitialized])

  const setUserData = (data: Partial<UserData>) => {
    setUserDataState(prev => ({ ...prev, ...data }))
  }

  const persistTasks = (tasks: any[]) => {
    try {
      const tasksToSave = userData.address
        ? { [userData.address]: tasks, global: tasks }
        : { global: tasks }

      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasksToSave))
    } catch (error) {
      console.warn('Failed to persist tasks:', error)
    }
  }

  const getPersistedTasks = (): any[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TASKS)
      if (!stored) return []

      const parsed = JSON.parse(stored)

      // Return address-specific tasks if available, otherwise global tasks
      if (userData.address && parsed[userData.address]) {
        return parsed[userData.address]
      }

      return parsed.global || []
    } catch (error) {
      console.warn('Failed to load persisted tasks:', error)
      return []
    }
  }

  const clearUserData = () => {
    setUserDataState(initialUserData)
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key)
    })

    // Clear address-specific data
    const keys = Object.keys(localStorage)
    keys.forEach(key => {
      if (key.startsWith(`${STORAGE_KEYS.USER_DATA}_`)) {
        localStorage.removeItem(key)
      }
    })
  }

  const reconnectWallet = async (): Promise<void> => {
    try {
      const preference = localStorage.getItem(STORAGE_KEYS.WALLET_PREFERENCE)
      if (preference) {
        const { lastConnected } = JSON.parse(preference)
        // Only auto-reconnect if last connection was within 7 days
        const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000)

        if (lastConnected > sevenDaysAgo) {
          // Attempt to reconnect to the last used wallet
          // Note: This will trigger the wallet selection modal
          // The actual reconnection depends on the user's wallet state
          connect({ walletName: 'Sui Wallet' })
        }
      }
    } catch (error) {
      console.warn('Failed to reconnect wallet:', error)
    }
  }

  const value: PersistenceContextType = {
    userData,
    setUserData,
    persistTasks,
    getPersistedTasks,
    clearUserData,
    isConnected: !!currentAccount?.address,
    reconnectWallet
  }

  return (
    <PersistenceContext.Provider value={value}>
      {children}
    </PersistenceContext.Provider>
  )
}

export function usePersistence() {
  const context = useContext(PersistenceContext)
  if (context === undefined) {
    throw new Error('usePersistence must be used within a PersistenceProvider')
  }
  return context
}

// Hook for XP system with persistence
export function usePersistedXPSystem() {
  const { userData, setUserData, isConnected } = usePersistence()

  const gainXP = (amount: number) => {
    const newXP = userData.currentXP + amount
    const newLevel = Math.floor(newXP / 100) + 1

    setUserData({
      currentXP: newXP,
      currentLevel: newLevel
    })
  }

  const xpForNextLevel = userData.currentLevel * 100

  return {
    currentXP: userData.currentXP,
    currentLevel: userData.currentLevel,
    xpForNextLevel,
    gainXP,
    isConnected
  }
}