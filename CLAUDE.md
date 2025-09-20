# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

### Step 1: Prompt Refiner
- Rewrite the user's request into a **goal-oriented task description**.  
- Ensure the refined prompt contains:
  1. **Objective** – what the user ultimately wants to achieve.  
  2. **Constraints** – any important conditions, limitations, or assumptions.  
  3. **Steps** – a clear breakdown of what the agent should do.  
  4. **Output format** – specify the desired structure, style, or format for the answer.  

### Step 2: Executor
- Use the refined prompt to generate the final answer.  
- Always follow the structure required in the refined prompt.  


### Output Format
**Refined Prompt**
Objective: <clear goal here>  
Constraints: <list of constraints/assumptions>  
Steps:  
1. <step>  
2. <step>  
Output format: <format>  

**Answer**
<final response based on the refined prompt>

## Project Overview

Suimming is a gamified, multi-blockchain task management application built with React, TypeScript, and Vite.

Users can manage and track tasks through a Task Tracker system that supports multiple blockchain ecosystems, with initial focus on Sui dApps.

Completing tracked tasks rewards users with XP droplets (varies by difficulty: easy=20, medium=35, hard=50), allowing them to level up and progress over time.

The application is designed with extensible architecture to easily add new blockchains and protocols.

## Development Commands

- `npm run dev` - Start development server on port 3000 with auto-open
- `npm run build` - Build for production (outputs to `build/` directory)

## Architecture

### Core Application Structure

- **App.tsx** - Main application component managing global task state and sidebar layout
- **main.tsx** - Application entry point with SUI Slush authentication provider setup
- **Task Management** - Centralized state management for CRUD operations on tasks with drag-and-drop support

### Component Architecture

**Main Components:**

- **TaskBoard** - Kanban board with drag-and-drop functionality using @dnd-kit
- **TaskCard** - Individual task display with edit and completion actions
- **TaskTrackerBoard** - Enhanced task tracking with XP integration
- **AddTaskDialog** - Modal for creating new tasks
- **AppSidebar** - Navigation sidebar with menu items
- **WalletConnect** - SUI Slush wallet authentication integration
- **XPProgressBar** - Visual representation of user’s XP and next level progress
- **LevelBadge** - UI element showing current user level

**UI Components:**
- Components include: buttons, cards, dialogs, forms, charts, navigation elements
- All components are TypeScript-based with proper type definitions

### Styling System

- **CSS Modules** - Component-specific styles (`.module.css` files)
- **CSS Module Requirement** - ALL CSS files MUST be module.css files co-located with their corresponding TSX components
- **Global Styles** - `src/index.css` with Tailwind CSS integration
- **Tailwind Classes** - Used extensively for utility-first styling
- **Design System** - Consistent color scheme with task status colors (blue, green, yellow, purple, pink, gray)

### Key Dependencies and Integrations

**UI Framework:**
- Extensive Radix UI component library integration
- Lucide React for consistent iconography
- Sonner for toast notifications
- Vaul for drawer components

**Drag & Drop:**
- @dnd-kit for task board functionality with sortable contexts
- Pointer sensor with 8px activation constraint for better UX

**Development Tools:**
- Vite with React SWC plugin for fast builds
- TypeScript with strict configuration
- ESLint with React hooks and refresh plugins

### Project Structure Patterns

```
src/
├── App.tsx                    # Main app component with task state
├── main.tsx                   # Entry point with Sui wallet provider
├── components/
│   ├── [Component].tsx        # Main feature components
│   ├── [Component].module.css # Component-specific styles
│   └── ui/                    # Reusable UI components (shadcn/ui)
├── types/
│   └── blockchain.ts          # Blockchain and protocol type definitions
├── utils/
│   └── blockchain.ts          # Blockchain utility functions and helpers
├── data/
│   ├── protocol.json          # Multi-blockchain protocol configurations
│   └── task.json              # Multi-blockchain task data
├── styles/                    # Global style definitions
└── index.css                  # Main stylesheet with Tailwind
```

### Key Patterns

- **Component Co-location** - Components paired with their CSS modules
- **Extensible Type System** - Blockchain-agnostic interfaces with specific implementations
- **State Management** - Props drilling pattern for task operations (add, update, move) with XP rewards
- **CSS Variables** - Extensive use of custom properties for theming
- **Path Aliases** - `@/` alias configured for src directory imports
- **Multi-blockchain Support** - Structured JSON data with blockchain namespacing

## Data Architecture

### Multi-Blockchain Structure

The application uses a hierarchical data structure to support multiple blockchains:

```json
{
  "blockchains": {
    "sui": {
      "name": "Sui",
      "protocols": { ... },
      "tasks": [ ... ]
    },
    "ethereum": {
      "name": "Ethereum",
      "protocols": { ... },
      "tasks": [ ... ]
    }
  }
}
```

### Protocol Configuration (`protocol.json`)
- **Blockchain Grouping** - Protocols organized by blockchain
- **Standardized Metadata** - name, color, brandColor, symbol, icon, category
- **Category System** - lending, dex, staking, trading, farming, derivatives

### Task Management (`task.json`)
- **Unique IDs** - Format: `{blockchain}-{timestamp}-{random}`
- **XP Rewards** - Variable XP based on difficulty (easy: 20, medium: 35, hard: 50)
- **Categories** - Tasks linked to protocol categories for better organization
- **Extensible Fields** - blockchain, protocol, category, difficulty, xpReward

### Adding New Blockchains

To add a new blockchain:

1. **Update Types** (`types/blockchain.ts`):
   ```typescript
   export type BlockchainId = 'sui' | 'ethereum' | 'newchain'
   export type NewchainProtocol = 'Protocol1' | 'Protocol2'
   ```

2. **Add Protocol Data** (`protocol.json`):
   ```json
   {
     "blockchains": {
       "newchain": {
         "name": "New Chain",
         "protocols": { ... }
       }
     }
   }
   ```

3. **Add Tasks** (`task.json`):
   ```json
   {
     "blockchains": {
       "newchain": {
         "tasks": [ ... ]
       }
     }
   }
   ```

4. **Add Icons** - Create SVG icons in `/public/` directory

## Configuration

- **Vite Config** - Custom aliases for all major dependencies, build target set to 'esnext'
- **TypeScript** - Separate configs for app and node (vite) with strict settings
- **ESLint** - Modern flat config with React hooks and TypeScript support
- **Port Configuration** - Development server runs on port 3000 with auto-open

## Authentication Setup

The application uses Sui Wallet integration via @mysten/dapp-kit:
- **Wallet Providers** - SuiClientProvider with network configuration
- **Network Support** - devnet, testnet, mainnet configurations
- **Wallet Connection** - ConnectButton component for wallet interactions