import { useEffect, useState } from 'react'
import { Sparkles, Trophy, Star, Zap } from 'lucide-react'
import styles from './TaskCompletionCelebration.module.css'

interface TaskCompletionCelebrationProps {
  isVisible: boolean
  taskTitle: string
  onComplete?: () => void
}

export function TaskCompletionCelebration({ isVisible, taskTitle, onComplete }: TaskCompletionCelebrationProps) {
  if (!isVisible) return null

  return (
    <div className={`${styles.overlay}`}>
      <div className={styles.container}>
        {/* Main celebration content */}
        <div className={styles.celebration}>
          {/* Trophy icon */}
          <div className={styles.trophyContainer}>
            <Trophy className={styles.trophy} />
            <div className={styles.trophyGlow} />
          </div>

          {/* Sparkles around trophy */}
          <div className={styles.sparklesContainer}>
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className={styles.sparkle}
                style={{
                  '--delay': `${index * 0.2}s`,
                  '--rotation': `${index * 45}deg`
                } as React.CSSProperties}
              >
                <Sparkles className={styles.sparkleIcon} />
              </div>
            ))}
          </div>

          {/* Success message */}
          <div className={styles.messageContainer}>
            <h2 className={styles.title}>Task Completed! 🎉</h2>
            <p className={styles.taskName}>{taskTitle}</p>
            <div className={styles.xpReward}>
              <Zap className={styles.xpIcon} />
              <span>+25 XP</span>
            </div>
          </div>
          
          {/* Floating particles */}
          <div className={styles.particlesContainer}>
            {Array.from({ length: 12 }).map((_, index) => (
              <div
                key={index}
                className={styles.particle}
                style={{
                  '--delay': `${index * 0.1}s`,
                  '--x-offset': `${(index % 4 - 2) * 50}px`,
                  '--y-offset': `${Math.floor(index / 4) * -30}px`
                } as React.CSSProperties}
              >
                <Star className={styles.particleIcon} />
              </div>
            ))}
          </div>

          {/* Ripple effect */}
          <div className={styles.rippleEffect}>
            <div className={styles.ripple} />
            <div className={styles.ripple} style={{ '--delay': '0.5s' } as React.CSSProperties} />
            <div className={styles.ripple} style={{ '--delay': '1s' } as React.CSSProperties} />
          </div>
        </div>
      </div>
    </div>
  )
}