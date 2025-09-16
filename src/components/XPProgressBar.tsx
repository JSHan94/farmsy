import { useState } from 'react'
import { Star } from 'lucide-react'
import styles from './XPProgressBar.module.css'

interface XPProgressBarProps {
  currentXP: number
  currentLevel: number
}

// Calculate XP required for each level (exponential growth)
const getXPForLevel = (level: number): number => {
  return level * 100 + (level - 1) * 50
}

// Calculate XP needed for next level
const getXPForNextLevel = (currentLevel: number): number => {
  return getXPForLevel(currentLevel + 1)
}

// Calculate XP progress within current level
const getCurrentLevelProgress = (currentXP: number, currentLevel: number): { progress: number, remaining: number } => {
  const currentLevelXP = getXPForLevel(currentLevel)
  const nextLevelXP = getXPForNextLevel(currentLevel)
  const progressInLevel = Math.max(0, currentXP - currentLevelXP)
  const xpNeededForNextLevel = nextLevelXP - currentLevelXP

  return {
    progress: Math.min(100, (progressInLevel / xpNeededForNextLevel) * 100),
    remaining: Math.max(0, xpNeededForNextLevel - progressInLevel)
  }
}

export function XPProgressBar({ currentXP, currentLevel }: XPProgressBarProps) {
  const { progress } = getCurrentLevelProgress(currentXP, currentLevel)
  const nextLevelXP = getXPForNextLevel(currentLevel)

  return (
    <div className={styles.xpContainer}>
      {/* Level Badge */}
      <div className={styles.levelBadge}>
        <Star className={styles.levelIcon} />
        <span className={styles.levelText}>Lv.{currentLevel}</span>
      </div>

      {/* XP Progress Bar */}
      <div className={styles.progressContainer}>
        <div className={styles.progressTrack}>
          <div
            className={styles.progressFill}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        {/* XP Text */}
        <div className={styles.xpText}>
          <span className={styles.currentXP}>{currentXP}</span>
          <span className={styles.separator}>/</span>
          <span className={styles.nextLevelXP}>{nextLevelXP}</span>
        </div>
      </div>
    </div>
  )
}

// Hook for XP management
export const useXPSystem = (initialXP: number = 0, initialLevel: number = 1) => {
  const [currentXP, setCurrentXP] = useState(initialXP)
  const [currentLevel, setCurrentLevel] = useState(initialLevel)

  const gainXP = (amount: number) => {
    setCurrentXP(prev => {
      const newXP = prev + amount
      const newLevel = calculateLevel(newXP)

      if (newLevel > currentLevel) {
        setCurrentLevel(newLevel)
      }

      return newXP
    })
  }

  const calculateLevel = (xp: number): number => {
    let level = 1
    let requiredXP = 0

    while (xp >= requiredXP) {
      level++
      requiredXP = getXPForLevel(level)
    }

    return level - 1
  }

  return {
    currentXP,
    currentLevel,
    gainXP
  }
}