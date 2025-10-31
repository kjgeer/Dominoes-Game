# Multi-threaded Console Dominoes Game

## Overview

This is a console-based implementation of the Dominoes game with multi-threading support, demonstrating advanced concurrent programming concepts with mutex-protected critical sections.

## Features

### Core Requirements Implemented ✓

1. **Class CRandom** - Sorting approach for random piece sequencing
2. **Class CDominoes** - Data structure containing all 28 domino pieces
3. **Class CTable** - Displays and manages the game board
4. **Class CPlayer** - Randomly picks and sequentially shows selected pieces

### Game Features

- **2 Players** - Two-player dominoes game
- **28 Pieces** - Standard domino set (0-0 to 6-6)
- **Piece Distribution** - 10 pieces per player, 8 in boneyard
- **Turn Logic** - Complete turn-based system with drawing from boneyard
- **Matching Logic** - Head and tail matching with proper orientation
- **Random First Player** - Randomly selected starting player
- **Win Conditions** - Empty hand or lowest pip count wins

### Technical Features

- **Multi-threading** - Worker threads for concurrent player operations
- **Mutex Locks** - Protected critical sections for shared game state
- **ASCII Display** - Console visualization of game state
- **Memory Management** - Proper initialization and cleanup with destroy methods

## Critical Sections (Protected by Mutex)

The following operations are protected by mutex locks to ensure thread safety:

1. **Drawing from Boneyard** - `drawFromBoneyard()`
2. **Placing Pieces on Table** - `placePieceOnTable()`
3. **Game State Access** - Reading/writing shared game state

## Installation

```bash
# Navigate to console-version directory
cd console-version

# Install dependencies
npm install
```

## Usage

```bash
# Run the game
npm start

# Or directly with node
node dominoes-game.js
```

## Game Rules

1. **Setup**: 28 tiles are shuffled and distributed
   - 10 pieces per player
   - 8 pieces remain in the "boneyard"

2. **First Player**: Randomly selected player starts

3. **Turn Sequence**:
   - Player tries to match a piece from their hand to the head or tail of the table
   - If no match is possible, player draws from boneyard until they can play
   - If boneyard is empty and no match possible, turn passes

4. **Winning**:
   - First player to place all their pieces wins
   - If game is blocked, player with lowest pip count wins

## ASCII Display Format

```
┌─ PLAYER 1'S TURN (Thread)
│ Player 1's hand: [6|6] [3|5] [2|4] [0|1] [5|5]
│ Table: [2|3]-[3|6]-[6|4]-[4|1]
│
│ ✓ Playing [4|1] on tail (matching 1)
└─ Turn complete
```

## Class Structure

### CRandom
- Handles shuffling of domino pieces using Fisher-Yates algorithm
- Provides random number generation for game setup

### CDominoes
- Creates and manages all 28 domino pieces
- Pieces range from [0|0] to [6|6]

### CTable
- Manages the game board (chain of placed pieces)
- Tracks head and tail values for matching
- Provides ASCII visualization

### CPlayer
- Manages player hand and pieces
- Implements move logic and piece selection
- Tracks statistics (pieces played, pip count)

## Multi-threading Architecture

```
Main Thread (Game Coordinator)
    ├── Worker Thread 1 (Player 1 turn processing)
    ├── Worker Thread 2 (Player 2 turn processing)
    └── Mutex (protects shared game state)
```

## Dependencies

- `async-mutex` (^0.5.0) - Mutex implementation for critical sections
- Node.js built-in `worker_threads` module for multi-threading

## Memory Management

All classes implement a `destroy()` method for proper cleanup:
- Releases allocated resources
- Clears data structures
- Prevents memory leaks

## Author Comments

This implementation demonstrates:
- Object-oriented design principles
- Multi-threaded programming with synchronization
- Game logic implementation
- Console-based user interface design

## License

MIT License
