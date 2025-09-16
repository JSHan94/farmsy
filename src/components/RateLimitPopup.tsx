import { useEffect, useState } from "react"
import { AlertTriangle, X } from "lucide-react"
import { Button } from "./ui/button"
import styles from "./RateLimitPopup.module.css"

interface RateLimitPopupProps {
  isVisible: boolean
  onClose: () => void
  message?: string
  retryAfter?: number
}

export function RateLimitPopup({
  isVisible,
  onClose,
  message = "주소 검색 요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.",
  retryAfter
}: RateLimitPopupProps) {
  const [countdown, setCountdown] = useState<number>(0)

  useEffect(() => {
    if (isVisible && retryAfter) {
      setCountdown(retryAfter)

      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [isVisible, retryAfter])

  if (!isVisible) return null

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <div className={styles.header}>
          <div className={styles.iconContainer}>
            <AlertTriangle className={styles.icon} />
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.content}>
          <h3 className={styles.title}>Rate Limit 도달</h3>
          <p className={styles.message}>{message}</p>

          {countdown > 0 && (
            <div className={styles.countdown}>
              <p className={styles.countdownText}>
                다시 시도 가능한 시간: <span className={styles.countdownNumber}>{countdown}초</span>
              </p>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{
                    width: `${((retryAfter || 60) - countdown) / (retryAfter || 60) * 100}%`
                  }}
                />
              </div>
            </div>
          )}
        </div>

        <div className={styles.actions}>
          <Button
            onClick={onClose}
            variant="outline"
            className={styles.button}
          >
            확인
          </Button>
          {countdown === 0 && (
            <Button
              onClick={onClose}
              className={styles.retryButton}
            >
              다시 시도
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}