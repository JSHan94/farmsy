# Character Evolution System

This guide explains the character evolution system that automatically changes your character based on XP levels with spectacular level-up animations.

## 🎮 How It Works

### Character Evolution Stages

1. **Level 1-4**: Young Otter (`/otter1.mp4`)
   - Starting character for new users
   - Playful and energetic companion

2. **Level 5+**: Wise Otter (`/otter2.mp4`)
   - Evolved character showing growth and wisdom
   - Unlocked automatically when reaching level 5

### Level-Up System

- **XP Per Level**: 100 XP required for each level
- **XP Sources**: Completing tasks rewards XP based on difficulty:
  - Easy tasks: 20 XP
  - Medium tasks: 35 XP
  - Hard tasks: 50 XP

## 🎬 Animation System

### Level-Up Animation
When you gain enough XP to level up, you'll see:
1. **Level-Up Burst**: Animated rings and sparkles
2. **New Level Display**: Shows your new level with crown icon
3. **XP Celebration**: Floating sparkles around the animation

### Character Evolution Animation
When your character evolves (level 5), you'll experience:
1. **Evolution Announcement**: Special "Character Evolution!" message
2. **Character Reveal**: New character appears with rotation effect
3. **Evolution Message**: Congratulatory message with character info
4. **Enhanced Effects**: Special sparkles and glowing effects

## 🔧 Technical Implementation

### Core Components

1. **Character Evolution Logic** (`src/utils/characterEvolution.ts`):
   - Defines character stages and unlock levels
   - Handles evolution detection and character selection

2. **Level-Up Animation** (`src/components/LevelUpAnimation.tsx`):
   - Multi-phase animation system
   - Handles both level-up and evolution displays

3. **XP System Integration** (`src/contexts/PersistenceContext.tsx`):
   - Automatic character evolution when leveling up
   - Persistent character state across sessions

### Key Features

- **Automatic Evolution**: Characters evolve automatically based on level
- **Locked Character Preview**: Character selection modal shows locked/unlocked states
- **Persistent State**: Character choice and level persist across sessions
- **Level Requirements**: Clear indication of what level unlocks each character

## 🧪 Testing

### Development Test Controls
In development mode, you'll see a "Test Mode" button that allows you to:
- Add +20 XP or +50 XP
- Trigger immediate level-up to test evolution
- Test the animation system

### Testing Character Evolution
1. Start at level 1 with Young Otter
2. Gain XP through task completion or test controls
3. At level 5, character automatically evolves to Wise Otter
4. Level-up animation plays with evolution effects

## 📱 User Experience

### Character Display Locations
- **Analytics Page**: Character preview with level badge
- **Header**: XP progress bar shows current level
- **Character Modal**: Shows available characters with lock states

### Animation Triggers
- **Automatic**: Animations trigger immediately when gaining XP that causes level-up
- **Skippable**: Users can click to skip/close animations
- **Timed**: Animations auto-close after a few seconds

## 🔮 Future Expansion

The system is designed to be easily extensible:

### Adding New Characters
1. Add character files to `/public/` directory
2. Update `CHARACTER_STAGES` in `characterEvolution.ts`
3. Add character options to `CharacterImageModal.tsx`

### Adding New Evolution Triggers
- Modify `checkCharacterEvolution()` function
- Add new unlock conditions beyond just level requirements
- Implement special achievement-based unlocks

## 🎯 Key Benefits

1. **Gamification**: Provides visual progression and rewards
2. **Engagement**: Exciting animations encourage continued use
3. **Personalization**: Users can see their character grow with them
4. **Achievement**: Clear milestones create sense of accomplishment
5. **Visual Feedback**: Immediate and satisfying progression indicators

The character evolution system creates an engaging, gamified experience that rewards users for consistent task completion while providing clear visual progression milestones.