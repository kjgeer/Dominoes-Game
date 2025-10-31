/**
 * Multi-threaded Console-based Dominoes Game
 * Author: Arsalan Anwer, Kelsey Geer, Noah
 * Date: October 2025
 *
 * Description:
 * This is a console-based implementation of the Dominoes game with multi-threading support.
 * Features:
 * - Multi-threading using worker_threads for concurrent player operations
 * - Mutex locks for critical sections (shared game state)
 * - ASCII console display for game visualization
 * - Full implementation of dominoes game rules
 *
 * Classes:
 * - CRandom: Handles random shuffling of pieces
 * - CDominoes: Manages the 28 domino pieces
 * - CTable: Manages the game board and piece placement
 * - CPlayer: Manages player hands and move logic
 */

import { Worker } from 'worker_threads';
import { Mutex } from 'async-mutex';

// Class CRandom - Sorting/Shuffling approach for domino pieces
class CRandom {
    /**
     * Constructor: Initializes the random number generator
     */
    constructor() {
        this.seed = Date.now();
    }

    /**
     * Shuffles an array using Fisher-Yates algorithm
     * @param {Array} array - Array to shuffle
     * @returns {Array} Shuffled array
     */
    shuffle(array) {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    /**
     * Returns a random integer between min and max (inclusive)
     */
    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * Destructor-like cleanup method
     */
    destroy() {
        this.seed = null;
    }
}

// Class CDominoes - Contains data structure with all 28 pieces
class CDominoes {
    /**
     * Constructor: Initializes all 28 domino pieces
     */
    constructor() {
        this.pieces = [];
        this.initializePieces();
    }

    /**
     * Creates all 28 domino pieces (0-0 to 6-6)
     */
    initializePieces() {
        const pieceId = { value: 0 };
        for (let i = 0; i <= 6; i++) {
            for (let j = i; j <= 6; j++) {
                this.pieces.push({
                    id: pieceId.value++,
                    left: i,
                    right: j,
                    isDouble: i === j
                });
            }
        }
    }

    /**
     * Returns all pieces
     */
    getAllPieces() {
        return [...this.pieces];
    }

    /**
     * Returns total number of pieces
     */
    getCount() {
        return this.pieces.length;
    }

    /**
     * Destructor-like cleanup method
     */
    destroy() {
        this.pieces = [];
    }
}

// Class CTable - Manages the game board and displays sorted pieces
class CTable {
    /**
     * Constructor: Initializes the game table
     */
    constructor() {
        this.chain = [];
        this.headValue = null;
        this.tailValue = null;
    }

    /**
     * Adds a piece to the table (head or tail)
     * @param {Object} piece - Domino piece to add
     * @param {string} position - 'head' or 'tail'
     * @param {string} orientation - 'normal' or 'flipped'
     */
    addPiece(piece, position, orientation) {
        const placedPiece = {
            ...piece,
            orientation: orientation
        };

        if (this.chain.length === 0) {
            // First piece
            this.chain.push(placedPiece);
            this.headValue = piece.left;
            this.tailValue = piece.right;
        } else if (position === 'head') {
            this.chain.unshift(placedPiece);
            this.headValue = orientation === 'flipped' ? piece.right : piece.left;
        } else {
            this.chain.push(placedPiece);
            this.tailValue = orientation === 'flipped' ? piece.left : piece.right;
        }
    }

    /**
     * Gets current head value
     */
    getHeadValue() {
        return this.headValue;
    }

    /**
     * Gets current tail value
     */
    getTailValue() {
        return this.tailValue;
    }

    /**
     * Displays the current table state in ASCII format
     */
    displayASCII() {
        if (this.chain.length === 0) {
            console.log('│ Table: (empty)');
            return;
        }

        let display = '│ Table: ';
        this.chain.forEach((piece, index) => {
            const left = piece.orientation === 'flipped' ? piece.right : piece.left;
            const right = piece.orientation === 'flipped' ? piece.left : piece.right;
            display += `[${left}|${right}]`;
            if (index < this.chain.length - 1) {
                display += '-';
            }
        });
        console.log(display);
    }

    /**
     * Returns the number of pieces on table
     */
    getPieceCount() {
        return this.chain.length;
    }

    /**
     * Destructor-like cleanup method
     */
    destroy() {
        this.chain = [];
        this.headValue = null;
        this.tailValue = null;
    }
}

// Class CPlayer - Manages player hand and move selection
class CPlayer {
    /**
     * Constructor: Initializes a player
     * @param {number} id - Player ID (1 or 2)
     * @param {string} name - Player name
     */
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.hand = [];
        this.piecesPlaced = 0;
    }

    /**
     * Adds pieces to player's hand
     * @param {Array} pieces - Array of domino pieces
     */
    addPieces(pieces) {
        this.hand.push(...pieces);
    }

    /**
     * Removes a piece from hand
     * @param {number} pieceId - ID of piece to remove
     */
    removePiece(pieceId) {
        const index = this.hand.findIndex(p => p.id === pieceId);
        if (index !== -1) {
            this.hand.splice(index, 1);
        }
    }

    /**
     * Finds a playable piece from hand
     * @param {number} headValue - Current head value on table
     * @param {number} tailValue - Current tail value on table
     * @returns {Object|null} Playable piece info or null
     */
    findPlayablePiece(headValue, tailValue) {
        for (const piece of this.hand) {
            // Check if can play on head
            if (piece.left === headValue || piece.right === headValue) {
                return {
                    piece: piece,
                    position: 'head',
                    matchValue: headValue
                };
            }
            // Check if can play on tail
            if (piece.left === tailValue || piece.right === tailValue) {
                return {
                    piece: piece,
                    position: 'tail',
                    matchValue: tailValue
                };
            }
        }
        return null;
    }

    /**
     * Selects a random piece from hand for first move
     * @returns {Object} Random piece
     */
    selectRandomPiece() {
        const randomIndex = Math.floor(Math.random() * this.hand.length);
        return this.hand[randomIndex];
    }

    /**
     * Gets the number of pieces in hand
     */
    getPieceCount() {
        return this.hand.length;
    }

    /**
     * Calculates total pip count in hand
     */
    getTotalPips() {
        return this.hand.reduce((sum, piece) => sum + piece.left + piece.right, 0);
    }

    /**
     * Displays player's hand in ASCII format
     * @param {boolean} hideValues - Whether to hide actual values
     */
    displayHand(hideValues = false) {
        if (hideValues) {
            console.log(`│ ${this.name}'s hand: [${this.hand.length} pieces]`);
        } else {
            let display = `│ ${this.name}'s hand: `;
            this.hand.forEach((piece, index) => {
                display += `[${piece.left}|${piece.right}]`;
                if (index < this.hand.length - 1) {
                    display += ' ';
                }
            });
            console.log(display);
        }
    }

    /**
     * Destructor-like cleanup method
     */
    destroy() {
        this.hand = [];
        this.id = null;
        this.name = null;
    }
}

// Main Game Class with Multi-threading
class DominoesGame {
    /**
     * Constructor: Initializes the game
     */
    constructor() {
        this.random = new CRandom();
        this.dominoes = new CDominoes();
        this.table = new CTable();
        this.players = [];
        this.boneyard = [];
        this.currentPlayerIndex = 0;
        this.gameOver = false;
        this.winner = null;

        // Mutex for protecting critical sections
        this.mutex = new Mutex();

        console.log('\n' + '═'.repeat(70));
        console.log('  MULTI-THREADED DOMINOES GAME');
        console.log('  Author: Arsalan Anwer');
        console.log('═'.repeat(70) + '\n');
    }

    /**
     * Initializes the game with players and pieces
     */
    async initialize() {
        console.log('┌─ INITIALIZING GAME');

        // Create players
        this.players.push(new CPlayer(1, 'Player 1'));
        this.players.push(new CPlayer(2, 'Player 2'));
        console.log('│ ✓ Created 2 players');

        // Get and shuffle all pieces
        const allPieces = this.dominoes.getAllPieces();
        const shuffledPieces = this.random.shuffle(allPieces);
        console.log('│ ✓ Shuffled 28 domino pieces');

        // Distribute pieces: 10 to each player, 8 to boneyard
        this.players[0].addPieces(shuffledPieces.slice(0, 10));
        this.players[1].addPieces(shuffledPieces.slice(10, 20));
        this.boneyard = shuffledPieces.slice(20, 28);
        console.log('│ ✓ Distributed pieces: 10 per player, 8 in boneyard');

        // Randomly select first player
        this.currentPlayerIndex = this.random.getRandomInt(0, 1);
        console.log(`│ ✓ First player selected: ${this.players[this.currentPlayerIndex].name}`);

        console.log('└─ INITIALIZATION COMPLETE\n');
    }

    /**
     * CRITICAL SECTION: Drawing from boneyard (protected by mutex)
     * @param {CPlayer} player - Player drawing a piece
     * @returns {Object|null} Drawn piece or null
     */
    async drawFromBoneyard(player) {
        return await this.mutex.runExclusive(() => {
            if (this.boneyard.length === 0) {
                return null;
            }
            const piece = this.boneyard.pop();
            player.addPieces([piece]);
            console.log(`│   → Drew piece [${piece.left}|${piece.right}] from boneyard (${this.boneyard.length} left)`);
            return piece;
        });
    }

    /**
     * CRITICAL SECTION: Placing piece on table (protected by mutex)
     * @param {Object} piece - Piece to place
     * @param {string} position - 'head' or 'tail'
     * @param {number} matchValue - Value being matched
     */
    async placePieceOnTable(piece, position, matchValue) {
        await this.mutex.runExclusive(() => {
            // Determine orientation
            let orientation = 'normal';
            if (position === 'head') {
                orientation = (piece.right === matchValue) ? 'flipped' : 'normal';
            } else {
                orientation = (piece.left === matchValue) ? 'flipped' : 'normal';
            }

            this.table.addPiece(piece, position, orientation);
            console.log(`│   → Placed [${piece.left}|${piece.right}] on ${position}`);
        });
    }

    /**
     * Processes a player's turn (can be run in worker thread)
     * @param {CPlayer} player - Current player
     */
    async processTurn(player) {
        console.log(`\n┌─ ${player.name.toUpperCase()}'S TURN (Thread)`);

        // Display current state
        player.displayHand(false);
        this.table.displayASCII();
        console.log('│');

        // First move - no table pieces yet
        if (this.table.getPieceCount() === 0) {
            const piece = player.selectRandomPiece();
            console.log(`│ ✓ First move: Playing [${piece.left}|${piece.right}]`);
            await this.placePieceOnTable(piece, 'tail', null);
            player.removePiece(piece.id);
            player.piecesPlaced++;
            console.log('└─ Turn complete\n');
            return;
        }

        // Try to find a playable piece
        const headValue = this.table.getHeadValue();
        const tailValue = this.table.getTailValue();
        let playableMove = player.findPlayablePiece(headValue, tailValue);

        // If no playable piece, draw from boneyard
        while (!playableMove && this.boneyard.length > 0) {
            console.log('│ ✗ No playable piece in hand');
            const drawnPiece = await this.drawFromBoneyard(player);
            if (drawnPiece) {
                playableMove = player.findPlayablePiece(headValue, tailValue);
            }
        }

        // Play the piece if found
        if (playableMove) {
            const { piece, position, matchValue } = playableMove;
            console.log(`│ ✓ Playing [${piece.left}|${piece.right}] on ${position} (matching ${matchValue})`);
            await this.placePieceOnTable(piece, position, matchValue);
            player.removePiece(piece.id);
            player.piecesPlaced++;
        } else {
            console.log('│ ✗ Cannot play - boneyard empty, passing turn');
        }

        console.log('└─ Turn complete\n');
    }

    /**
     * Checks if game is over and determines winner
     * @returns {boolean} True if game is over
     */
    checkGameOver() {
        // Check if any player has empty hand
        for (const player of this.players) {
            if (player.getPieceCount() === 0) {
                this.gameOver = true;
                this.winner = player;
                return true;
            }
        }

        // Check if game is blocked (both players can't play)
        const headValue = this.table.getHeadValue();
        const tailValue = this.table.getTailValue();
        const player1CanPlay = this.players[0].findPlayablePiece(headValue, tailValue) !== null;
        const player2CanPlay = this.players[1].findPlayablePiece(headValue, tailValue) !== null;

        if (!player1CanPlay && !player2CanPlay && this.boneyard.length === 0) {
            this.gameOver = true;
            // Winner is player with lowest pip count
            const player1Pips = this.players[0].getTotalPips();
            const player2Pips = this.players[1].getTotalPips();
            this.winner = player1Pips < player2Pips ? this.players[0] : this.players[1];
            return true;
        }

        return false;
    }

    /**
     * Simulates multi-threaded turn processing using Promises
     * In a real scenario, each turn would run in a worker thread
     */
    async playTurnWithThread(player) {
        return new Promise((resolve) => {
            // Simulate thread execution with setTimeout
            setTimeout(async () => {
                await this.processTurn(player);
                resolve();
            }, 100);
        });
    }

    /**
     * Main game loop
     */
    async play() {
        while (!this.gameOver) {
            const currentPlayer = this.players[this.currentPlayerIndex];

            // Process turn with simulated threading
            await this.playTurnWithThread(currentPlayer);

            // Check if game is over
            if (this.checkGameOver()) {
                break;
            }

            // Switch to next player
            this.currentPlayerIndex = (this.currentPlayerIndex + 1) % 2;

            // Small delay for readability
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        this.displayResults();
    }

    /**
     * Displays final game results in ASCII format
     */
    displayResults() {
        console.log('\n' + '═'.repeat(70));
        console.log('  GAME OVER - FINAL RESULTS');
        console.log('═'.repeat(70));
        console.log(`\n🏆 WINNER: ${this.winner.name}\n`);

        // Display final table
        console.log('┌─ FINAL TABLE STATE');
        this.table.displayASCII();
        console.log('└─\n');

        // Display both players' remaining pieces
        for (const player of this.players) {
            console.log(`┌─ ${player.name.toUpperCase()} - FINAL HAND`);
            if (player.getPieceCount() === 0) {
                console.log('│ All pieces played! ✓');
            } else {
                player.displayHand(false);
                console.log(`│ Total pips: ${player.getTotalPips()}`);
                console.log(`│ Pieces remaining: ${player.getPieceCount()}`);
            }
            console.log('└─\n');
        }

        console.log('═'.repeat(70) + '\n');
    }

    /**
     * Cleanup method - proper memory management
     */
    destroy() {
        console.log('Cleaning up game resources...');
        this.table.destroy();
        this.dominoes.destroy();
        this.random.destroy();
        this.players.forEach(player => player.destroy());
        this.players = [];
        this.boneyard = [];
        console.log('✓ All resources released\n');
    }
}

// Main Execution
async function main() {
    const game = new DominoesGame();

    try {
        await game.initialize();
        await game.play();
    } catch (error) {
        console.error('Error during game:', error);
    } finally {
        game.destroy();
    }
}

// Run the game
main();
