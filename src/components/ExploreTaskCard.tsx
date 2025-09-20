import { Plus, Star, CheckCircle, Circle } from "lucide-react"
import { Button } from "./Button"
import styles from './ExploreTaskCard.module.css'

interface ExploreTask {
  id: string
  name: string
  description: string
  droplets: number
  logo: string
  protocol: string
  active: boolean
  category: string
}

interface ExploreTaskCardProps {
  task: ExploreTask
  onAddToBacklog: (task: ExploreTask) => void
  isAdded?: boolean
}

export function ExploreTaskCard({ task, onAddToBacklog, isAdded = false }: ExploreTaskCardProps) {
  return (
    <div className={`${styles.taskCard} ${!task.active ? styles.taskCardInactive : ''}`}>
      {/* Left Section: Logo and Task Info */}
      <div className={styles.taskInfo}>
        <div className={styles.logoSection}>
          <div className={styles.logo}>
            {task.logo}
          </div>
          <div className={styles.statusIndicator}>
            {task.active ? (
              <Circle className={`${styles.statusIcon} ${styles.statusActive}`} />
            ) : (
              <Circle className={`${styles.statusIcon} ${styles.statusInactive}`} />
            )}
          </div>
        </div>

        <div className={styles.taskDetails}>
          <div className={styles.taskHeader}>
            <h3 className={styles.taskName}>{task.name}</h3>
            <div className={styles.taskMeta}>
              <span className={styles.protocol}>{task.protocol}</span>
              <span className={styles.separator}>•</span>
              <span className={styles.category}>{task.category}</span>
            </div>
          </div>
          <p className={styles.taskDescription}>{task.description}</p>
        </div>
      </div>

      {/* Right Section: Points and Action */}
      <div className={styles.taskActions}>
        <div className={styles.pointsSection}>
          <div className={styles.pointsBadge}>
            <Star className={styles.pointsIcon} />
            <span className={styles.pointsValue}>{task.droplets} droplets</span>
          </div>
        </div>

        <Button
          onClick={() => onAddToBacklog(task)}
          disabled={!task.active || isAdded}
          className={`${styles.addButton} ${isAdded ? styles.addButtonAdded : ''}`}
          variant={isAdded ? "outline" : "default"}
        >
          {isAdded ? (
            <>
              <CheckCircle className={styles.buttonIcon} />
              Added
            </>
          ) : (
            <>
              <Plus className={styles.buttonIcon} />
              Add to Backlog
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

export type { ExploreTask }