import { useState, useRef, useEffect } from "react"
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
  pointerWithin,
  rectIntersection,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import styles from './TaskBoard.module.css'

import { Task } from '../types/blockchain'
import { getAllProtocols, getFilterOptions } from '../utils/blockchain'

const protocolConfig = getAllProtocols()

interface TaskBoardProps {
  tasks: (Task & { color: string })[]
  onAddTask: (task: Omit<Task, 'id'>) => void
  onUpdateTask: (task: Task) => void
  onMoveTask: (taskId: string, newStatus: 'backlog' | 'todo' | 'doing' | 'done', previousStatus?: 'backlog' | 'todo' | 'doing' | 'done') => void
}

const columns = [
  { id: 'backlog', title: 'Backlog', status: 'backlog' as const },
  { id: 'todo', title: 'To Do', status: 'todo' as const },
  { id: 'doing', title: 'Doing', status: 'doing' as const },
  { id: 'done', title: 'Done', status: 'done' as const },
]

const filterOptions = getFilterOptions()

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
  const [stableDraggedOver, setStableDraggedOver] = useState<string | null>(null)
  const [activeId, setActiveId] = useState<string | null>(null)
  const dragOverTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const dragLeaveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const boardRef = useRef<HTMLDivElement>(null)
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  // Custom collision detection for better sorting stability
  const collisionDetectionStrategy = (args: any) => {
    if (activeId && activeTask) {
      // First, get the closest droppable elements using pointerWithin
      const pointerIntersections = pointerWithin(args)
      if (pointerIntersections.length > 0) {
        return pointerIntersections
      }
      
      // Fall back to rectangle intersection
      return rectIntersection(args)
    }

    return closestCenter(args)
  }

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const task = tasks.find(task => task.id === active.id)
    
    setActiveId(active.id as string)
    setActiveTask(task || null)
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    
    // Clear any existing timeouts
    if (dragOverTimeoutRef.current) {
      clearTimeout(dragOverTimeoutRef.current)
    }
    if (dragLeaveTimeoutRef.current) {
      clearTimeout(dragLeaveTimeoutRef.current)
    }
    
    if (!over) {
      // Delay clearing the stable state to prevent flickering
      dragLeaveTimeoutRef.current = setTimeout(() => {
        setStableDraggedOver(null)
        setDraggedOver(null)
      }, 100) // 100ms delay before clearing
      return
    }
    
    // Check if we're over a column
    const isOverAColumn = over.data.current?.type === 'column'
    
    if (isOverAColumn) {
      const newStatus = over.id as 'backlog' | 'todo' | 'doing' | 'done'
      setDraggedOver(newStatus)
      
      // Set stable state immediately if entering a new column
      if (stableDraggedOver !== newStatus) {
        dragOverTimeoutRef.current = setTimeout(() => {
          setStableDraggedOver(newStatus)
        }, 150) // 150ms delay for stability
      } else {
        setStableDraggedOver(newStatus)
      }
    } else {
      setDraggedOver(null)
      // Delay clearing stable state
      dragLeaveTimeoutRef.current = setTimeout(() => {
        setStableDraggedOver(null)
      }, 100)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    
    // Clean up all timeouts
    if (dragOverTimeoutRef.current) {
      clearTimeout(dragOverTimeoutRef.current)
      dragOverTimeoutRef.current = null
    }
    if (dragLeaveTimeoutRef.current) {
      clearTimeout(dragLeaveTimeoutRef.current)
      dragLeaveTimeoutRef.current = null
    }
    
    setActiveId(null)
    setActiveTask(null)
    setDraggedOver(null)
    setStableDraggedOver(null)
    
    if (!over) {
      return
    }
    
    const activeId = active.id as string
    const overId = over.id as string
    
    // Find the active task
    const activeTask = tasks.find(task => task.id === activeId)
    if (!activeTask) {
      return
    }

    // Check if we're dropping over another task (for reordering within column)
    const overTask = tasks.find(task => task.id === overId)
    if (overTask && activeTask.status === overTask.status) {
      // Handle reordering within the same column
      const columnTasks = getFilteredTasks(activeTask.status)
      const activeIndex = columnTasks.findIndex(task => task.id === activeId)
      const overIndex = columnTasks.findIndex(task => task.id === overId)
      
      if (activeIndex !== overIndex) {
        const reorderedTasks = arrayMove(columnTasks, activeIndex, overIndex)
        // Update task orders based on new positions
        reorderedTasks.forEach((task, index) => {
          if (task.id === activeId || task.id === overId || Math.abs(activeIndex - overIndex) > 1) {
            const updatedTask = { ...task, order: index }
            onUpdateTask(updatedTask)
          }
        })
      }
      return
    }

    // Check if we're dropping over a column
    const isOverAColumn = over.data.current?.type === 'column' || 
                         ['backlog', 'todo', 'doing', 'done'].includes(overId)
    
    
    if (isOverAColumn) {
      const newStatus = overId as 'backlog' | 'todo' | 'doing' | 'done'
      if (activeTask.status !== newStatus) {

        // Get the target column tasks to determine the new order
        const targetColumnTasks = getFilteredTasks(newStatus)
        const newOrder = targetColumnTasks.length

        // Store previous status for XP calculation
        const previousStatus = activeTask.status

        // Update task with new status and order
        const updatedTask = { ...activeTask, status: newStatus, order: newOrder }
        onUpdateTask(updatedTask)

        // Call onMoveTask for additional handling (like XP gains)
        onMoveTask(activeTask.id, newStatus, previousStatus)
      }
    }
  }

  const getFilteredTasks = (status: string) => {
    let filteredTasks = tasks.filter(task => task.status === status)
    if (filter !== 'all') {
      filteredTasks = filteredTasks.filter(task => task.protocol === filter)
    }
    // Sort by order field, fallback to id for consistent ordering
    return filteredTasks.sort((a, b) => {
      const orderA = a.order ?? parseInt(a.id)
      const orderB = b.order ?? parseInt(b.id)
      return orderA - orderB
    })
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetectionStrategy}
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
                            backgroundColor: protocolConfig[option.value]?.brandColor || '#gray',
                            borderColor: protocolConfig[option.value]?.brandColor || '#gray'
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

      <div ref={boardRef} className={styles.boardGrid}>
        {columns.map((column) => {
          const columnTasks = getFilteredTasks(column.status)
          
          return (
            <DroppableColumn 
              key={column.id}
              id={column.status}
              title={column.title}
              taskCount={columnTasks.length}
              isDraggedOver={stableDraggedOver === column.status}
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