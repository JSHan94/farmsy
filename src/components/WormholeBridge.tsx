import { useState } from 'react'
import { ArrowRightLeft, X } from 'lucide-react'
import WormholeConnect, { WormholeConnectConfig } from '@wormhole-foundation/wormhole-connect'
import styles from './WormholeBridge.module.css'

interface WormholeBridgeProps {
  className?: string
}

export function WormholeBridge({ className }: WormholeBridgeProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleBridgeClick = () => {
    setIsOpen(true)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  // Wormhole Connect configuration
  const wormholeConfig: WormholeConnectConfig = {
    network: 'Mainnet', // or 'Testnet' for testing
    chains: ['Sui', 'Ethereum', 'Avalanche', 'Polygon', 'Solana', 'Arbitrum'],
    // Customize RPCs for better performance
    rpcs: {
      Sui: 'https://fullnode.mainnet.sui.io:443',
      Ethereum: 'https://rpc.ankr.com/eth',
      Polygon: 'https://rpc.ankr.com/polygon',
      Avalanche: 'https://rpc.ankr.com/avalanche',
      Arbitrum: 'https://rpc.ankr.com/arbitrum'
    }
  }

  return (
    <>
      {/* Bridge Button */}
      <button
        onClick={handleBridgeClick}
        className={`${styles.bridgeButton} ${className || ''}`}
        title="Wormhole Bridge"
      >
        <div className={styles.bridgeIconWrapper}>
          <ArrowRightLeft className={styles.bridgeIcon} />
        </div>
        <span className={styles.bridgeText}>Bridge</span>
      </button>

      {/* Bridge Modal */}
      {isOpen && (
        <div className={styles.modalOverlay} onClick={handleClose}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Wormhole Bridge</h2>
              <button
                onClick={handleClose}
                className={styles.closeButton}
                aria-label="Close bridge modal"
              >
                <X className={styles.closeIcon} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.bridgeContainer}>
                <p className={styles.bridgeDescription}>
                  Cross-chain token transfers powered by Wormhole
                </p>

                {/* Wormhole Connect component */}
                <div className={styles.wormholeConnectContainer}>
                  <WormholeConnect config={wormholeConfig} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}