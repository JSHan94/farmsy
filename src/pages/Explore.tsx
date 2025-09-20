import { useState, useMemo } from "react"
import { Search, Filter, Grid, List, Users, Calendar, Gamepad2 } from "lucide-react"
import { Button } from "../components/Button"
import { Input } from "../components/Input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/Tabs"
import { ExploreTaskCard, type ExploreTask } from "../components/ExploreTaskCard"
import { useTaskContext } from "../contexts/TaskContext"
import exploreTasksData from "../data/exploreTasks.json"
import styles from './Explore.module.css'

type CategoryType = 'all' | 'protocol' | 'social' | 'irl'

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

export function Explore() {
  const { addTask } = useTaskContext()
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [addedTasks, setAddedTasks] = useState<Set<string>>(new Set())
  const [animatingTasks, setAnimatingTasks] = useState<Set<string>>(new Set())

  // Flatten all tasks from the JSON data
  const allExploreTasks: ExploreTask[] = useMemo(() => {
    const tasks: ExploreTask[] = []
    Object.entries(exploreTasksData.categories).forEach(([_, categoryData]) => {
      tasks.push(...categoryData.tasks)
    })
    return tasks
  }, [])

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
    // Start animation
    setAnimatingTasks(prev => new Set(prev).add(exploreTask.id))

    // Convert explore task to dashboard task format
    const newTask = {
      title: exploreTask.name,
      description: exploreTask.description,
      protocol: exploreTask.protocol as any, // Type assertion for now
      category: exploreTask.category,
      difficulty: exploreTask.droplets <= 5 ? 'easy' as const :
                  exploreTask.droplets <= 15 ? 'medium' as const : 'hard' as const,
      xpReward: exploreTask.droplets,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
      blockchain: 'sui' as const,
      status: 'backlog' as const
    }

    // Add task to global state
    addTask(newTask)

    // After animation completes, remove from visible tasks
    setTimeout(() => {
      setAddedTasks(prev => new Set(prev).add(exploreTask.id))
      setAnimatingTasks(prev => {
        const newSet = new Set(prev)
        newSet.delete(exploreTask.id)
        return newSet
      })
    }, 600) // Animation duration
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
                    .filter(task => !addedTasks.has(task.id)) // Hide tasks that have been added
                    .map((task) => (
                      <ExploreTaskCard
                        key={task.id}
                        task={task}
                        onAddToBacklog={handleAddToBacklog}
                        isAdded={addedTasks.has(task.id)}
                        isAnimating={animatingTasks.has(task.id)}
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