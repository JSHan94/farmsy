import { useState } from "react"
import { Calendar, Grid } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/Tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { TaskBoard } from "../components/TaskBoard"
import { TaskCalendar } from "../components/TaskCalendar"
import { TaskCompletionCelebration } from "../components/TaskCompletionCelebration"
import { PointsAnimationOverlay } from "../components/PointsAnimationOverlay"
import { useTaskContext } from "../contexts/TaskContext"
import styles from './Dashboard.module.css'


export function Dashboard() {
  const { tasks, addTask, updateTask, moveTask } = useTaskContext()
  const [celebrationVisible, setCelebrationVisible] = useState(false)
  const [completedTaskTitle, setCompletedTaskTitle] = useState('')
  const [pointsAnimationVisible, setPointsAnimationVisible] = useState(false)
  const [earnedPoints, setEarnedPoints] = useState(0)
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [activeTab, setActiveTab] = useState('board')
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Filter tasks based on category selection
  const filteredTasks = categoryFilter === 'all'
    ? tasks
    : tasks.filter(task => task.exploreCategory === categoryFilter)

  const handleMoveTask = (taskId: string, newStatus: 'backlog' | 'todo' | 'doing' | 'done', previousStatus?: 'backlog' | 'todo' | 'doing' | 'done') => {
    // Award XP and show celebration when task is completed (moved to 'done')
    if (newStatus === 'done' && previousStatus !== 'done') {
      const completedTask = tasks.find(task => task.id === taskId)
      if (completedTask) {
        setCompletedTaskTitle(completedTask.title)
        setEarnedPoints(completedTask.xpReward || 25)

        // Show points animation first, then celebration
        setPointsAnimationVisible(true)

        // Show celebration after points animation starts
        setTimeout(() => {
          setCelebrationVisible(true)
        }, 1000)
      }
    }

    // Call the hook's moveTask function
    moveTask(taskId, newStatus, previousStatus)
  }

  const handleCelebrationComplete = () => {
    setCelebrationVisible(false)
    setCompletedTaskTitle('')
  }

  const handlePointsAnimationComplete = () => {
    setPointsAnimationVisible(false)
    setEarnedPoints(0)
  }

  const handleTaskClick = (task: any) => {
    console.log('Task clicked:', task)
    // TODO: Open task details modal
  }

  const handleDateClick = (date: string) => {
    console.log('Date clicked:', date)
    // TODO: Create new task for selected date
  }

  const handleTabChange = (newTab: string) => {
    if (newTab !== activeTab && !isTransitioning) {
      setIsTransitioning(true)

      // Start fade out effect first
      setTimeout(() => {
        setActiveTab(newTab)
      }, 100)

      // Complete transition
      setTimeout(() => {
        setIsTransitioning(false)
      }, 400)
    }
  }

  return (
    <div className={styles.container}>
      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* TossInvest-style Tab Navigation */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className={styles.tabsContainer}>
          <div className={styles.tabsNav}>
            <div className={styles.tabsList}>
              <TabsList className={styles.tabsListInner}>
                <TabsTrigger value="board" className={styles.tabTrigger}>
                  <Grid className={styles.tabIcon} />
                  Board
                </TabsTrigger>
                <TabsTrigger value="calendar" className={styles.tabTrigger}>
                  <Calendar className={styles.tabIcon} />
                  Calendar
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Category Filter */}
            <div className={styles.filterSection}>
              <span className={styles.filterLabel}>Filter :</span>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className={styles.filterSelect}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    <div className={styles.filterOption}>
                      All
                    </div>
                  </SelectItem>
                  <SelectItem value="protocol">
                    <div className={styles.filterOption}>
                      <div
                        className={styles.filterColorSwatch}
                        style={{
                          backgroundColor: '#6366f1',
                          borderColor: '#6366f1'
                        }}
                      />
                      Protocol
                    </div>
                  </SelectItem>
                  <SelectItem value="social">
                    <div className={styles.filterOption}>
                      <div
                        className={styles.filterColorSwatch}
                        style={{
                          backgroundColor: '#10b981',
                          borderColor: '#10b981'
                        }}
                      />
                      Social
                    </div>
                  </SelectItem>
                  <SelectItem value="irl">
                    <div className={styles.filterOption}>
                      <div
                        className={styles.filterColorSwatch}
                        style={{
                          backgroundColor: '#f59e0b',
                          borderColor: '#f59e0b'
                        }}
                      />
                      IRL
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <TabsContent value="board" className={`${styles.tabContent} ${activeTab === 'board' ? styles.boardView : ''}`}>
            <div className={`${styles.contentWrapper} ${isTransitioning ? styles.contentTransitioning : ''}`}>
              <div className={`${styles.viewContent} ${isTransitioning ? styles.fadeOut : styles.fadeIn}`}>
                <TaskBoard
                  tasks={filteredTasks}
                  onAddTask={addTask}
                  onUpdateTask={updateTask}
                  onMoveTask={handleMoveTask}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="calendar" className={`${styles.tabContent} ${activeTab === 'calendar' ? styles.calendarView : ''}`}>
            <div className={`${styles.contentWrapper} ${isTransitioning ? styles.contentTransitioning : ''}`}>
              <div className={`${styles.viewContent} ${isTransitioning ? styles.fadeOut : styles.fadeIn}`}>
                <TaskCalendar
                  tasks={filteredTasks}
                  onTaskClick={handleTaskClick}
                  onDateClick={handleDateClick}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Points Animation Overlay */}
      <PointsAnimationOverlay
        isVisible={pointsAnimationVisible}
        points={earnedPoints}
        onComplete={handlePointsAnimationComplete}
        duration={2500}
      />

      {/* Task Completion Celebration */}
      <TaskCompletionCelebration
        isVisible={celebrationVisible}
        taskTitle={completedTaskTitle}
        onComplete={handleCelebrationComplete}
      />
    </div>
  )
}