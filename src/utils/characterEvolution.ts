// Character evolution system based on XP levels

export interface CharacterStage {
  level: number
  character: string
  name: string
  description: string
  unlockMessage: string
}

export const CHARACTER_STAGES: CharacterStage[] = [
  {
    level: 1,
    character: '/otter1.mp4',
    name: 'Young Otter',
    description: 'A playful young otter just starting their journey',
    unlockMessage: 'Welcome to Suimming! Your journey begins with this adorable young otter.'
  },
  {
    level: 2,
    character: '/otter2.mp4',
    name: 'Wise Otter',
    description: 'An experienced otter with wisdom from completing many tasks',
    unlockMessage: 'Congratulations! Your otter has evolved into a wise and experienced companion!'
  }
]

/**
 * Get the appropriate character for a given level
 */
export function getCharacterForLevel(level: number): CharacterStage {
  // Find the highest level character that the user has unlocked
  const availableStages = CHARACTER_STAGES.filter(stage => level >= stage.level)
  return availableStages[availableStages.length - 1] || CHARACTER_STAGES[0]
}

/**
 * Check if a level-up triggers a character evolution
 */
export function checkCharacterEvolution(oldLevel: number, newLevel: number): CharacterStage | null {
  const oldCharacter = getCharacterForLevel(oldLevel)
  const newCharacter = getCharacterForLevel(newLevel)

  // Return the new character stage if it's different from the old one
  if (oldCharacter.character !== newCharacter.character) {
    return newCharacter
  }

  return null
}

/**
 * Get the next character evolution milestone
 */
export function getNextEvolutionLevel(currentLevel: number): CharacterStage | null {
  const nextStage = CHARACTER_STAGES.find(stage => stage.level > currentLevel)
  return nextStage || null
}

/**
 * Calculate XP required for next character evolution
 */
export function getXPForNextEvolution(currentLevel: number): number | null {
  const nextStage = getNextEvolutionLevel(currentLevel)
  if (!nextStage) return null

  return nextStage.level * 100 // Since each level requires 100 XP
}