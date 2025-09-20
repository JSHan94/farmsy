import { createContext, useContext, useState, ReactNode } from 'react'

interface DashboardContextType {
  categoryFilter: string
  setCategoryFilter: (filter: string) => void
  activeTab: string
  setActiveTab: (tab: string) => void
  resetDashboardState: () => void
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [activeTab, setActiveTab] = useState('board')

  const resetDashboardState = () => {
    setCategoryFilter('all')
    setActiveTab('board')
  }

  const value: DashboardContextType = {
    categoryFilter,
    setCategoryFilter,
    activeTab,
    setActiveTab,
    resetDashboardState
  }

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  const context = useContext(DashboardContext)
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider')
  }
  return context
}