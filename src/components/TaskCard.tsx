import { Card, CardContent } from "./ui/card"
import { ExternalLink } from "lucide-react"
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useEffect, useState } from 'react'
import styles from './TaskCard.module.css'
import { Task } from '../types/blockchain'
import { getAllProtocols } from '../utils/blockchain'

const protocolConfig = getAllProtocols()

// Water drop sound generation
const playWaterDropSound = () => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()

  // Create a quick water drop sound effect
  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()

  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)

  // Water drop frequency sweep
  oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
  oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.3)

  // Volume envelope for natural sound
  gainNode.gain.setValueAtTime(0, audioContext.currentTime)
  gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01)
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)

  oscillator.type = 'sine'
  oscillator.start(audioContext.currentTime)
  oscillator.stop(audioContext.currentTime + 0.3)
}

interface TaskCardProps {
  task: Task & { color: string }
  onEdit?: (task: Task) => void
}

const getProtocolClass = (protocol: string) => {
  // Dynamic protocol class mapping based on available protocols
  const classMap: Record<string, string> = {
    'Suilend': styles.colorGreen || styles.colorBlue,
    'Cetus': styles.colorIndigo || styles.colorPurple,
    'Haedal': styles.colorRed || styles.colorRed,
    'Bluefin': styles.colorBlue || styles.colorBlue,
    'Momentum': styles.colorYellow || styles.colorYellow,
    'Scallop': styles.colorTeal || styles.colorGreen,
    'Kriya': styles.colorPink || styles.colorPurple,
    // Add more protocols as needed
  }
  return classMap[protocol] || styles.colorGray
}

export function TaskCard({ task, onEdit }: TaskCardProps) {
  const [isCompleted, setIsCompleted] = useState(task.status === 'done')
  const [previousStatus, setPreviousStatus] = useState(task.status)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'task',
      task
    }
  })

  // Handle completion state when task status changes
  useEffect(() => {
    if (task.status === 'done' && previousStatus !== 'done') {
      setIsCompleted(true)

      // Play water drop sound
      try {
        playWaterDropSound()
      } catch (error) {
        console.log('Audio not available:', error)
      }
    }

    if (task.status !== 'done') {
      setIsCompleted(false)
    }

    setPreviousStatus(task.status)
  }, [task.status, previousStatus])

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }
  
  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    if (task.externalLink) {
      window.open(task.externalLink, '_blank')
    }
  }

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger edit if dragging or clicking external link
    if (isDragging || (e.target as HTMLElement).closest('button')) {
      return
    }
    onEdit?.(task)
  }

  const protocol = protocolConfig[task.protocol]
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', { 
      month: 'short', 
      day: 'numeric' 
    })
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${styles.taskCard} ${getProtocolClass(task.protocol)} ${
        isCompleted ? styles.completed : ''
      }`}
      onClick={handleCardClick}
      data-dragging={isDragging}
      data-completed={isCompleted}
      {...attributes}
      {...listeners}
    >
      <div className={styles.cardContent}>
        {/* Header with protocol logo, title and external link */}
        <div className={styles.cardHeader}>
          <div className={styles.titleSection}>
            <div className={styles.protocolLogo}>
              <img
                src={protocol.icon}
                alt={`${protocol.name} logo`}
                className={styles.protocolIcon}
              />
            </div>
            <h4 className={styles.taskTitle}>{task.title}</h4>
          </div>
          <button
            onClick={handleLinkClick}
            className={styles.linkButton}
          >
            <ExternalLink className={styles.linkIcon} />
          </button>
        </div>

        {/* Task content */}
        <div className={styles.taskContent}>
          {task.description && (
            <p className={styles.taskDescription}>{task.description}</p>
          )}
        </div>

        {/* Date range footer */}
        {(task.startDate || task.endDate) && (
          <div className={styles.dateRange}>
            {task.startDate && (
              <span className={styles.startDate}>
                {formatDate(task.startDate)}
              </span>
            )}
            {task.startDate && task.endDate && (
              <span className={styles.dateSeparator}>→</span>
            )}
            {task.endDate && (
              <span className={styles.endDate}>
                {formatDate(task.endDate)}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}