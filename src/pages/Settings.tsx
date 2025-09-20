import { useState } from "react"
import { Wallet, Plus, X, Twitter, MessageCircle, Send, ExternalLink, Copy, Check, RotateCcw, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/Button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Separator } from "../components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog"
import { usePersistence } from "../contexts/PersistenceContext"
import { useDashboard } from "../contexts/DashboardContext"
import { useTaskContext } from "../contexts/TaskContext"
import { toast } from "sonner"
import styles from './Settings.module.css'

export function Settings() {
  const { userData, setUserData } = usePersistence()
  const { resetDashboardState } = useDashboard()
  const { resetTasks } = useTaskContext()
  const [walletAddresses, setWalletAddresses] = useState<string[]>([
    '0x1234...5678',
    '0xabcd...efgh'
  ])
  const [newWalletAddress, setNewWalletAddress] = useState('')
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null)
  const [connectedSocial] = useState<Record<string, boolean>>({
    twitter: false,
    discord: false,
    telegram: false
  })
  const [showResetDialog, setShowResetDialog] = useState(false)

  const handleAddWallet = () => {
    if (newWalletAddress.trim() && !walletAddresses.includes(newWalletAddress.trim())) {
      setWalletAddresses([...walletAddresses, newWalletAddress.trim()])
      setNewWalletAddress('')
    }
  }

  const handleRemoveWallet = (address: string) => {
    setWalletAddresses(walletAddresses.filter(addr => addr !== address))
  }

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address)
    setCopiedAddress(address)
    setTimeout(() => setCopiedAddress(null), 2000)
  }

  const handleSocialConnect = (platform: string) => {
    console.log(`Connecting to ${platform}...`)
    // Actual connection logic would go here
  }

  const handleReset = () => {
    // Reset XP and level to initial values
    setUserData({
      currentXP: 0,
      currentLevel: 1
    })

    // Reset all tasks to initial state
    resetTasks()

    // Reset Dashboard state (filters and active tab)
    resetDashboardState()

    // Close dialog and show success toast
    setShowResetDialog(false)
    toast.success('Account data has been reset successfully!')
  }

  return (
    <div className={styles.container}>
      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.settingsGrid}>
          {/* Social Media Connections */}
          <Card className={styles.settingCard}>
            <CardHeader className={styles.cardHeader}>
              <div className={styles.cardHeaderContent}>
                <div className={`${styles.cardIcon} ${styles.cardIconPrimary}`}>
                  <Twitter />
                </div>
                <div>
                  <CardTitle className={styles.cardTitle}>Social Media Connections</CardTitle>
                  <p className={styles.cardDescription}>Connect your social media accounts to earn rewards</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className={styles.cardContent}>
              <div className={styles.contentSpace}>
                {/* Twitter Connection */}
                <div className={styles.socialItem}>
                  <div className={styles.socialInfo}>
                    <div className={`${styles.socialIcon} ${styles.twitterIcon}`}>
                      <Twitter className={styles.socialIconSvg} />
                    </div>
                    <div className={styles.socialDetails}>
                      <Label className={styles.socialLabel}>Twitter</Label>
                      <p className={styles.socialDescription}>
                        Connect your Twitter account for social features
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleSocialConnect('twitter')}
                    variant={connectedSocial.twitter ? "outline" : "default"}
                    className={connectedSocial.twitter ? styles.connectedButton : styles.connectButton}
                  >
                    {connectedSocial.twitter ? (
                      <>
                        <Check className={styles.buttonIcon} />
                        Connected
                      </>
                    ) : (
                      <>
                        <ExternalLink className={styles.buttonIcon} />
                        Connect
                      </>
                    )}
                  </Button>
                </div>

                <Separator className={styles.separator} />

                {/* Discord Connection */}
                <div className={styles.socialItem}>
                  <div className={styles.socialInfo}>
                    <div className={`${styles.socialIcon} ${styles.discordIcon}`}>
                      <MessageCircle className={styles.socialIconSvg} />
                    </div>
                    <div className={styles.socialDetails}>
                      <Label className={styles.socialLabel}>Discord</Label>
                      <p className={styles.socialDescription}>
                        Join our Discord community
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleSocialConnect('discord')}
                    variant={connectedSocial.discord ? "outline" : "default"}
                    className={connectedSocial.discord ? styles.connectedButton : styles.connectButton}
                  >
                    {connectedSocial.discord ? (
                      <>
                        <Check className={styles.buttonIcon} />
                        Connected
                      </>
                    ) : (
                      <>
                        <ExternalLink className={styles.buttonIcon} />
                        Connect
                      </>
                    )}
                  </Button>
                </div>

                <Separator className={styles.separator} />

                {/* Telegram Connection */}
                <div className={styles.socialItem}>
                  <div className={styles.socialInfo}>
                    <div className={`${styles.socialIcon} ${styles.telegramIcon}`}>
                      <Send className={styles.socialIconSvg} />
                    </div>
                    <div className={styles.socialDetails}>
                      <Label className={styles.socialLabel}>Telegram</Label>
                      <p className={styles.socialDescription}>
                        Connect with Telegram for updates
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleSocialConnect('telegram')}
                    variant={connectedSocial.telegram ? "outline" : "default"}
                    className={connectedSocial.telegram ? styles.connectedButton : styles.connectButton}
                  >
                    {connectedSocial.telegram ? (
                      <>
                        <Check className={styles.buttonIcon} />
                        Connected
                      </>
                    ) : (
                      <>
                        <ExternalLink className={styles.buttonIcon} />
                        Connect
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Management */}
          <Card className={styles.settingCard}>
            <CardHeader className={styles.cardHeader}>
              <div className={styles.cardHeaderContent}>
                <div className={`${styles.cardIcon} ${styles.cardIconDanger}`}>
                  <RotateCcw />
                </div>
                <div>
                  <CardTitle className={styles.cardTitle}>Account Management</CardTitle>
                  <p className={styles.cardDescription}>Manage your account data and progress</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className={styles.cardContent}>
              <div className={styles.contentSpace}>
                {/* Current Progress */}
                <div className={styles.progressSection}>
                  <Label className={styles.inputLabel}>Current Progress</Label>
                  <div className={styles.progressInfo}>
                    <div className={styles.progressItem}>
                      <span className={styles.progressLabel}>Level:</span>
                      <span className={styles.progressValue}>{userData.currentLevel}</span>
                    </div>
                    <div className={styles.progressItem}>
                      <span className={styles.progressLabel}>XP:</span>
                      <span className={styles.progressValue}>{userData.currentXP} droplets</span>
                    </div>
                  </div>
                </div>

                <Separator className={styles.separator} />

                {/* Reset Account */}
                <div className={styles.resetSection}>
                  <Button
                    onClick={() => setShowResetDialog(true)}
                    variant="destructive"
                    className={styles.resetButton}
                  >
                    <RotateCcw className={styles.buttonIcon} />
                    Reset Account Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Wallet Management */}
          <Card className={styles.settingCard}>
            <CardHeader className={styles.cardHeader}>
              <div className={styles.cardHeaderContent}>
                <div className={`${styles.cardIcon} ${styles.cardIconBlue}`}>
                  <Wallet />
                </div>
                <div>
                  <CardTitle className={styles.cardTitle}>Wallet Management</CardTitle>
                  <p className={styles.cardDescription}>Manage your connected wallet addresses</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className={styles.cardContent}>
              <div className={styles.contentSpace}>
                {/* Add New Wallet */}
                <div className={styles.walletAddSection}>
                  <Label className={styles.inputLabel}>Add Wallet Address</Label>
                  <div className={styles.walletInputGroup}>
                    <Input
                      value={newWalletAddress}
                      onChange={(e) => setNewWalletAddress(e.target.value)}
                      placeholder="Enter wallet address (0x...)"
                      className={styles.walletInput}
                    />
                    <Button
                      onClick={handleAddWallet}
                      disabled={!newWalletAddress.trim()}
                      className={styles.addWalletButton}
                    >
                      <Plus className={styles.buttonIcon} />
                      Add
                    </Button>
                  </div>
                </div>

                {walletAddresses.length > 0 && (
                  <>
                    <Separator className={styles.separator} />

                    {/* Connected Wallets List */}
                    <div className={styles.walletsSection}>
                      <Label className={styles.inputLabel}>Connected Wallets ({walletAddresses.length})</Label>
                      <div className={styles.walletsList}>
                        {walletAddresses.map((address, index) => (
                          <div key={index} className={styles.walletItem}>
                            <div className={styles.walletInfo}>
                              <div className={styles.walletAddress}>
                                {address}
                              </div>
                              <div className={styles.walletType}>
                                Primary Wallet
                              </div>
                            </div>
                            <div className={styles.walletActions}>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCopyAddress(address)}
                                className={styles.walletActionButton}
                              >
                                {copiedAddress === address ? (
                                  <Check className={styles.actionIcon} />
                                ) : (
                                  <Copy className={styles.actionIcon} />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveWallet(address)}
                                className={styles.walletRemoveButton}
                              >
                                <X className={styles.actionIcon} />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className={styles.dialogTitle}>
              <AlertTriangle className={styles.warningIcon} />
              Reset Account Data?
            </DialogTitle>
            <DialogDescription className={styles.dialogDescription}>
              This action will:
              <ul className={styles.resetList}>
                <li>Reset your XP to 0</li>
                <li>Reset your level to 1</li>
                <li>Move all tasks to Explore</li>
              </ul>
              <strong>This action cannot be undone!</strong>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleReset}
            >
              Reset
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowResetDialog(false)}
            >
              Cancel
            </Button>
            
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}