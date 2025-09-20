import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Button } from "./Button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Label } from "./ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Plus, ExternalLink } from "lucide-react"
import styles from './AddTaskDialog.module.css'

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

interface AddTaskDialogProps {
  onAddTask: (task: Omit<Task, 'id'>) => void
  defaultStatus?: 'backlog' | 'todo' | 'doing' | 'done'
}

interface TaskTemplate {
  id: string
  title: string
  description: string
  protocol: BlockchainProtocol
  externalLink?: string
  category: string
}

const taskTemplates: TaskTemplate[] = [
  // Ethereum
  { id: 'eth-1', title: 'Deploy Smart Contract', description: 'Deploy and verify smart contract on Ethereum mainnet', protocol: 'ethereum', category: 'Development', externalLink: 'https://ethereum.org' },
  { id: 'eth-2', title: 'Integrate with Uniswap V3', description: 'Add liquidity provision and token swapping functionality', protocol: 'ethereum', category: 'DeFi', externalLink: 'https://uniswap.org' },
  { id: 'eth-3', title: 'ENS Domain Setup', description: 'Configure Ethereum Name Service for dApp', protocol: 'ethereum', category: 'Infrastructure' },
  { id: 'eth-4', title: 'Gas Optimization', description: 'Optimize smart contract gas usage and costs', protocol: 'ethereum', category: 'Optimization' },
  
  // Bitcoin
  { id: 'btc-1', title: 'Lightning Network Integration', description: 'Implement Lightning Network for instant payments', protocol: 'bitcoin', category: 'Payments', externalLink: 'https://lightning.network' },
  { id: 'btc-2', title: 'Multi-sig Wallet Setup', description: 'Configure multi-signature wallet security', protocol: 'bitcoin', category: 'Security' },
  { id: 'btc-3', title: 'Bitcoin Payment Gateway', description: 'Integrate Bitcoin payments for e-commerce', protocol: 'bitcoin', category: 'Payments' },
  { id: 'btc-4', title: 'Cold Storage Implementation', description: 'Set up secure cold storage solution', protocol: 'bitcoin', category: 'Security' },
  
  // Solana
  { id: 'sol-1', title: 'NFT Marketplace Development', description: 'Build NFT marketplace on Solana blockchain', protocol: 'solana', category: 'NFT', externalLink: 'https://solana.com' },
  { id: 'sol-2', title: 'Solana Program Deployment', description: 'Deploy and test Solana program (smart contract)', protocol: 'solana', category: 'Development' },
  { id: 'sol-3', title: 'Token Creation (SPL)', description: 'Create and deploy SPL token on Solana', protocol: 'solana', category: 'Tokens' },
  { id: 'sol-4', title: 'Serum DEX Integration', description: 'Integrate with Serum decentralized exchange', protocol: 'solana', category: 'DeFi' },
  
  // Polygon
  { id: 'poly-1', title: 'Layer 2 Migration', description: 'Migrate dApp from Ethereum to Polygon', protocol: 'polygon', category: 'Scaling', externalLink: 'https://polygon.technology' },
  { id: 'poly-2', title: 'Cross-chain Bridge', description: 'Implement asset bridging between Ethereum and Polygon', protocol: 'polygon', category: 'Infrastructure' },
  { id: 'poly-3', title: 'Polygon SDK Integration', description: 'Integrate Polygon SDK for sidechain development', protocol: 'polygon', category: 'Development' },
  { id: 'poly-4', title: 'MATIC Staking Pool', description: 'Create MATIC token staking mechanism', protocol: 'polygon', category: 'Staking' },
  
  // Arbitrum
  { id: 'arb-1', title: 'Arbitrum One Deployment', description: 'Deploy contracts on Arbitrum One L2 solution', protocol: 'arbitrum', category: 'Scaling' },
  { id: 'arb-2', title: 'Optimistic Rollup Integration', description: 'Implement optimistic rollup functionality', protocol: 'arbitrum', category: 'Infrastructure' },
  { id: 'arb-3', title: 'Cross-layer Communication', description: 'Set up L1-L2 messaging system', protocol: 'arbitrum', category: 'Infrastructure' },
  { id: 'arb-4', title: 'Arbitrum Bridge Setup', description: 'Configure asset bridging to Arbitrum', protocol: 'arbitrum', category: 'Infrastructure' },
  
  // Optimism
  { id: 'op-1', title: 'Optimism Deployment', description: 'Deploy dApp on Optimism L2 network', protocol: 'optimism', category: 'Scaling' },
  { id: 'op-2', title: 'OP Token Integration', description: 'Integrate OP token rewards and governance', protocol: 'optimism', category: 'Governance' },
  { id: 'op-3', title: 'Optimistic Oracle', description: 'Implement Optimistic Oracle for price feeds', protocol: 'optimism', category: 'Oracles' },
  { id: 'op-4', title: 'Retroactive Funding', description: 'Apply for Optimism retroactive public goods funding', protocol: 'optimism', category: 'Funding' },
  
  // Avalanche
  { id: 'avax-1', title: 'Avalanche Subnet Creation', description: 'Create custom Avalanche subnet for specific use case', protocol: 'avalanche', category: 'Infrastructure', externalLink: 'https://avax.network' },
  { id: 'avax-2', title: 'AVAX Staking Integration', description: 'Implement AVAX token staking functionality', protocol: 'avalanche', category: 'Staking' },
  { id: 'avax-3', title: 'Cross-chain DeFi', description: 'Build cross-chain DeFi protocol on Avalanche', protocol: 'avalanche', category: 'DeFi' },
  { id: 'avax-4', title: 'Avalanche Bridge', description: 'Implement asset bridging to Avalanche C-Chain', protocol: 'avalanche', category: 'Infrastructure' },
  
  // BSC
  { id: 'bsc-1', title: 'BSC Smart Contract', description: 'Deploy BEP-20 token and contract on BSC', protocol: 'bsc', category: 'Development' },
  { id: 'bsc-2', title: 'PancakeSwap Integration', description: 'Add liquidity and trading on PancakeSwap DEX', protocol: 'bsc', category: 'DeFi', externalLink: 'https://pancakeswap.finance' },
  { id: 'bsc-3', title: 'BNB Chain Validation', description: 'Set up BNB Chain validator node', protocol: 'bsc', category: 'Infrastructure' },
  { id: 'bsc-4', title: 'BSC-Ethereum Bridge', description: 'Implement cross-chain bridge to Ethereum', protocol: 'bsc', category: 'Infrastructure' },
]

const protocolOptions = [
  { value: 'all', label: 'All Protocols' },
  { value: 'ethereum', label: 'Ethereum' },
  { value: 'bitcoin', label: 'Bitcoin' },
  { value: 'solana', label: 'Solana' },
  { value: 'polygon', label: 'Polygon' },
  { value: 'arbitrum', label: 'Arbitrum' },
  { value: 'optimism', label: 'Optimism' },
  { value: 'avalanche', label: 'Avalanche' },
  { value: 'bsc', label: 'BSC' },
]

export function AddTaskDialog({ onAddTask, defaultStatus = 'backlog' }: AddTaskDialogProps) {
  const [open, setOpen] = useState(false)
  const [protocolFilter, setProtocolFilter] = useState('all')

  const filteredTasks = taskTemplates.filter(task => 
    protocolFilter === 'all' || task.protocol === protocolFilter
  )

  const handleSelectTask = (template: TaskTemplate) => {
    onAddTask({
      title: template.title,
      description: template.description,
      status: defaultStatus,
      protocol: template.protocol,
      color: protocolConfig[template.protocol].color,
      externalLink: template.externalLink,
    })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className={styles.addButton}>
          <Plus className={styles.addButtonIcon} />
          Add Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Select Task Template</DialogTitle>
          <div className={styles.filterSection}>
            <Label htmlFor="protocol-filter">Filter by Protocol:</Label>
            <Select value={protocolFilter} onValueChange={setProtocolFilter}>
              <SelectTrigger className={styles.protocolFilter}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {protocolOptions.map((option) => (
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
        </DialogHeader>
        
        <div className={styles.taskTemplatesContainer}>
          <div className={styles.taskTemplatesGrid}>
            {filteredTasks.map((template) => (
              <Card 
                key={template.id} 
                className={styles.taskTemplateCard}
                onClick={() => handleSelectTask(template)}
              >
                <CardHeader className={styles.taskTemplateHeader}>
                  <div className={styles.taskTemplateTitle}>
                    <div 
                      className={styles.protocolIndicator}
                      style={{ backgroundColor: protocolConfig[template.protocol].brandColor }}
                    />
                    <CardTitle className={styles.templateTitle}>{template.title}</CardTitle>
                    {template.externalLink && (
                      <ExternalLink className={styles.externalLinkIcon} />
                    )}
                  </div>
                  <div className={styles.taskTemplateBadges}>
                    <Badge 
                      variant="secondary" 
                      className={styles.protocolBadge}
                      style={{ 
                        backgroundColor: protocolConfig[template.protocol].color.split(' ')[0].replace('bg-', ''),
                        borderColor: protocolConfig[template.protocol].brandColor
                      }}
                    >
                      {protocolConfig[template.protocol].name}
                    </Badge>
                    <Badge variant="outline" className={styles.categoryBadge}>
                      {template.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className={styles.taskTemplateContent}>
                  <p className={styles.templateDescription}>{template.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredTasks.length === 0 && (
            <div className={styles.noResults}>
              <p>No tasks found for the selected protocol.</p>
            </div>
          )}
        </div>
        
        <div className={styles.dialogFooter}>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}