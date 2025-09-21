import { Droplets } from 'lucide-react'
import { usePersistedXPSystem } from '../contexts/PersistenceContext'
import styles from './XPProgressBar.module.css'

interface DropletsDisplayProps {
  currentDroplets: number
  currentLevel: number
}

export function DropletsDisplay({ currentDroplets, currentLevel }: DropletsDisplayProps) {
  return (
    <div className={styles.dropletsContainer}>
      {/* Level Badge */}
      <div className={styles.levelBadge}>
        <span className={styles.levelText}>Lv.{currentLevel}</span>
      </div>

      {/* Droplets Display */}
      <div className={styles.dropletsDisplay}>
        <Droplets className={styles.dropletsIcon} />
        <span className={styles.dropletsCount}>{currentDroplets} droplets</span>
      </div>
    </div>
  )
}

// Updated hook that uses persisted XP system
export const useXPSystem = () => {
  return usePersistedXPSystem()
}