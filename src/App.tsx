import { useState } from "react"
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar"
import { AppSidebar } from "./components/AppSidebar"
import { TaskBoard } from "./components/TaskBoard"
import { WalletConnect } from "./components/WalletConnect"
import { XPProgressBar, useXPSystem } from "./components/XPProgressBar"
import { TaskCompletionCelebration } from "./components/TaskCompletionCelebration"
import { Task } from "./types/blockchain"
import { getAllTasks, enrichTasksWithProtocolData } from "./utils/blockchain"
import styles from './App.module.css'

// Get all tasks from all blockchains and enrich with protocol data
const initialTasks: (Task & { color: string })[] = enrichTasksWithProtocolData(getAllTasks())

export default function App() {
  const [tasks, setTasks] = useState<(Task & { color: string })[]>(initialTasks)
  const { currentXP, currentLevel, gainXP } = useXPSystem(150, 2) // Starting with some XP for demo
  const [celebrationVisible, setCelebrationVisible] = useState(false)
  const [completedTaskTitle, setCompletedTaskTitle] = useState('')

  const handleAddTask = (newTask: Omit<Task, 'id'>) => {
    const enrichedTasks = enrichTasksWithProtocolData([{
      ...newTask,
      id: Date.now().toString()
    } as Task])
    setTasks(prev => [...prev, ...enrichedTasks])
  }

  const handleUpdateTask = (updatedTask: Task) => {
    const enrichedTasks = enrichTasksWithProtocolData([updatedTask])
    setTasks(prev => prev.map(task =>
      task.id === updatedTask.id ? enrichedTasks[0] : task
    ))
  }

  const handleMoveTask = (taskId: string, newStatus: 'backlog' | 'todo' | 'doing' | 'done', previousStatus?: 'backlog' | 'todo' | 'doing' | 'done') => {
    setTasks(prev => prev.map(task =>
      task.id === taskId ? { ...task, status: newStatus } : task
    ))

    // Award XP and show celebration when task is completed (moved to 'done')
    if (newStatus === 'done' && previousStatus !== 'done') {
      const completedTask = tasks.find(task => task.id === taskId)
      if (completedTask) {
        setCompletedTaskTitle(completedTask.title)
        setCelebrationVisible(true)
        // Use the task's XP reward instead of fixed 25
        gainXP(completedTask.xpReward || 25)
      }
    }
  }

  const handleCelebrationComplete = () => {
    setCelebrationVisible(false)
    setCompletedTaskTitle('')
  }

  return (
    <SidebarProvider>
      <div className={styles.appContainer}>
        <AppSidebar />
        <div className={styles.mainContainer}>
          {/* Header */}
          <header className={styles.header}>
            <div className={styles.headerContent}>
              <SidebarTrigger />
              <div className={styles.headerRight}>
                <XPProgressBar
                  currentXP={currentXP}
                  currentLevel={currentLevel}
                />
                <WalletConnect />
              </div>
            </div>
          </header>
          
          {/* Main Content */}
          <main className={styles.mainContent}>
            <TaskBoard 
              tasks={tasks}
              onAddTask={handleAddTask}
              onUpdateTask={handleUpdateTask}
              onMoveTask={handleMoveTask}
            />
          </main>
        </div>

        {/* Task Completion Celebration */}
        <TaskCompletionCelebration
          isVisible={celebrationVisible}
          taskTitle={completedTaskTitle}
          onComplete={handleCelebrationComplete}
        />
      </div>
    </SidebarProvider>
  )
}