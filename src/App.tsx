import { useState } from "react"
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar"
import { AppSidebar } from "./components/AppSidebar"
import { TaskBoard } from "./components/TaskBoard"
import { WalletConnect } from "./components/WalletConnect"
import styles from './App.module.css'

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

// Mock initial tasks
const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Ethereum DeFi Integration',
    description: 'Integrate with Uniswap V3 for token swapping',
    status: 'backlog',
    protocol: 'ethereum',
    color: protocolConfig.ethereum.color,
    externalLink: 'https://uniswap.org'
  },
  {
    id: '2',
    title: 'Bitcoin Lightning Network',
    description: 'Implement Lightning Network payments',
    status: 'todo',
    protocol: 'bitcoin',
    color: protocolConfig.bitcoin.color,
    externalLink: 'https://lightning.network'
  },
  {
    id: '3',
    title: 'Solana NFT Marketplace',
    description: 'Build NFT marketplace on Solana blockchain',
    status: 'doing',
    protocol: 'solana',
    color: protocolConfig.solana.color
  },
  {
    id: '4',
    title: 'Polygon Scaling Solution',
    description: 'Deploy smart contracts on Polygon network',
    status: 'done',
    protocol: 'polygon',
    color: protocolConfig.polygon.color,
    externalLink: 'https://polygon.technology'
  }
]

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)

  const handleAddTask = (newTask: Omit<Task, 'id'>) => {
    const task: Task = {
      ...newTask,
      id: Date.now().toString()
    }
    setTasks(prev => [...prev, task])
  }

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ))
  }

  const handleMoveTask = (taskId: string, newStatus: 'backlog' | 'todo' | 'doing' | 'done') => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ))
  }

  return (
    <SidebarProvider>
      <div className={styles.appContainer}>
        <AppSidebar />
        <div className={styles.mainContainer}>
          {/* Header */}
          <header className={styles.header}>
            <div className={styles.headerContent}>
              <SidebarTrigger />
              <WalletConnect />
            </div>
          </header>
          
          {/* Main Content */}
          <main className={styles.mainContent}>
            <TaskBoard 
              tasks={tasks}
              onAddTask={handleAddTask}
              onUpdateTask={handleUpdateTask}
              onMoveTask={handleMoveTask}
            />
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}