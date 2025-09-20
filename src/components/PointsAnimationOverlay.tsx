import { useEffect, useState } from 'react'
import { Droplets, Plus } from 'lucide-react'
import styles from './PointsAnimationOverlay.module.css'

interface PointsAnimationOverlayProps {
  isVisible: boolean
  points: number
  onComplete?: () => void
  duration?: number
}

export function PointsAnimationOverlay({
  isVisible,
  points,
  onComplete,
  duration = 3000
}: PointsAnimationOverlayProps) {
  const [animationPhase, setAnimationPhase] = useState<'enter' | 'float' | 'exit'>('enter')

  useEffect(() => {
    if (!isVisible) {
      setAnimationPhase('enter')
      return
    }

    // Phase 1: Enter animation (0-500ms)
    const enterTimer = setTimeout(() => {
      setAnimationPhase('float')
    }, 500)

    // Phase 2: Float and sparkle (500ms - duration-500ms)
    const exitTimer = setTimeout(() => {
      setAnimationPhase('exit')
    }, duration - 500)

    // Phase 3: Exit and complete (duration-500ms - duration)
    const completeTimer = setTimeout(() => {
      onComplete?.()
    }, duration)

    return () => {
      clearTimeout(enterTimer)
      clearTimeout(exitTimer)
      clearTimeout(completeTimer)
    }
  }, [isVisible, duration, onComplete])

  if (!isVisible) return null

  return (
    <div className={styles.overlay}>
      <div className={`${styles.container} ${styles[animationPhase]}`}>
        {/* Main points display */}
        <div className={styles.pointsDisplay}>
          <div className={styles.pointsIcon}>
            <Plus className={styles.plusIcon} />
            <Droplets className={styles.dropletsIcon} />
          </div>
          <span className={styles.pointsText}>{points}</span>
        </div>

        {/* Animated droplets particles */}
        <div className={styles.particlesContainer}>
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className={styles.particle}
              style={{
                '--delay': `${index * 0.1}s`,
                '--angle': `${index * 45}deg`,
                '--distance': `${60 + (index % 3) * 20}px`
              } as React.CSSProperties}
            >
              <Droplets className={styles.particleDroplet} />
            </div>
          ))}
        </div>

        {/* Ripple effect */}
        <div className={styles.rippleContainer}>
          <div className={styles.ripple} />
          <div className={styles.ripple} style={{ '--delay': '0.3s' } as React.CSSProperties} />
          <div className={styles.ripple} style={{ '--delay': '0.6s' } as React.CSSProperties} />
        </div>

        {/* Sparkle effects */}
        <div className={styles.sparkleContainer}>
          {Array.from({ length: 12 }).map((_, index) => (
            <div
              key={index}
              className={styles.sparkle}
              style={{
                '--delay': `${0.2 + (index * 0.1)}s`,
                '--x': `${(index % 4 - 1.5) * 80}px`,
                '--y': `${Math.floor(index / 4 - 1.5) * 60}px`,
                '--scale': `${0.5 + (index % 3) * 0.3}`
              } as React.CSSProperties}
            />
          ))}
        </div>
      </div>
    </div>
  )
}