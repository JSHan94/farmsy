import type { BlockchainId, Task, Protocol, Blockchain, TaskData, BlockchainData } from '../types/blockchain'
import protocolData from '../data/protocol.json'
import taskData from '../data/task.json'

// Type-safe access to blockchain data
export const getBlockchainData = (): BlockchainData => protocolData as any
export const getTaskData = (): TaskData => taskData as TaskData

// Get all available blockchains
export const getAvailableBlockchains = (): BlockchainId[] => {
  return Object.keys(getBlockchainData().blockchains) as BlockchainId[]
}

// Get blockchain info by ID
export const getBlockchain = (blockchainId: BlockchainId): Blockchain | undefined => {
  return getBlockchainData().blockchains[blockchainId]
}

// Get protocol by blockchain and protocol name
export const getProtocol = (blockchainId: BlockchainId, protocolName: string): Protocol | undefined => {
  const blockchain = getBlockchain(blockchainId)
  return blockchain?.protocols[protocolName]
}

// Get all protocols for a blockchain
export const getProtocolsByBlockchain = (blockchainId: BlockchainId): Record<string, Protocol> => {
  const blockchain = getBlockchain(blockchainId)
  return blockchain?.protocols || {}
}

// Get all protocols across all blockchains (flat structure for backward compatibility)
export const getAllProtocols = (): Record<string, Protocol & { blockchain: BlockchainId }> => {
  const result: Record<string, Protocol & { blockchain: BlockchainId }> = {}
  const blockchainData = getBlockchainData()

  Object.entries(blockchainData.blockchains).forEach(([blockchainId, blockchain]) => {
    Object.entries(blockchain.protocols).forEach(([protocolName, protocol]) => {
      result[protocolName] = {
        ...protocol,
        blockchain: blockchainId as BlockchainId
      }
    })
  })

  return result
}

// Get tasks by blockchain
export const getTasksByBlockchain = (blockchainId: BlockchainId): Task[] => {
  const taskData_ = getTaskData()
  return taskData_.blockchains[blockchainId]?.tasks || []
}

// Get all tasks across all blockchains
export const getAllTasks = (): Task[] => {
  const taskData_ = getTaskData()
  const allTasks: Task[] = []

  Object.values(taskData_.blockchains).forEach(({ tasks }) => {
    allTasks.push(...tasks)
  })

  return allTasks
}

// Add computed color to tasks based on protocol
export const enrichTasksWithProtocolData = (tasks: Task[]): (Task & { color: string })[] => {
  const protocols = getAllProtocols()

  return tasks.map(task => ({
    ...task,
    color: protocols[task.protocol]?.color || 'bg-gray-50 border-gray-500'
  }))
}

// Filter options for UI components
export const getFilterOptions = (blockchainId?: BlockchainId) => {
  const options = [{ value: 'all', label: 'All Protocols' }]

  if (blockchainId) {
    // Filter for specific blockchain
    const protocols = getProtocolsByBlockchain(blockchainId)
    Object.entries(protocols).forEach(([name, protocol]) => {
      options.push({ value: name, label: protocol.name })
    })
  } else {
    // All protocols across all blockchains
    const protocols = getAllProtocols()
    Object.entries(protocols).forEach(([name, protocol]) => {
      options.push({
        value: name,
        label: `${protocol.name} (${protocol.blockchain.toUpperCase()})`
      })
    })
  }

  return options
}

// Get blockchain filter options
export const getBlockchainFilterOptions = () => {
  const blockchainData = getBlockchainData()
  const options = [{ value: 'all', label: 'All Blockchains' }]

  Object.entries(blockchainData.blockchains).forEach(([id, blockchain]) => {
    options.push({ value: id, label: blockchain.name })
  })

  return options
}

// Get XP reward based on difficulty
export const getDefaultXPReward = (difficulty: Task['difficulty']): number => {
  const rewards = {
    easy: 20,
    medium: 35,
    hard: 50
  }
  return rewards[difficulty]
}

// Validate task data structure
export const isValidTask = (task: any): task is Task => {
  return (
    typeof task.id === 'string' &&
    typeof task.title === 'string' &&
    typeof task.description === 'string' &&
    ['backlog', 'todo', 'doing', 'done'].includes(task.status) &&
    typeof task.blockchain === 'string' &&
    typeof task.protocol === 'string' &&
    typeof task.category === 'string' &&
    typeof task.xpReward === 'number' &&
    ['easy', 'medium', 'hard'].includes(task.difficulty)
  )
}

// Helper to generate unique task IDs
export const generateTaskId = (blockchainId: BlockchainId): string => {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 1000)
  return `${blockchainId}-${timestamp}-${random}`
}