import { Routes, Route } from "react-router-dom"
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar"
import { AppSidebar } from "./components/AppSidebar"
import { WalletConnect } from "./components/WalletConnect"
import { WalletGuard } from "./components/WalletGuard"
import { AutoReconnect } from "./components/AutoReconnect"
import { DropletsDisplay } from "./components/XPProgressBar"
import { useCurrentAccount } from '@mysten/dapp-kit'
import { TaskProvider } from "./contexts/TaskContext"
import { PersistenceProvider, usePersistedXPSystem } from "./contexts/PersistenceContext"
import { Dashboard } from "./pages/Dashboard"
import { Explore } from "./pages/Explore"
import { Analytics } from "./pages/Analytics"
import { Settings } from "./pages/Settings"
import styles from './App.module.css'

function AppContent() {
  const { currentXP, currentLevel } = usePersistedXPSystem()
  const currentAccount = useCurrentAccount()

  return (
    <TaskProvider>
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
                  {currentAccount && (
                    <DropletsDisplay
                      currentDroplets={currentXP}
                      currentLevel={currentLevel}
                    />
                  )}
                  <WalletConnect />
                </div>
              </div>
            </header>

            {/* Main Content with Wallet Guard */}
            <WalletGuard>
              <main className={styles.mainContent}>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/explore" element={<Explore />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </main>
            </WalletGuard>
          </div>
        </div>
      </SidebarProvider>
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