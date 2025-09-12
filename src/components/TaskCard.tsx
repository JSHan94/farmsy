import { Card, CardContent } from "./ui/card"
import { ExternalLink } from "lucide-react"
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import styles from './TaskCard.module.css'

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

interface TaskCardProps {
  task: Task
  onEdit?: (task: Task) => void
}

const getProtocolClass = (protocol: BlockchainProtocol) => {
  const protocolMap: { [key in BlockchainProtocol]: string } = {
    ethereum: styles.colorEthereum || styles.colorBlue,
    bitcoin: styles.colorBitcoin || styles.colorOrange,
    solana: styles.colorSolana || styles.colorPurple,
    polygon: styles.colorPolygon || styles.colorViolet,
    arbitrum: styles.colorArbitrum || styles.colorBlue,
    optimism: styles.colorOptimism || styles.colorRed,
    avalanche: styles.colorAvalanche || styles.colorRed,
    bsc: styles.colorBsc || styles.colorYellow,
  }
  return protocolMap[protocol] || styles.colorGray
}

export function TaskCard({ task, onEdit }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: task.id,
    data: {
      type: 'task',
      task
    }
  })
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }
  
  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    if (task.externalLink) {
      window.open(task.externalLink, '_blank')
    }
  }

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger edit if dragging or clicking external link
    if (isDragging || (e.target as HTMLElement).closest('button')) {
      return
    }
    onEdit?.(task)
  }

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className={`${styles.taskCard} ${getProtocolClass(task.protocol)}`}
      onClick={handleCardClick}
      data-dragging={isDragging}
      {...attributes}
      {...listeners}
    >
      <Card className={styles.cardWrapper}>
        <CardContent className={styles.cardContent}>
          {task.externalLink && (
            <button
              onClick={handleLinkClick}
              className={styles.linkButton}
            >
              <ExternalLink className={styles.linkIcon} />
            </button>
          )}
          <div className={styles.taskContent}>
            <h4 className={styles.taskTitle}>{task.title}</h4>
            {task.description && (
              <p className={styles.taskDescription}>{task.description}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}