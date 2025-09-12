import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { TaskCard } from "./TaskCard"
import { AddTaskDialog } from "./AddTaskDialog"
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  closestCenter,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import styles from './TaskBoard.module.css'

type BlockchainProtocol = 'ethereum' | 'bitcoin' | 'solana' | 'polygon' | 'arbitrum' | 'optimism' | 'avalanche' | 'bsc'

interface Task {
  id: string
  title: string
  description: string
  status: 'backlog' | 'todo' | 'doing' | 'done'
  protocol: BlockchainProtocol
  color: string
  externalLink?: string
}

const protocolConfig = {
  ethereum: { name: 'Ethereum', color: 'bg-blue-50 border-blue-500', brandColor: '#627EEA' },
  bitcoin: { name: 'Bitcoin', color: 'bg-orange-50 border-orange-500', brandColor: '#F7931A' },
  solana: { name: 'Solana', color: 'bg-purple-50 border-purple-500', brandColor: '#9945FF' },
  polygon: { name: 'Polygon', color: 'bg-violet-50 border-violet-500', brandColor: '#8247E5' },
  arbitrum: { name: 'Arbitrum', color: 'bg-blue-50 border-blue-600', brandColor: '#28A0F0' },
  optimism: { name: 'Optimism', color: 'bg-red-50 border-red-500', brandColor: '#FF0420' },
  avalanche: { name: 'Avalanche', color: 'bg-red-50 border-red-600', brandColor: '#E84142' },
  bsc: { name: 'BSC', color: 'bg-yellow-50 border-yellow-500', brandColor: '#F3BA2F' }
}

interface TaskBoardProps {
  tasks: Task[]
  onAddTask: (task: Omit<Task, 'id'>) => void
  onUpdateTask: (task: Task) => void
  onMoveTask: (taskId: string, newStatus: 'backlog' | 'todo' | 'doing' | 'done') => void
}

const columns = [
  { id: 'backlog', title: 'Backlog', status: 'backlog' as const },
  { id: 'todo', title: 'To Do', status: 'todo' as const },
  { id: 'doing', title: 'Doing', status: 'doing' as const },
  { id: 'done', title: 'Done', status: 'done' as const },
]

const filterOptions = [
  { value: 'all', label: 'All Protocols' },
  { value: 'ethereum', label: 'Ethereum', className: styles.colorEthereum },
  { value: 'bitcoin', label: 'Bitcoin', className: styles.colorBitcoin },
  { value: 'solana', label: 'Solana', className: styles.colorSolana },
  { value: 'polygon', label: 'Polygon', className: styles.colorPolygon },
  { value: 'arbitrum', label: 'Arbitrum', className: styles.colorArbitrum },
  { value: 'optimism', label: 'Optimism', className: styles.colorOptimism },
  { value: 'avalanche', label: 'Avalanche', className: styles.colorAvalanche },
  { value: 'bsc', label: 'BSC', className: styles.colorBsc },
]

// Droppable Column Component
function DroppableColumn({ 
  id, 
  title, 
  children, 
  taskCount,
  isDraggedOver
}: { 
  id: string
  title: string
  children: React.ReactNode
  taskCount: number
  isDraggedOver: boolean
}) {
  const { setNodeRef, isOver } = useDroppable({ 
    id,
    data: {
      type: 'column',
      status: id,
      columnId: id,
      accepts: ['task']
    }
  })
  
  const isActive = isOver || isDraggedOver
  
  return (
    <div 
      ref={setNodeRef} 
      className={`${styles.columnWrapper} ${isActive ? styles.columnWrapperActive : ''}`}
    >
      <Card 
        className={`${styles.column} ${
          isActive ? styles.columnOver : ''
        } ${isDraggedOver ? styles.columnHighlight : ''}`}
      >
        <CardHeader className={styles.columnHeader}>
          <CardTitle className={styles.columnTitle}>
            <span>{title}</span>
            <span className={styles.taskCount}>
              {taskCount}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className={`${styles.columnContent} ${styles.droppableArea}`}>
          <div className={styles.tasksContainer}>
            {children}
          </div>
          {isActive && (
            <div className={styles.dropIndicator}>
              <span>📁 Drop task here</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export function TaskBoard({ tasks, onAddTask, onUpdateTask, onMoveTask }: TaskBoardProps) {
  const [filter, setFilter] = useState('all')
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [draggedOver, setDraggedOver] = useState<string | null>(null)
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    console.log('🎯 Drag started:', event.active.id)
    const { active } = event
    const task = tasks.find(task => task.id === active.id)
    console.log('📋 Found task:', task?.title)
    setActiveTask(task || null)
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    console.log('🔄 Drag over:', over?.id || 'none', over?.data?.current)
    
    if (!over) {
      setDraggedOver(null)
      return
    }
    
    // Check if we're over a column
    const isOverAColumn = over.data.current?.type === 'column'
    console.log('📍 Over column:', isOverAColumn, over.id)
    
    if (isOverAColumn) {
      const newStatus = over.id as 'backlog' | 'todo' | 'doing' | 'done'
      setDraggedOver(newStatus)
    } else {
      setDraggedOver(null)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    console.log('🎯 Drag ended - Active:', active.id, 'Over:', over?.id || 'none', 'Over Data:', over?.data?.current)
    
    setActiveTask(null)
    setDraggedOver(null)
    
    if (!over) {
      console.log('❌ No drop target found')
      return
    }
    
    const activeId = active.id as string
    const overId = over.id
    
    // Find the task being dragged
    const activeTask = tasks.find(task => task.id === activeId)
    if (!activeTask) {
      console.log('❌ Active task not found:', activeId)
      return
    }
    
    // Check if we're dropping over a column (either directly or on the column ID)
    const isOverAColumn = over.data.current?.type === 'column' || 
                         ['backlog', 'todo', 'doing', 'done'].includes(overId as string)
    
    console.log('📍 Drop analysis:', {
      isOverAColumn,
      overId,
      overData: over.data.current,
      validColumnIds: ['backlog', 'todo', 'doing', 'done'].includes(overId as string)
    })
    
    if (isOverAColumn) {
      const newStatus = overId as 'backlog' | 'todo' | 'doing' | 'done'
      if (activeTask.status !== newStatus) {
        console.log('⚡ Moving task "' + activeTask.title + '" from', activeTask.status, 'to', newStatus)
        onMoveTask(activeId, newStatus)
      } else {
        console.log('ℹ️ Task already in', newStatus)
      }
    } else {
      console.log('❌ Not dropping over a valid column:', overId)
    }
  }

  const getFilteredTasks = (status: string) => {
    let filteredTasks = tasks.filter(task => task.status === status)
    if (filter !== 'all') {
      filteredTasks = filteredTasks.filter(task => task.protocol === filter)
    }
    return filteredTasks
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className={styles.container}>
      <div className={styles.header}>
        <h1>Task Board</h1>
        <div className={styles.filterSection}>
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Filter by protocol:</span>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className={styles.filterSelect}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {filterOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className={styles.filterOption}>
                      {option.value !== 'all' && (
                        <div 
                          className={styles.filterColorSwatch} 
                          style={{ 
                            backgroundColor: protocolConfig[option.value as BlockchainProtocol]?.brandColor || '#gray',
                            borderColor: protocolConfig[option.value as BlockchainProtocol]?.brandColor || '#gray'
                          }} 
                        />
                      )}
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className={styles.boardGrid}>
        {columns.map((column) => {
          const columnTasks = getFilteredTasks(column.status)
          
          return (
            <DroppableColumn 
              key={column.id}
              id={column.status}
              title={column.title}
              taskCount={columnTasks.length}
              isDraggedOver={draggedOver === column.status}
            >
              <SortableContext 
                items={columnTasks.map(task => task.id)}
                strategy={verticalListSortingStrategy}
              >
                {columnTasks.map((task) => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    onEdit={onUpdateTask}
                  />
                ))}
              </SortableContext>
              {column.status === 'backlog' && (
                <AddTaskDialog 
                  onAddTask={onAddTask} 
                  defaultStatus={column.status}
                />
              )}
            </DroppableColumn>
          )
        })}
      </div>
      
      <DragOverlay
        dropAnimation={{
          duration: 300,
          easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
        }}
        style={{
          transformOrigin: '0 0',
        }}
      >
        {activeTask ? (
          <div className={styles.dragOverlay}>
            <TaskCard task={activeTask} onEdit={() => {}} />
          </div>
        ) : null}
      </DragOverlay>
      </div>
    </DndContext>
  )
}