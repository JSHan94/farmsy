import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Button } from "./Button"
import { Plus, ExternalLink } from "lucide-react"
import styles from './AddTaskDialog.module.css'


interface AddTaskDialogProps {
  onAddTask?: (task: any) => void
  defaultStatus?: 'backlog' | 'todo' | 'doing' | 'done'
}

export function AddTaskDialog({ onAddTask, defaultStatus = 'backlog' }: AddTaskDialogProps) {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const handleClick = () => {
    navigate('/explore')
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className={styles.addButton}
      onClick={handleClick}
    >
      <Plus className={styles.addButtonIcon} />
      Add Task
    </Button>
  )
}