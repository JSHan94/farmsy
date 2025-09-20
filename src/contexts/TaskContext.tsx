import { createContext, useContext, useState, useEffect } from "react"
import type { Task } from "../types/blockchain"
import { getAllTasks, enrichTasksWithProtocolData } from "../utils/blockchain"
import { usePersistence, usePersistedXPSystem } from "./PersistenceContext"

// Get all tasks from all blockchains and enrich with protocol data
const getInitialTasks = (): (Task & { color: string })[] => {
  return enrichTasksWithProtocolData(getAllTasks())
}

interface TaskContextType {
  tasks: (Task & { color: string })[]
  addTask: (newTask: Omit<Task, 'id'>) => void
  updateTask: (updatedTask: Task) => void
  moveTask: (taskId: string, newStatus: 'backlog' | 'todo' | 'doing' | 'done', previousStatus?: 'backlog' | 'todo' | 'doing' | 'done') => void
  deleteTask: (taskId: string) => void
  resetTasks: () => void
  getTaskById: (taskId: string) => (Task & { color: string }) | undefined
  getTasksByStatus: (status: 'backlog' | 'todo' | 'doing' | 'done') => (Task & { color: string })[]
  getTasksByProtocol: (protocol: string) => (Task & { color: string })[]
  getTasksByDifficulty: (difficulty: 'easy' | 'medium' | 'hard') => (Task & { color: string })[]
  getTaskStatistics: () => {
    total: number
    completed: number
    inProgress: number
    pending: number
    completionRate: number
  }
}

const TaskContext = createContext<TaskContextType | undefined>(undefined)

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const { persistTasks, getPersistedTasks } = usePersistence()
  const { gainXP } = usePersistedXPSystem()

  // Initialize tasks from persisted data or default data
  const [tasks, setTasks] = useState<(Task & { color: string })[]>(() => {
    const persisted = getPersistedTasks()
    if (persisted.length > 0) {
      return enrichTasksWithProtocolData(persisted)
    }
    return getInitialTasks()
  })

  // Persist tasks whenever they change
  useEffect(() => {
    persistTasks(tasks)
  }, [tasks, persistTasks])

  const addTask = (newTask: Omit<Task, 'id'>) => {
    const enrichedTasks = enrichTasksWithProtocolData([{
      ...newTask,
      id: Date.now().toString()
    } as Task])
    setTasks(prev => [...prev, ...enrichedTasks])
  }

  const updateTask = (updatedTask: Task) => {
    const enrichedTasks = enrichTasksWithProtocolData([updatedTask])
    setTasks(prev => prev.map(task =>
      task.id === updatedTask.id ? enrichedTasks[0] : task
    ))
  }

  const moveTask = (taskId: string, newStatus: 'backlog' | 'todo' | 'doing' | 'done', previousStatus?: 'backlog' | 'todo' | 'doing' | 'done') => {
    setTasks(prev => prev.map(task =>
      task.id === taskId ? { ...task, status: newStatus } : task
    ))

    // Award XP when task is completed (moved to 'done')
    if (newStatus === 'done' && previousStatus !== 'done') {
      const completedTask = tasks.find(task => task.id === taskId)
      if (completedTask) {
        // Use the task's XP reward instead of fixed 25
        gainXP(completedTask.xpReward || 25)
      }
    }
  }

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId))
  }

  const resetTasks = () => {
    // Reset all tasks to initial state (all available/backlog)
    const initialTasks = getAllTasks()
    const resetTasks = initialTasks.map(task => ({
      ...task,
      status: 'available' as const
    }))
    const enrichedTasks = enrichTasksWithProtocolData(resetTasks)
    setTasks(enrichedTasks)
    persistTasks(resetTasks)
  }

  const getTaskById = (taskId: string) => {
    return tasks.find(task => task.id === taskId)
  }

  const getTasksByStatus = (status: 'backlog' | 'todo' | 'doing' | 'done') => {
    return tasks.filter(task => task.status === status)
  }

  const getTasksByProtocol = (protocol: string) => {
    return tasks.filter(task => task.protocol === protocol)
  }

  const getTasksByDifficulty = (difficulty: 'easy' | 'medium' | 'hard') => {
    return tasks.filter(task => task.difficulty === difficulty)
  }

  const getTaskStatistics = () => {
    const total = tasks.length
    const completed = tasks.filter(task => task.status === 'done').length
    const inProgress = tasks.filter(task => task.status === 'doing').length
    const pending = tasks.filter(task => task.status === 'todo' || task.status === 'backlog').length

    return {
      total,
      completed,
      inProgress,
      pending,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
    }
  }

  const value: TaskContextType = {
    tasks,
    addTask,
    updateTask,
    moveTask,
    deleteTask,
    resetTasks,
    getTaskById,
    getTasksByStatus,
    getTasksByProtocol,
    getTasksByDifficulty,
    getTaskStatistics
  }

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  )
}

export function useTaskContext() {
  const context = useContext(TaskContext)
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider')
  }
  return context
}