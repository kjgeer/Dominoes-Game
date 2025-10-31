/**
 * Worker Thread for Player Turn Processing
 * Author: Arsalan Anwer, Kelsey Geer, Noah
 *
 * This worker handles player turn logic in a separate thread,
 * demonstrating true multi-threading capabilities
 */

import { parentPort, workerData } from 'worker_threads';

/**
 * Finds a playable piece from player's hand
 * @param {Array} hand - Player's current hand
 * @param {number} headValue - Current head value on table
 * @param {number} tailValue - Current tail value on table
 * @returns {Object|null} Playable move or null
 */
function findPlayablePiece(hand, headValue, tailValue) {
    for (const piece of hand) {
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
 * Selects a random piece from hand
 * @param {Array} hand - Player's hand
 * @returns {Object} Random piece
 */
function selectRandomPiece(hand) {
    const randomIndex = Math.floor(Math.random() * hand.length);
    return hand[randomIndex];
}

/**
 * Worker thread main logic
 * Receives player data and processes their turn
 */
if (parentPort) {
    parentPort.on('message', (data) => {
        const { playerHand, tableState, isFirstMove } = data;

        let result = {
            action: null,
            piece: null,
            position: null,
            matchValue: null,
            needsDraw: false
        };

        // Process turn based on game state
        if (isFirstMove) {
            // First move - select random piece
            result.action = 'PLAY';
            result.piece = selectRandomPiece(playerHand);
            result.position = 'tail';
        } else {
            // Find playable piece
            const playableMove = findPlayablePiece(
                playerHand,
                tableState.headValue,
                tableState.tailValue
            );

            if (playableMove) {
                result.action = 'PLAY';
                result.piece = playableMove.piece;
                result.position = playableMove.position;
                result.matchValue = playableMove.matchValue;
            } else {
                result.action = 'DRAW';
                result.needsDraw = true;
            }
        }

        // Send result back to main thread
        parentPort.postMessage(result);
    });
}
