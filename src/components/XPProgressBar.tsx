import { useState } from 'react'
import { Droplets } from 'lucide-react'
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
        <span className={styles.dropletsCount}>{currentDroplets}</span>
      </div>
    </div>
  )
}

// Hook for XP system management
export const useXPSystem = (initialXP: number = 0, initialLevel: number = 1) => {
  const [currentXP, setCurrentXP] = useState(initialXP)
  const [currentLevel, setCurrentLevel] = useState(initialLevel)

  // XP required for next level (simple formula)
  const xpForNextLevel = currentLevel * 100

  const gainXP = (amount: number) => {
    setCurrentXP(prev => {
      const newXP = prev + amount
      // Simple level up logic
      const newLevel = Math.floor(newXP / 100) + 1
      setCurrentLevel(newLevel)
      return newXP
    })
  }

  return {
    currentXP,
    currentLevel,
    xpForNextLevel,
    gainXP
  }
}