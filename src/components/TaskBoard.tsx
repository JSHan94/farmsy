import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { TaskCard } from "./TaskCard"
import { AddTaskDialog } from "./AddTaskDialog"
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  useDroppable,
  closestCenter,
  pointerWithin,
  rectIntersection,
  Modifier,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import styles from './TaskBoard.module.css'

import { Task } from '../types/blockchain'
import { getAllProtocols } from '../utils/blockchain'

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
  const [activeTask, setActiveTask] = useState<(Task & { color: string }) | null>(null)
  const [draggedOver, setDraggedOver] = useState<string | null>(null)
  const [stableDraggedOver, setStableDraggedOver] = useState<string | null>(null)
  const [activeId, setActiveId] = useState<string | null>(null)
  const dragOverTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const dragLeaveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const boardRef = useRef<HTMLDivElement>(null)

  const protocols = getAllProtocols()

  // Custom modifier to center the drag overlay on the cursor with responsive adjustments
  const cursorCenterModifier: Modifier = ({ transform, activatorEvent, draggingNodeRect }) => {
    // Get actual dragging element dimensions if available, otherwise use responsive defaults
    let cardWidth = 280
    let cardHeight = 120 // Fixed to match TaskCard height

    // Use actual dimensions from the dragging element if available
    if (draggingNodeRect) {
      cardWidth = draggingNodeRect.width
      cardHeight = draggingNodeRect.height
    } else {
      // Fallback to responsive dimensions that match CSS
      const viewportWidth = window.innerWidth
      if (viewportWidth < 480) {
        cardWidth = 240 // Matches CSS for small mobile
      } else if (viewportWidth < 768) {
        cardWidth = 260 // Matches CSS for mobile
      } else {
        cardWidth = 280 // Matches CSS for desktop
      }
      // Height remains consistent across all screen sizes
      cardHeight = 120
    }

    // Calculate offset to center card exactly on cursor
    let offsetX = -(cardWidth / 2)
    let offsetY = -(cardHeight / 2)

    // Handle touch events differently - account for finger position
    if (activatorEvent && 'touches' in activatorEvent && activatorEvent.touches.length > 0) {
      // Touch event - offset for finger covering the element
      offsetY -= 40 // Move card up so it's visible above the finger
      offsetX += 15 // Slight horizontal offset to avoid finger overlap
    }

    return {
      ...transform,
      x: transform.x + offsetX,
      y: transform.y + offsetY,
    }
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 8,
      },
    })
  )

  // Enhanced collision detection for more flexible dropping
  const collisionDetectionStrategy = (args: any) => {
    if (activeId && activeTask) {
      const { droppableRects, droppableContainers, active } = args

      // Get pointer coordinates
      const activatorEvent = args.active.rect.current.initial
      if (!activatorEvent) return closestCenter(args)

      const pointerX = activatorEvent.x
      const pointerY = activatorEvent.y

      // Find columns that are within proximity range
      const columnProximityRange = 100 // pixels
      const proximityColumns = []

      for (const [id, container] of droppableContainers.entries()) {
        if (container.data.current?.type === 'column') {
          const rect = droppableRects.get(id)
          if (rect) {
            // Check if pointer is within extended column bounds
            const extendedLeft = rect.left - columnProximityRange
            const extendedRight = rect.right + columnProximityRange
            const extendedTop = rect.top - columnProximityRange
            const extendedBottom = rect.bottom + columnProximityRange

            if (pointerX >= extendedLeft && pointerX <= extendedRight &&
                pointerY >= extendedTop && pointerY <= extendedBottom) {
              // Calculate distance to column center for priority
              const columnCenterX = rect.left + rect.width / 2
              const columnCenterY = rect.top + rect.height / 2
              const distance = Math.sqrt(
                Math.pow(pointerX - columnCenterX, 2) +
                Math.pow(pointerY - columnCenterY, 2)
              )

              proximityColumns.push({
                id,
                distance,
                container
              })
            }
          }
        }
      }

      // If we found nearby columns, return the closest one
      if (proximityColumns.length > 0) {
        proximityColumns.sort((a, b) => a.distance - b.distance)
        return [{
          id: proximityColumns[0].id,
          data: proximityColumns[0].container.data
        }]
      }

      // First, try pointerWithin for precise detection
      const pointerIntersections = pointerWithin(args)
      if (pointerIntersections.length > 0) {
        return pointerIntersections
      }

      // Enhanced rectangle intersection with expanded hit areas
      const rectIntersections = rectIntersection(args)
      if (rectIntersections.length > 0) {
        return rectIntersections
      }

      // Fall back to closest center
      return closestCenter(args)
    }

    return closestCenter(args)
  }

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const task = tasks.find(task => task.id === active.id)

    setActiveId(active.id as string)

    // Ensure the active task has color property for TaskCard
    if (task) {
      const enrichedTask = {
        ...task,
        color: task.color || protocols[task.protocol]?.color || 'bg-gray-50 border-gray-500'
      }
      setActiveTask(enrichedTask)
    } else {
      setActiveTask(null)
    }
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

    // Check if we're over a column or a task within a column
    const isOverAColumn = over.data.current?.type === 'column'
    const isOverATask = over.data.current?.type === 'task'

    let targetColumnStatus = null

    if (isOverAColumn) {
      targetColumnStatus = over.id as 'backlog' | 'todo' | 'doing' | 'done'
    } else if (isOverATask) {
      // If over a task, find which column that task belongs to
      const overTask = tasks.find(task => task.id === over.id)
      if (overTask) {
        targetColumnStatus = overTask.status
      }
    }

    if (targetColumnStatus) {
      setDraggedOver(targetColumnStatus)

      // Set stable state immediately if entering a new column
      if (stableDraggedOver !== targetColumnStatus) {
        dragOverTimeoutRef.current = setTimeout(() => {
          setStableDraggedOver(targetColumnStatus)
        }, 150) // 150ms delay for stability
      } else {
        setStableDraggedOver(targetColumnStatus)
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

    // Check if we're dropping over another task
    const overTask = tasks.find(task => task.id === overId)

    if (overTask) {
      // If dropping over a task in a different column, move to that column
      if (activeTask.status !== overTask.status) {
        const newStatus = overTask.status
        const targetColumnTasks = getFilteredTasks(newStatus)
        const overIndex = targetColumnTasks.findIndex(task => task.id === overId)
        const newOrder = overIndex >= 0 ? overIndex : targetColumnTasks.length

        // Store previous status for XP calculation
        const previousStatus = activeTask.status

        // Update task with new status and order
        const updatedTask = { ...activeTask, status: newStatus, order: newOrder }
        onUpdateTask(updatedTask)

        // Update orders for tasks that come after the insertion point
        targetColumnTasks.slice(newOrder).forEach((task, index) => {
          if (task.id !== activeId) {
            const updatedTask = { ...task, order: newOrder + index + 1 }
            onUpdateTask(updatedTask)
          }
        })

        // Call onMoveTask for additional handling (like XP gains)
        onMoveTask(activeTask.id, newStatus, previousStatus)
        return
      } else if (activeTask.status === overTask.status) {
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
    const filteredTasks = tasks.filter(task => task.status === status)
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
                    showDescription={false}
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
      </div>

      <DragOverlay
        dropAnimation={{
          duration: 300,
          easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
        }}
        style={{
          cursor: 'grabbing',
        }}
        adjustScale={false}
        modifiers={[cursorCenterModifier]}
      >
        {activeTask ? (
          <div className={styles.dragOverlay}>
            <TaskCard task={activeTask} onEdit={() => {}} showDescription={false} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}