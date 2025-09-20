// Base types for blockchain and protocol system
export type BlockchainId = 'sui' | 'ethereum' | 'solana' | 'polygon' | 'arbitrum'

export type TaskStatus = 'backlog' | 'todo' | 'doing' | 'done' | 'available'

export type ExploreCategory = 'protocol' | 'social' | 'irl'

export type ProtocolCategory =
  | 'lending'
  | 'dex'
  | 'staking'
  | 'trading'
  | 'farming'
  | 'derivatives'
  | 'infrastructure'
  | 'gaming'
  | 'nft'
  | 'dao'
  | 'social'
  | 'storage'
  | 'competition'
  | 'events'
  | 'education'

export type TaskDifficulty = 'easy' | 'medium' | 'hard'

export interface Protocol {
  name: string
  color: string
  brandColor: string
  symbol: string
  icon: string
  category: ProtocolCategory
}

export interface Blockchain {
  name: string
  symbol: string
  brandColor: string
  icon: string
  protocols: Record<string, Protocol>
}

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  blockchain: BlockchainId
  protocol: string
  category: ProtocolCategory
  color?: string // Computed from protocol
  externalLink?: string
  startDate?: string
  endDate?: string
  dueDate?: string // For calendar integration
  order?: number
  xpReward: number
  difficulty: TaskDifficulty
  exploreCategory?: ExploreCategory // For categorizing explore tasks
}

export interface BlockchainData {
  blockchains: Record<BlockchainId, Blockchain>
}

export interface TaskData {
  blockchains: Record<BlockchainId, {
    tasks: Task[]
  }>
}

// Helper types for specific blockchains
export type SuiProtocol = 'Suilend' | 'Cetus' | 'Haedal' | 'Bluefin' | 'Momentum' | 'Scallop' | 'Kriya'

// Add more blockchain-specific protocol types as needed
export type EthereumProtocol = 'Uniswap' | 'Aave' | 'Compound' | 'Curve' | 'Balancer'
export type SolanaProtocol = 'Raydium' | 'Serum' | 'Solend' | 'Marinade' | 'Jupiter'