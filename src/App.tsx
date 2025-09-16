import { Routes, Route } from "react-router-dom"
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar"
import { AppSidebar } from "./components/AppSidebar"
import { WalletConnect } from "./components/WalletConnect"
import { XPProgressBar, useXPSystem } from "./components/XPProgressBar"
import { Dashboard } from "./pages/Dashboard"
import { Tasks } from "./pages/Tasks"
import { Analytics } from "./pages/Analytics"
import { Settings } from "./pages/Settings"
import styles from './App.module.css'

export default function App() {
  const { currentXP, currentLevel } = useXPSystem(150, 2) // Starting with some XP for demo

  return (
    <SidebarProvider>
      <div className={styles.appContainer}>
        <AppSidebar />
        <div className={styles.mainContainer}>
          {/* Header */}
          <header className={styles.header}>
            <div className={styles.headerContent}>
              <SidebarTrigger />
              <div className={styles.headerRight}>
                <XPProgressBar
                  currentXP={currentXP}
                  currentLevel={currentLevel}
                />
                <WalletConnect />
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className={styles.mainContent}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}