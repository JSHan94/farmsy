import { useState, useMemo } from "react"
import { Search, Filter, Grid, List, Users, Calendar, Gamepad2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/Tabs"
import { ExploreTaskCard, type ExploreTask } from "../components/ExploreTaskCard"
import { useTaskContext } from "../contexts/TaskContext"
import { type Task, type ExploreCategory } from "../types/blockchain"
import { toast } from "sonner"
import styles from './Explore.module.css'

type CategoryType = 'all' | ExploreCategory

interface CategoryInfo {
  id: CategoryType
  name: string
  description: string
  icon: React.ComponentType<any>
  color: string
}

const categories: CategoryInfo[] = [
  {
    id: 'all',
    name: 'All Tasks',
    description: 'View all available tasks',
    icon: Grid,
    color: 'rgb(59, 130, 246)'
  },
  {
    id: 'protocol',
    name: 'Protocol',
    description: 'Blockchain protocol tasks',
    icon: Gamepad2,
    color: 'rgb(168, 85, 247)'
  },
  {
    id: 'social',
    name: 'Social',
    description: 'Social media engagement',
    icon: Users,
    color: 'rgb(34, 197, 94)'
  },
  {
    id: 'irl',
    name: 'IRL',
    description: 'In-real-life events',
    icon: Calendar,
    color: 'rgb(249, 115, 22)'
  }
]

// Helper function to get protocol icons
const getProtocolIcon = (protocol: string): string => {
  const icons: Record<string, string> = {
    'Overtake': '/overtake.png',
    'Scallop': '/scallop.svg',
    'Twitter': '🐦',
    'Discord': '💬',
    'Telegram': '✈️',
    'Hackathon': '💻',
    'Meetup': '🤝',
    'Conference': '🎤',
    'Workshop': '🛠️',
    'Networking': '🌐',
    'Validator': '⚡'
  }
  return icons[protocol] || '🔗'
}

// Helper function to get task logo
const getTaskLogo = (task: Task): string => {
  if (task.category === 'social') return getProtocolIcon(task.protocol)
  if (task.exploreCategory === 'irl') return getProtocolIcon(task.protocol)
  return getProtocolIcon(task.protocol)
}

export function Explore() {
  const { tasks, updateTask } = useTaskContext()
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [addedTasks, setAddedTasks] = useState<Set<string>>(new Set())
  const [animatingTasks, setAnimatingTasks] = useState<Set<string>>(new Set())
  const [animationCounter, setAnimationCounter] = useState(0)
  const [successTasks, setSuccessTasks] = useState<Set<string>>(new Set())

  // Get all available tasks (explore tasks) from TaskContext
  const allExploreTasks: ExploreTask[] = useMemo(() => {
    return tasks
      .filter(task => task.status === 'available')
      .map(task => ({
        id: task.id,
        name: task.title,
        description: task.description,
        droplets: task.xpReward,
        logo: getTaskLogo(task),
        protocol: task.protocol,
        active: true,
        category: task.exploreCategory || 'protocol'
      }))
  }, [tasks])

  // Filter tasks based on category and search
  const filteredTasks = useMemo(() => {
    let filtered = allExploreTasks

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(task => task.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter(task =>
        task.name.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query) ||
        task.protocol.toLowerCase().includes(query)
      )
    }

    // Sort tasks to prioritize protocol category first
    filtered = filtered.sort((a, b) => {
      // Protocol tasks come first
      if (a.category === 'protocol' && b.category !== 'protocol') return -1
      if (a.category !== 'protocol' && b.category === 'protocol') return 1
      // For tasks with same category priority, maintain original order
      return 0
    })

    return filtered
  }, [allExploreTasks, selectedCategory, searchQuery])

  // Get category statistics
  const categoryStats = useMemo(() => {
    const stats: Record<CategoryType, number> = {
      all: allExploreTasks.length,
      protocol: 0,
      social: 0,
      irl: 0
    }

    allExploreTasks.forEach(task => {
      if (task.category === 'protocol' || task.category === 'social' || task.category === 'irl') {
        stats[task.category as CategoryType]++
      }
    })

    return stats
  }, [allExploreTasks])

  const handleAddToBacklog = (exploreTask: ExploreTask) => {
    console.log('🎯 Starting animation for task:', exploreTask.name)

    // Increment counter for stagger effect
    setAnimationCounter(prev => prev + 1)

    // Add haptic feedback for mobile devices
    if ('vibrate' in navigator) {
      navigator.vibrate(50) // Brief haptic feedback
    }

    // Show success toast notification
    toast.success('Successfully added to backlog!', {
      duration: 1000,
      style: {
        backgroundColor: '#10b981',
        color: 'white',
        border: 'none'
      }
    })

    // Add immediate success feedback - this changes button to "Added"
    setSuccessTasks(prev => {
      console.log('✅ Adding success state for:', exploreTask.id)
      return new Set(prev).add(exploreTask.id)
    })

    // Mark as added immediately so button stays as "Added"
    setAddedTasks(prev => new Set(prev).add(exploreTask.id))

    // Find the original task in TaskContext
    const originalTask = tasks.find(task => task.id === exploreTask.id)
    if (!originalTask) return

    // Update the task status from 'available' to 'backlog'
    const updatedTask = { ...originalTask, status: 'backlog' as const }

    // Update task status immediately
    updateTask(updatedTask)

    // Start animation after showing "Added" button for 1 second
    setTimeout(() => {
      console.log('🚀 Starting swipe animation for:', exploreTask.id)
      setAnimatingTasks(prev => new Set(prev).add(exploreTask.id))
      setSuccessTasks(prev => {
        const newSet = new Set(prev)
        newSet.delete(exploreTask.id)
        return newSet
      })
    }, 1000) // Wait 1 second before starting animation

    // After animation completes, remove from visible tasks
    setTimeout(() => {
      console.log('🏁 Animation complete, removing task:', exploreTask.id)
      setAnimatingTasks(prev => {
        const newSet = new Set(prev)
        newSet.delete(exploreTask.id)
        return newSet
      })
    }, 2000) // Total 2 seconds (1s wait + 1s for card to disappear)
  }

  return (
    <div className={styles.container}>
      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as CategoryType)} className={styles.categoryTabs}>
          <TabsList className={styles.tabsList}>
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className={styles.tabTrigger}
                >
                  <Icon className={styles.tabIcon} />
                  <span className={styles.tabLabel}>{category.name}</span>
                  <span className={styles.tabCount}>({categoryStats[category.id]})</span>
                </TabsTrigger>
              )
            })}
          </TabsList>

          {/* Task Lists */}
          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id} className={styles.tabContent}>
              <div className={styles.tasksList}>
                {filteredTasks.length > 0 ? (
                  filteredTasks
                    .filter(task => !addedTasks.has(task.id) || animatingTasks.has(task.id)) // Keep tasks visible during animation
                    .map((task) => (
                      <ExploreTaskCard
                        key={task.id}
                        task={task}
                        onAddToBacklog={handleAddToBacklog}
                        isAdded={addedTasks.has(task.id)}
                        isAnimating={animatingTasks.has(task.id)}
                        isSuccess={successTasks.has(task.id)}
                      />
                    ))
                ) : (
                  <div className={styles.emptyState}>
                    <div className={styles.emptyStateContent}>
                      <Grid className={styles.emptyStateIcon} />
                      <h3>No tasks found</h3>
                      <p>Try adjusting your search or selecting a different category.</p>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}