import { useEffect, useState } from 'react'
import styles from './LevelUpVideoOverlay.module.css'

interface LevelUpVideoOverlayProps {
  isVisible: boolean
  onClose: () => void
  newLevel: number
}

export function LevelUpVideoOverlay({ isVisible, onClose, newLevel }: LevelUpVideoOverlayProps) {
  const [isVideoEnded, setIsVideoEnded] = useState(false)

  useEffect(() => {
    if (!isVisible) {
      setIsVideoEnded(false)
      return
    }

    // Auto close after video ends + delay
    const timer = setTimeout(() => {
      onClose()
    }, 5000) // 5 seconds total overlay time

    return () => clearTimeout(timer)
  }, [isVisible, onClose])

  const handleVideoEnded = () => {
    setIsVideoEnded(true)
    // Auto close after a short delay when video ends
    setTimeout(onClose, 1000)
  }

  const handleOverlayClick = () => {
    onClose()
  }

  if (!isVisible) return null

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.container} onClick={(e) => e.stopPropagation()}>

        {/* Level Up Text */}
        <div className={styles.levelUpText}>
          <h1 className={styles.title}>LEVEL UP!</h1>
          <div className={styles.newLevel}>Level {newLevel}</div>
        </div>

        {/* Video Container */}
        <div className={styles.videoContainer}>
          <video
            src="/otter2.mp4"
            autoPlay
            muted
            playsInline
            className={styles.video}
            onEnded={handleVideoEnded}
          />
        </div>

        {/* Close prompt */}
        {isVideoEnded && (
          <div className={styles.closePrompt}>
            <p>Click anywhere to continue</p>
          </div>
        )}

        {/* Sparkle effects */}
        <div className={styles.sparkles}>
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className={styles.sparkle}
              style={{
                '--delay': `${i * 0.2}s`,
                '--angle': `${i * 45}deg`
              } as React.CSSProperties}
            />
          ))}
        </div>
      </div>
    </div>
  )
}