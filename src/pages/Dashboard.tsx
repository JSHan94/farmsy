import { useState } from "react"
import { TaskBoard } from "../components/TaskBoard"
import { TaskCompletionCelebration } from "../components/TaskCompletionCelebration"
import type { Task } from "../types/blockchain"
import { getAllTasks, enrichTasksWithProtocolData } from "../utils/blockchain"
import { useXPSystem } from "../components/XPProgressBar"

// Get all tasks from all blockchains and enrich with protocol data
const initialTasks: (Task & { color: string })[] = enrichTasksWithProtocolData(getAllTasks())

export function Dashboard() {
  const [tasks, setTasks] = useState<(Task & { color: string })[]>(initialTasks)
  const { gainXP } = useXPSystem(150, 2)
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
    <>
      <TaskBoard
        tasks={tasks}
        onAddTask={handleAddTask}
        onUpdateTask={handleUpdateTask}
        onMoveTask={handleMoveTask}
      />

      {/* Task Completion Celebration */}
      <TaskCompletionCelebration
        isVisible={celebrationVisible}
        taskTitle={completedTaskTitle}
        onComplete={handleCelebrationComplete}
      />
    </>
  )
}