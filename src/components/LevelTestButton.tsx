import { useState } from 'react'
import { Button } from './ui/button'
import { usePersistedXPSystem } from '../contexts/PersistenceContext'
import { Zap, Target, Award } from 'lucide-react'

export function LevelTestButton() {
  const { gainXP, currentXP, currentLevel } = usePersistedXPSystem()
  const [isTestMode, setIsTestMode] = useState(false)

  const addTestXP = (amount: number) => {
    gainXP(amount)
  }

  const testLevelUp = () => {
    // Add enough XP to reach level 5 (to trigger otter evolution)
    const xpNeeded = (5 * 100) - currentXP
    if (xpNeeded > 0) {
      gainXP(xpNeeded)
    } else {
      // If already level 5+, add 100 XP to level up further
      gainXP(100)
    }
  }

  if (!isTestMode) {
    return (
      <Button
        onClick={() => setIsTestMode(true)}
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4 z-50"
      >
        <Zap size={16} />
        Test Mode
      </Button>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border">
      <div className="text-sm mb-2">
        <strong>Test Controls</strong>
        <br />
        Level: {currentLevel} | XP: {currentXP}
      </div>

      <div className="flex flex-col gap-2">
        <Button
          onClick={() => addTestXP(20)}
          size="sm"
          variant="outline"
        >
          <Target size={14} />
          +20 XP
        </Button>

        <Button
          onClick={() => addTestXP(50)}
          size="sm"
          variant="outline"
        >
          <Award size={14} />
          +50 XP
        </Button>

        <Button
          onClick={testLevelUp}
          size="sm"
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Zap size={14} />
          Level Up Test
        </Button>

        <Button
          onClick={() => setIsTestMode(false)}
          size="sm"
          variant="ghost"
        >
          Hide
        </Button>
      </div>
    </div>
  )
}