import { useRef, useEffect } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Task } from '../types/blockchain'
import styles from './TaskCalendar.module.css'

interface TaskCalendarProps {
  tasks: (Task & { color: string })[]
  onTaskClick?: (task: Task) => void
  onDateClick?: (date: string) => void
}

export function TaskCalendar({ tasks, onTaskClick, onDateClick }: TaskCalendarProps) {
  const calendarRef = useRef<FullCalendar>(null)

  // Convert tasks to calendar events
  const calendarEvents = tasks.map(task => ({
    id: task.id,
    title: task.title,
    start: task.dueDate || new Date().toISOString().split('T')[0],
    backgroundColor: task.color,
    borderColor: task.color,
    textColor: '#ffffff',
    extendedProps: {
      task,
      difficulty: task.difficulty,
      protocol: task.protocol,
      status: task.status,
      xpReward: task.xpReward
    }
  }))

  const handleEventClick = (clickInfo: any) => {
    const task = clickInfo.event.extendedProps.task
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
    const { difficulty, protocol, status, xpReward } = eventInfo.event.extendedProps

    return (
      <div className={styles.eventContent}>
        <div className={styles.eventTitle}>{eventInfo.event.title}</div>
        <div className={styles.eventMeta}>
          <span className={styles.eventProtocol}>{protocol}</span>
          <span className={styles.eventDifficulty}>{difficulty}</span>
          <span className={styles.eventXP}>+{xpReward} XP</span>
        </div>
        <div className={`${styles.eventStatus} ${styles[`status${status.charAt(0).toUpperCase() + status.slice(1)}`]}`}>
          {status}
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

  return (
    <Card className={styles.calendarCard}>
      <CardHeader>
        <CardTitle className={styles.calendarTitle}>
          Task Calendar
          <span className={styles.taskCount}>
            {tasks.length} tasks
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className={styles.calendarContent}>
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
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
    </Card>
  )
}