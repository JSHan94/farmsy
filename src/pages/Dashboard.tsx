import { useState } from "react"
import { CheckSquare, Plus, Search, Filter, Calendar, Grid } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { TaskBoard } from "../components/TaskBoard"
import { TaskCalendar } from "../components/TaskCalendar"
import { TaskCompletionCelebration } from "../components/TaskCompletionCelebration"
import { useTaskManager } from "../hooks/useTaskManager"

export function Dashboard() {
  const { tasks, addTask, updateTask, moveTask } = useTaskManager()
  const [celebrationVisible, setCelebrationVisible] = useState(false)
  const [completedTaskTitle, setCompletedTaskTitle] = useState('')
  const [searchTerm, setSearchTerm] = useState("")

  // Calculate task statistics
  const totalTasks = tasks.length
  const completedTasks = tasks.filter(task => task.status === 'done').length
  const inProgressTasks = tasks.filter(task => task.status === 'doing').length
  const pendingTasks = tasks.filter(task => task.status === 'todo' || task.status === 'backlog').length

  // Filter tasks based on search term
  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.protocol.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleMoveTask = (taskId: string, newStatus: 'backlog' | 'todo' | 'doing' | 'done', previousStatus?: 'backlog' | 'todo' | 'doing' | 'done') => {
    // Award XP and show celebration when task is completed (moved to 'done')
    if (newStatus === 'done' && previousStatus !== 'done') {
      const completedTask = tasks.find(task => task.id === taskId)
      if (completedTask) {
        setCompletedTaskTitle(completedTask.title)
        setCelebrationVisible(true)
      }
    }

    // Call the hook's moveTask function
    moveTask(taskId, newStatus, previousStatus)
  }

  const handleCelebrationComplete = () => {
    setCelebrationVisible(false)
    setCompletedTaskTitle('')
  }

  const handleTaskClick = (task: any) => {
    console.log('Task clicked:', task)
    // TODO: Open task details modal
  }

  const handleDateClick = (date: string) => {
    console.log('Date clicked:', date)
    // TODO: Create new task for selected date
  }

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        </div>
      </div>


      
      {/* Tasks View Tabs */}
      <Tabs defaultValue="board" className="space-y-4">
        <TabsList>
          <TabsTrigger value="board" className="flex items-center gap-2">
            <Grid className="h-4 w-4" />
            Board View
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Calendar View
          </TabsTrigger>
        </TabsList>

        <TabsContent value="board" className="space-y-4">
          <TaskBoard
            tasks={filteredTasks}
            onAddTask={addTask}
            onUpdateTask={updateTask}
            onMoveTask={handleMoveTask}
          />
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <TaskCalendar
            tasks={filteredTasks}
            onTaskClick={handleTaskClick}
            onDateClick={handleDateClick}
          />
        </TabsContent>
      </Tabs>

      {/* Task Completion Celebration */}
      <TaskCompletionCelebration
        isVisible={celebrationVisible}
        taskTitle={completedTaskTitle}
        onComplete={handleCelebrationComplete}
      />
    </div>
  )
}