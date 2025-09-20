import { useRef, useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Badge } from './ui/badge'
import { ExternalLink } from 'lucide-react'
import { Task } from '../types/blockchain'
import styles from './TaskCalendar.module.css'

interface TaskCalendarProps {
  tasks: (Task & { color: string })[]
  onTaskClick?: (task: Task) => void
  onDateClick?: (date: string) => void
}

export function TaskCalendar({ tasks, onTaskClick, onDateClick }: TaskCalendarProps) {
  const calendarRef = useRef<FullCalendar>(null)
  const [selectedTask, setSelectedTask] = useState<(Task & { color: string }) | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Helper function to get color based on exploreCategory
  const getCategoryColor = (exploreCategory?: string) => {
    switch (exploreCategory) {
      case 'protocol':
        return '#6366f1' // Indigo
      case 'social':
        return '#10b981' // Emerald
      case 'irl':
        return '#f59e0b' // Amber
      default:
        return '#6b7280' // Gray
    }
  }

  // Convert tasks to calendar events
  const calendarEvents = tasks.map(task => {
    const categoryColor = getCategoryColor(task.exploreCategory)
    return {
      id: task.id,
      title: task.title,
      start: task.startDate,
      backgroundColor: categoryColor,
      borderColor: categoryColor,
      textColor: '#ffffff',
      extendedProps: {
        task,
        difficulty: task.difficulty,
        protocol: task.protocol,
        status: task.status,
        xpReward: task.xpReward,
        exploreCategory: task.exploreCategory
      }
    }
  })

  const handleEventClick = (clickInfo: any) => {
    const task = clickInfo.event.extendedProps.task
    const taskWithColor = tasks.find(t => t.id === task.id)
    if (taskWithColor) {
      setSelectedTask(taskWithColor)
      setIsDialogOpen(true)
    }
    if (onTaskClick && task) {
      onTaskClick(task)
    }
  }

  const handleDateClick = (dateClickInfo: any) => {
    if (onDateClick) {
      onDateClick(dateClickInfo.dateStr)
    }
  }

  const renderEventContent = (eventInfo: any) => {
    const { protocol, xpReward } = eventInfo.event.extendedProps

    return (
      <div className={styles.eventContent}>
        <div className={styles.eventTitle}>
          {eventInfo.event.title}
        </div>
        <div className={styles.eventMeta}>
          <span className={styles.eventProtocol}>{protocol}</span>
          <span className={styles.eventXP}>+{xpReward} XP</span>
        </div>
      </div>
    )
  }

  useEffect(() => {
    // Auto-resize calendar when window resizes
    const handleResize = () => {
      if (calendarRef.current) {
        calendarRef.current.getApi().updateSize()
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleExternalLink = (link: string) => {
    window.open(link, '_blank')
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setSelectedTask(null)
  }

  return (
    <Card className={styles.calendarCard}>
      <CardContent className={styles.calendarContent}>
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: ''
          }}
          events={calendarEvents}
          eventClick={handleEventClick}
          dateClick={handleDateClick}
          eventContent={renderEventContent}
          height="auto"
          dayMaxEvents={3}
          moreLinkText="more tasks"
          eventDisplay="block"
          displayEventTime={false}
          eventClassNames={(arg) => {
            const status = arg.event.extendedProps.status
            return [`${styles.event}`, `${styles[`event${status.charAt(0).toUpperCase() + status.slice(1)}`]}`]
          }}
          dayCellClassNames={(arg) => {
            const today = new Date().toDateString()
            const cellDate = arg.date.toDateString()
            return cellDate === today ? styles.today : ''
          }}
          buttonText={{
            today: 'Today',
            month: 'Month',
            week: 'Week',
            day: 'Day'
          }}
          firstDay={1} // Start week on Monday
          weekNumbers={false}
          navLinks={true}
          selectable={true}
          selectMirror={true}
          unselectAuto={true}
          eventMouseEnter={(mouseEnterInfo) => {
            const el = mouseEnterInfo.el
            el.style.transform = 'scale(1.05)'
            el.style.zIndex = '100'
            el.style.transition = 'transform 0.2s ease'
          }}
          eventMouseLeave={(mouseLeaveInfo) => {
            const el = mouseLeaveInfo.el
            el.style.transform = 'scale(1)'
            el.style.zIndex = 'auto'
          }}
        />
      </CardContent>

      {/* Task Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className={styles.taskDialog}>
          <DialogHeader>
            <DialogTitle className={styles.dialogTitle}>
              Task Details
            </DialogTitle>
          </DialogHeader>

          {selectedTask && (
            <div className={styles.taskDetails}>
              {/* Task Header */}
              <div className={styles.taskHeader}>
                <div className={styles.taskTitleSection}>
                  <h3 className={styles.taskTitle}>{selectedTask.title}</h3>
                  <Badge
                    variant="secondary"
                    className={styles.statusBadge}
                    style={{ backgroundColor: selectedTask.color }}
                  >
                    {selectedTask.status}
                  </Badge>
                </div>

                {selectedTask.externalLink && (
                  <button
                    onClick={() => handleExternalLink(selectedTask.externalLink!)}
                    className={styles.goButton}
                  >
                    <ExternalLink size={16} />
                    Go
                  </button>
                )}
              </div>

              {/* Task Description */}
              {selectedTask.description && (
                <div className={styles.taskDescription}>
                  <h4>Description</h4>
                  <p>{selectedTask.description}</p>
                </div>
              )}

              {/* Task Metadata */}
              <div className={styles.taskMetadata}>
                <div className={styles.metadataGrid}>
                  <div className={styles.metadataItem}>
                    <span className={styles.metadataLabel}>Protocol</span>
                    <span className={styles.metadataValue}>{selectedTask.protocol}</span>
                  </div>
                  <div className={styles.metadataItem}>
                    <span className={styles.metadataLabel}>Category</span>
                    <span className={styles.metadataValue}>{selectedTask.category}</span>
                  </div>
                  <div className={styles.metadataItem}>
                    <span className={styles.metadataLabel}>Difficulty</span>
                    <span className={styles.metadataValue}>{selectedTask.difficulty}</span>
                  </div>
                  <div className={styles.metadataItem}>
                    <span className={styles.metadataLabel}>XP Reward</span>
                    <span className={styles.metadataValue}>+{selectedTask.xpReward} XP</span>
                  </div>
                  {selectedTask.dueDate && (
                    <div className={styles.metadataItem}>
                      <span className={styles.metadataLabel}>Due Date</span>
                      <span className={styles.metadataValue}>
                        {new Date(selectedTask.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  )
}