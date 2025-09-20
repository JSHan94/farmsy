import { useEffect, useState } from 'react'
import { Star, Sparkles, Crown } from 'lucide-react'
import { CharacterStage } from '../utils/characterEvolution'
import styles from './LevelUpAnimation.module.css'

interface LevelUpAnimationProps {
  isVisible: boolean
  onClose: () => void
  newLevel: number
  evolutionData?: CharacterStage | null
}

export function LevelUpAnimation({ isVisible, onClose, newLevel, evolutionData }: LevelUpAnimationProps) {
  const [animationPhase, setAnimationPhase] = useState<'level-up' | 'evolution' | 'complete'>('level-up')
  const [showEvolution, setShowEvolution] = useState(false)

  useEffect(() => {
    if (!isVisible) return

    const timer1 = setTimeout(() => {
      if (evolutionData) {
        setAnimationPhase('evolution')
        setShowEvolution(true)
      } else {
        setAnimationPhase('complete')
      }
    }, 2000)

    const timer2 = setTimeout(() => {
      if (evolutionData) {
        setAnimationPhase('complete')
      }
    }, 4000)

    const timer3 = setTimeout(() => {
      onClose()
    }, evolutionData ? 6000 : 3500)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [isVisible, evolutionData, onClose])

  const handleClose = () => {
    setAnimationPhase('level-up')
    setShowEvolution(false)
    onClose()
  }

  if (!isVisible) return null

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.container} onClick={(e) => e.stopPropagation()}>

        {/* Level Up Phase */}
        {animationPhase === 'level-up' && (
          <div className={styles.levelUpContent}>
            <div className={styles.levelUpBurst}>
              <div className={styles.burstRing1}></div>
              <div className={styles.burstRing2}></div>
              <div className={styles.burstRing3}></div>
            </div>

            <div className={styles.levelUpIcon}>
              <Crown size={64} />
            </div>

            <h1 className={styles.levelUpTitle}>
              LEVEL UP!
            </h1>

            <div className={styles.newLevel}>
              Level {newLevel}
            </div>

            <div className={styles.sparkles}>
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className={styles.sparkle}
                  style={{
                    '--delay': `${i * 0.1}s`,
                    '--angle': `${i * 30}deg`
                  } as React.CSSProperties}
                >
                  <Sparkles size={16} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Evolution Phase */}
        {animationPhase === 'evolution' && evolutionData && (
          <div className={styles.evolutionContent}>
            <div className={styles.evolutionBurst}>
              <div className={styles.evolutionRing1}></div>
              <div className={styles.evolutionRing2}></div>
            </div>

            <div className={styles.evolutionIcon}>
              <Star size={48} />
            </div>

            <h2 className={styles.evolutionTitle}>
              Character Evolution!
            </h2>

            <div className={styles.characterPreview}>
              <video
                src={evolutionData.character}
                autoPlay
                loop
                muted
                className={styles.evolutionCharacter}
              />
            </div>

            <div className={styles.characterInfo}>
              <h3 className={styles.characterName}>{evolutionData.name}</h3>
              <p className={styles.characterDescription}>
                {evolutionData.unlockMessage}
              </p>
            </div>

            <div className={styles.evolutionSparkles}>
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className={styles.evolutionSparkle}
                  style={{
                    '--delay': `${i * 0.15}s`,
                    '--angle': `${i * 45}deg`
                  } as React.CSSProperties}
                >
                  <Star size={12} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Complete Phase */}
        {animationPhase === 'complete' && (
          <div className={styles.completeContent}>
            <div className={styles.completeMessage}>
              <h3>Congratulations!</h3>
              <p>Keep completing tasks to unlock more evolutions!</p>
            </div>

            <button
              className={styles.closeButton}
              onClick={handleClose}
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  )
}