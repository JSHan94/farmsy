import { Routes, Route } from "react-router-dom"
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar"
import { AppSidebar } from "./components/AppSidebar"
import { WalletConnect } from "./components/WalletConnect"
import { WalletGuard } from "./components/WalletGuard"
import { AutoReconnect } from "./components/AutoReconnect"
import { DropletsDisplay } from "./components/XPProgressBar"
import { LevelUpAnimation } from "./components/LevelUpAnimation"
import { LevelTestButton } from "./components/LevelTestButton"
import { AddressDisplay } from "./components/AddressDisplay"
import { useCurrentAccount } from '@mysten/dapp-kit'
import { useZkLogin } from './hooks/useZkLogin'
import { TaskProvider } from "./contexts/TaskContext"
import { PersistenceProvider, usePersistedXPSystem } from "./contexts/PersistenceContext"
import { DashboardProvider } from "./contexts/DashboardContext"
import { Dashboard } from "./pages/Dashboard"
import { Explore } from "./pages/Explore"
import { Analytics } from "./pages/Analytics"
import { Settings } from "./pages/Settings"
import { AuthCallback } from "./pages/AuthCallback"
import { Toaster } from "sonner"
import styles from './App.module.css'

function AppContent() {
  const { currentXP, currentLevel, levelUpData, closeLevelUpAnimation } = usePersistedXPSystem()
  const currentAccount = useCurrentAccount()
  const { session: zkLoginSession } = useZkLogin()

  // Show XP for either wallet or zkLogin users
  const isAuthenticated = currentAccount || zkLoginSession?.isAuthenticated

  return (
    <TaskProvider>
      <DashboardProvider>
        <AutoReconnect />
        <SidebarProvider>
          <div className={styles.appContainer}>
            <AppSidebar />
            <div className={styles.mainContainer}>
            {/* Header */}
            <header className={styles.header}>
              <div className={styles.headerContent}>
                <SidebarTrigger />
                <div className={styles.headerRight}>
                  {isAuthenticated && (
                    <>
                      <DropletsDisplay
                        currentDroplets={currentXP}
                        currentLevel={currentLevel}
                      />
                    </>
                  )}
                  <WalletConnect />
                </div>
              </div>
            </header>

            {/* Main Content */}
            <main className={styles.mainContent}>
              <Routes>
                {/* Auth callback route - outside WalletGuard */}
                <Route path="/auth/callback" element={<AuthCallback />} />

                {/* Protected routes - inside WalletGuard */}
                <Route path="/*" element={
                  <WalletGuard>
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/explore" element={<Explore />} />
                      <Route path="/analytics" element={<Analytics />} />
                      <Route path="/settings" element={<Settings />} />
                    </Routes>
                  </WalletGuard>
                } />
              </Routes>
            </main>
          </div>
        </div>
      </SidebarProvider>

      {/* Level Up Animation */}
      <LevelUpAnimation
        isVisible={levelUpData.showLevelUp}
        onClose={closeLevelUpAnimation}
        newLevel={levelUpData.newLevel}
        evolutionData={levelUpData.evolutionData}
      />

      {/* Test Button (only in development) */}
      {process.env.NODE_ENV === 'development' && <LevelTestButton />}

      {/* Toast Notifications */}
      <Toaster position="top-right" richColors />
    </DashboardProvider>
    </TaskProvider>
  )
}

export default function App() {
  return (
    <PersistenceProvider>
      <AppContent />
    </PersistenceProvider>
  )
}