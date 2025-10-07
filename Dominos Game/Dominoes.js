// Pip positions for drawing dominoes (0 to 6)
const pipPositions = [
    [], // 0
    [[0.5, 0.5]], // 1
    [[0.25, 0.25], [0.75, 0.75]], // 2
    [[0.25, 0.25], [0.5, 0.5], [0.75, 0.75]], // 3
    [[0.25, 0.25], [0.25, 0.75], [0.75, 0.25], [0.75, 0.75]], // 4
    [[0.25, 0.25], [0.25, 0.75], [0.5, 0.5], [0.75, 0.25], [0.75, 0.75]], // 5
    [[0.25, 0.25], [0.25, 0.5], [0.25, 0.75], [0.75, 0.25], [0.75, 0.5], [0.75, 0.75]] // 6
];

// Colors for pips (1 to 6, 0 has none)
const pipColors = [null, 'red', '#ff9900', 'yellow', 'green', 'blue', 'purple'];

// Function to draw a single domino on a canvas context
function drawDomino(ctx, x, y, val1, val2, w, h) {
    ctx.fillStyle = 'white';
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = 'black';
    ctx.strokeRect(x, y, w, h);
    // Draw middle line
    ctx.beginPath();
    ctx.moveTo(x + w / 2, y);
    ctx.lineTo(x + w / 2, y + h);
    ctx.stroke();
    // Draw pips for left and right halves
    drawPips(ctx, x, y, w / 2, h, val1, pipColors[val1]);
    drawPips(ctx, x + w / 2, y, w / 2, h, val2, pipColors[val2]);
}

// Function to draw a blank domino (no pips or middle line)
function drawBlankDomino(ctx, x, y, w, h) {
    ctx.fillStyle = 'white';
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = 'black';
    ctx.strokeRect(x, y, w, h);
}

// Helper to draw pips on a half-domino
function drawPips(ctx, x, y, w, h, val, color) {
    if (val === 0) return;
    ctx.fillStyle = color;
    const r = Math.min(w, h) / 8;
    pipPositions[val].forEach(pos => {
        const px = x + pos[0] * w;
        const py = y + pos[1] * h;
        ctx.beginPath();
        ctx.arc(px, py, r, 0, 2 * Math.PI);
        ctx.fill();
    });
}

// Class for random utilities, like shuffling
class CRandom {
    static shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
}

// Class to manage the set of domino pieces
class CDominoes {
    constructor() {
        this.pieces = [];
        for (let i = 0; i <= 6; i++) {
            for (let j = i; j <= 6; j++) {
                this.pieces.push([i, j]);
            }
        }
        this.shuffle();
    }

    shuffle() {
        CRandom.shuffle(this.pieces);
    }
}

// Class to manage the table (chain of played dominoes)
class CTable {
    constructor() {
        this.chain = [];
        this.canvas = document.getElementById('tableCanvas');
        this.ctx = this.canvas.getContext('2d');
    }

    // Place a tile on head or tail
    place(tile, position) {
        if (this.chain.length === 0) {
            this.chain.push(tile);
        } else if (position === 'head') {
            this.chain.unshift(tile);
        } else if (position === 'tail') {
            this.chain.push(tile);
        }
        this.render();
    }

    getHead() {
        return this.chain.length === 0 ? null : this.chain[0][0];
    }

    getTail() {
        return this.chain.length === 0 ? null : this.chain[this.chain.length - 1][1];
    }

    toASCII() {
        return this.chain.map(t => `[${t[0]}|${t[1]}]`).join('');
    }

    // Render the chain on canvas, expanding width if needed
    render() {
        const dominoW = 80;
        const dominoH = 40;
        const spacing = 5;
        let x = 10;
        let y = 10;
        const requiredWidth = 20 + this.chain.length * (dominoW + spacing);
        if (requiredWidth > this.canvas.width) {
            this.canvas.width = requiredWidth;
        }
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.chain.forEach(tile => {
            drawDomino(this.ctx, x, y, tile[0], tile[1], dominoW, dominoH);
            x += dominoW + spacing;
        });
    }
}

// Class for players
class CPlayer {
    constructor(name, divId, isHuman) {
        this.name = name;
        this.hand = [];
        this.div = document.getElementById(divId);
        this.isHuman = isHuman;
    }

    // Render hand as clickable canvases
    renderHand() {
        this.div.innerHTML = '';
        this.hand.forEach((tile, idx) => {
            const canv = document.createElement('canvas');
            canv.width = 80;
            canv.height = 40;
            const ctx = canv.getContext('2d');
            drawDomino(ctx, 0, 0, tile[0], tile[1], 80, 40);
            const div = document.createElement('div');
            div.style.display = 'inline-block';
            div.style.margin = '5px';
            div.appendChild(canv);
            div.tile = tile;
            div.idx = idx;
            this.div.appendChild(div);
        });
        updateHandCount(this);
    }

    // Render blank hand for non-active player
    renderBlankHand(count) {
        this.div.innerHTML = '';
        for (let i = 0; i < count; i++) {
            const canv = document.createElement('canvas');
            canv.width = 80;
            canv.height = 40;
            const ctx = canv.getContext('2d');
            drawBlankDomino(ctx, 0, 0, 80, 40);
            const div = document.createElement('div');
            div.style.display = 'inline-block';
            div.style.margin = '5px';
            div.appendChild(canv);
            this.div.appendChild(div);
        }
        updateHandCount(this);
    }

    // AI turn logic (computer player)
    playAITurn(head, tail, boneyard) {
        if (head === null && tail === null) {
            // First turn: pick random tile
            const index = Math.floor(Math.random() * this.hand.length);
            let tile = this.hand.splice(index, 1)[0];
            if (tile[0] > tile[1]) {
                tile = [tile[1], tile[0]];
            }
            logMove(`${this.name} starts with [${tile[0]}|${tile[1]}]`);
            return {tile, position: 'start', newHead: tile[0], newTail: tile[1]};
        }
        // Find playable tiles
        const playableTiles = this.hand.filter(t => t[0] === head || t[1] === head || t[0] === tail || t[1] === tail);
        if (playableTiles.length > 0) {
            // Play the first playable (simple AI)
            const tile = playableTiles[0];
            const index = this.hand.indexOf(tile);
            this.hand.splice(index, 1);
            let position = null;
            let orientedTile = null;
            let newHead = head;
            let newTail = tail;
            if (tile[0] === tail || tile[1] === tail) {
                position = 'tail';
                orientedTile = tile[0] === tail ? [tile[0], tile[1]] : [tile[1], tile[0]];
                newTail = tile[0] === tail ? tile[1] : tile[0];
            } else {
                position = 'head';
                orientedTile = tile[0] === head ? [tile[1], tile[0]] : [tile[0], tile[1]];
                newHead = tile[0] === head ? tile[1] : tile[0];
            }
            logMove(`${this.name} plays [${orientedTile[0]}|${orientedTile[1]}] on ${position}`);
            return {tile: orientedTile, position, newHead, newTail};
        } else {
            // Draw until playable or boneyard empty
            while (boneyard.pieces.length > 0) {
                const drawn = boneyard.pieces.shift();
                this.hand.push(drawn);
                logMove(`${this.name} draws [${drawn[0]}|${drawn[1]}]`);
                if (drawn[0] === head || drawn[1] === head || drawn[0] === tail || drawn[1] === tail) {
                    const index = this.hand.indexOf(drawn);
                    this.hand.splice(index, 1);
                    let position = null;
                    let orientedTile = null;
                    let newHead = head;
                    let newTail = tail;
                    if (drawn[0] === tail || drawn[1] === tail) {
                        position = 'tail';
                        orientedTile = drawn[0] === tail ? [drawn[0], drawn[1]] : [drawn[1], drawn[0]];
                        newTail = drawn[0] === tail ? drawn[1] : drawn[0];
                    } else {
                        position = 'head';
                        orientedTile = drawn[0] === head ? [drawn[1], drawn[0]] : [drawn[0], drawn[1]];
                        newHead = drawn[0] === head ? drawn[1] : drawn[0];
                    }
                    logMove(`${this.name} plays [${orientedTile[0]}|${orientedTile[1]}] on ${position}`);
                    return {tile: orientedTile, position, newHead, newTail};
                }
            }
            logMove(`${this.name} passes`);
            return {tile: null, position: null, newHead: head, newTail: tail};
        }
    }

    // Calculate total pips in hand
    getTotalPips() {
        return this.hand.reduce((sum, tile) => sum + tile[0] + tile[1], 0);
    }
}

// Global game variables
let dominoes, boneyard, player1, player2, players, current, table, head, tail, isVsComp;
let player1Score = 0;
let player2Score = 0;
let lastTurnWasPass = false;
let scoringType = 'wins';
let targetScore = 100;

// Function to log moves to console and game log div
function logMove(message) {
    console.log(message);
    const logContent = document.getElementById('logContent');
    logContent.textContent += message + '\n';
    logContent.scrollTop = logContent.scrollHeight;
}

// Update hand count display
function updateHandCount(player) {
    const countSpan = document.getElementById(player.name === "Player 1" ? "player1Count" : "player2Count");
    countSpan.textContent = `(${player.hand.length} pieces)`;
}

// Initialize game based on mode
function initGame(p1Human, p2Human) {
    console.log("initGame called with p1Human:", p1Human, "p2Human:", p2Human); // Debug log
    isVsComp = !p2Human;
    dominoes = new CDominoes();
    boneyard = dominoes;
    player1 = new CPlayer("Player 1", "player1Hand", p1Human);
    player2 = new CPlayer(isVsComp ? "Computer" : "Player 2", "player2Hand", p2Human);
    // Reset scores when switching mode
    player1Score = 0;
    player2Score = 0;
    // Deal tiles
    for (let i = 0; i < 10; i++) {
        player1.hand.push(boneyard.pieces.shift());
    }
    for (let i = 0; i < 10; i++) {
        player2.hand.push(boneyard.pieces.shift());
    }
    // Sort hands initially
    player1.hand.sort((a, b) => (a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1]));
    player2.hand.sort((a, b) => (a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1]));
    player1.renderHand();
    player2.renderHand();
    players = [player1, player2];
    CRandom.shuffle(players);
    logMove(`First player: ${players[0].name}`);
    table = new CTable();
    head = null;
    tail = null;
    current = 0;
    lastTurnWasPass = false;
    updateBoneyardCount();
    toggleHands();
    nextTurn();
    document.getElementById('modeSelection').style.display = 'none'; // Hide mode selection after starting
    document.getElementById('instructions').style.display = 'block';
    document.getElementById('gameArea').style.display = 'block';
    document.getElementById('newGameBtn').style.display = 'none';
    document.getElementById('scoreboard').style.display = 'block';
    updateScoreboard(); // Moved here after players are created
    console.log("Game initialized, modeSelection hidden, gameArea shown"); // Debug log
}

// Toggle hand visibility: show current player's hand, show other with blank tiles
function toggleHands() {
    const player = players[current];
    const other = players[1 - current];
    if (player.isHuman) {
        player.renderHand(); // Show active player's hand with tiles
    } else {
        player.renderBlankHand(player.hand.length); // Show blank tiles for active computer
    }
    if (isVsComp && !other.isHuman) {
        other.renderBlankHand(other.hand.length); // Show blank tiles for computer in vs mode
    } else if (!other.isHuman) {
        other.renderBlankHand(other.hand.length); // Show blank tiles for non-active computer
    } else {
        other.renderBlankHand(other.hand.length); // Show blank tiles for non-active human
    }
    updateHandCount(player);
    updateHandCount(other);
}

// Proceed to next turn
function nextTurn() {
    toggleHands();
    const player = players[current];
    updateTurnInfo(`${player.name}'s turn. Head: ${head ?? '-'} Tail: ${tail ?? '-'}`);
    if (player.isHuman) {
        setupHumanTurn(player);
    } else {
        doCompTurn(player);
    }
}

// Computer turn handler
function doCompTurn(player) {
    const result = player.playAITurn(head, tail, boneyard);
    if (result.tile) {
        let pos = result.position;
        if (pos === 'start') pos = 'tail';
        table.place(result.tile, pos);
        head = result.newHead;
        tail = result.newTail;
        lastTurnWasPass = false;
    } else {
        if (lastTurnWasPass) {
            gameEnd();
            return;
        }
        lastTurnWasPass = true;
    }
    player.renderHand();
    updateBoneyardCount();
    logMove(`Table after turn: ${table.toASCII()}`);
    if (player.hand.length === 0) {
        gameWin(player);
        return;
    }
    current = 1 - current;
    nextTurn();
}

// Setup for human player's turn
function setupHumanTurn(player) {
    clearHighlights(player);
    document.getElementById('drawButton').style.display = 'none';
    const isFirst = head === null && tail === null;
    let playableIndices = [];
    player.hand.forEach((tile, idx) => {
        if (isFirst || tile[0] === head || tile[1] === head || tile[0] === tail || tile[1] === tail) {
            playableIndices.push(idx);
        }
    });
    if (playableIndices.length > 0) {
        const handDivs = Array.from(player.div.children);
        playableIndices.forEach(idx => {
            const d = handDivs[idx];
            d.style.border = '2px solid red';
            d.style.cursor = 'pointer';
            d.onclick = () => handleTileClick(player, d, player.hand[idx], idx);
        });
    } else {
        document.getElementById('drawButton').style.display = 'block';
    }
}

// Handle drawing from boneyard for human
function handleDraw() {
    const player = players[current];
    let foundPlayable = false;
    while (boneyard.pieces.length > 0 && !foundPlayable) {
        const drawn = boneyard.pieces.shift();
        player.hand.push(drawn);
        logMove(`${player.name} draws [${drawn[0]}|${drawn[1]}]`);
        updateBoneyardCount();
        const idx = player.hand.length - 1;
        const tile = drawn;
        if (tile[0] === head || tile[1] === head || tile[0] === tail || tile[1] === tail) {
            player.renderHand();
            clearHighlights(player);
            const handDivs = Array.from(player.div.children);
            const d = handDivs[idx];
            d.style.border = '2px solid red';
            d.style.cursor = 'pointer';
            d.onclick = () => handleTileClick(player, d, tile, idx);
            foundPlayable = true;
        }
    }
    if (!foundPlayable) {
        logMove(`${player.name} passes`);
        if (lastTurnWasPass) {
            gameEnd();
            return;
        }
        lastTurnWasPass = true;
        current = 1 - current;
        nextTurn();
    } else {
        lastTurnWasPass = false;
    }
}

// Handle clicking a tile
function handleTileClick(player, div, tile, idx) {
    clearHighlights(player);
    let possiblePositions = [];
    if (head === null && tail === null) {
        possiblePositions.push('start');
    } else {
        if (tile[0] === head || tile[1] === head) possiblePositions.push('head');
        if (tile[0] === tail || tile[1] === tail) possiblePositions.push('tail');
    }
    if (possiblePositions.length === 1) {
        placeTile(player, tile, idx, possiblePositions[0]);
    } else if (possiblePositions.length === 2) {
        // Prompt choice for position
        const choiceDiv = document.createElement('div');
        choiceDiv.style.position = 'absolute';
        choiceDiv.style.top = '50%';
        choiceDiv.style.left = '50%';
        choiceDiv.style.transform = 'translate(-50%, -50%)';
        choiceDiv.style.background = 'white';
        choiceDiv.style.padding = '10px';
        choiceDiv.style.border = '1px solid black';
        choiceDiv.innerHTML = `<button id="headBtn">Place on Head</button><button id="tailBtn">Place on Tail</button>`;
        document.body.appendChild(choiceDiv);
        document.getElementById('headBtn').onclick = () => {
            placeTile(player, tile, idx, 'head');
            choiceDiv.remove();
        };
        document.getElementById('tailBtn').onclick = () => {
            placeTile(player, tile, idx, 'tail');
            choiceDiv.remove();
        };
    }
}

// Place the selected tile
function placeTile(player, tile, idx, pos) {
    let oriented = tile;
    let newHead = head;
    let newTail = tail;
    if (pos === 'head') {
        if (tile[0] === head) {
            oriented = [tile[1], tile[0]];
            newHead = tile[1];
        } else {
            oriented = [tile[0], tile[1]];
            newHead = tile[0];
        }
    } else {
        if (pos === 'start') pos = 'tail';
        if (tile[0] === tail) {
            oriented = [tile[0], tile[1]];
            newTail = tile[1];
        } else {
            oriented = [tile[1], tile[0]];
            newTail = tile[0];
        }
    }
    player.hand.splice(idx, 1);
    table.place(oriented, pos);
    head = newHead;
    tail = newTail;
    player.renderHand();
    logMove(`${player.name} plays [${oriented[0]}|${oriented[1]}] on ${pos}`);
    logMove(`Table after turn: ${table.toASCII()}`);
    if (player.hand.length === 0) {
        gameWin(player);
        return;
    }
    lastTurnWasPass = false;
    current = 1 - current;
    nextTurn();
}

// Clear highlights on hand
function clearHighlights(player) {
    const handDivs = Array.from(player.div.children);
    handDivs.forEach(d => {
        d.style.border = '';
        d.style.cursor = '';
        d.onclick = null;
    });
}

// Update turn info text
function updateTurnInfo(text) {
    document.getElementById('turnInfo').textContent = text;
}

// Update boneyard count display
function updateBoneyardCount() {
    document.getElementById('boneyardCount').textContent = `Boneyard: ${boneyard.pieces.length} pieces left`;
}

// Update scoreboard display
function updateScoreboard() {
    const target = parseInt(document.getElementById('targetScore').value) || targetScore;
    if (scoringType === 'wins') {
        document.getElementById('scoreText').textContent = `${player1.name}: ${player1Score} wins - ${player2.name}: ${player2Score} wins (Target: ${target} wins)`;
    } else {
        document.getElementById('scoreText').textContent = `${player1.name}: ${player1Score} points - ${player2.name}: ${player2Score} points (Target: ${target} points)`;
    }
}

// Handle game win
function gameWin(winner) {
    const loser = players[1 - current];
    let score = loser.getTotalPips();
    if (scoringType === 'points') {
        if (winner.name === "Player 1") {
            player1Score += score;
        } else {
            player2Score += score;
        }
    } else {
        if (winner.name === "Player 1") {
            player1Score++;
        } else {
            player2Score++;
        }
    }
    updateScoreboard();
    alert(`${winner.name} won the round with ${score} points from ${loser.name}!`);
    logMove(`\n${winner.name} won the round with ${score} points from ${loser.name}!`);
    logMove(`${loser.name} has ${loser.hand.length} pieces left: ${loser.hand.map(t => `[${t[0]}|${t[1]}]`).join(', ')}`);
    logMove(`Final table: ${table.toASCII()}`);
    checkGameWin();
    endGame();
}

// Handle game end due to consecutive passes
function gameEnd() {
    const player1Pips = player1.getTotalPips();
    const player2Pips = player2.getTotalPips();
    let winner = null;
    if (player1Pips < player2Pips) {
        winner = player1;
        if (scoringType === 'points') {
            player1Score += player2Pips;
        } else {
            player1Score++;
        }
    } else if (player2Pips < player1Pips) {
        winner = player2;
        if (scoringType === 'points') {
            player2Score += player1Pips;
        } else {
            player2Score++;
        }
    } else {
        alert("Game ended in a draw!");
        logMove("\nGame ended in a draw!");
    }
    if (winner) {
        alert(`${winner.name} wins the round with ${winner === player1 ? player2Pips : player1Pips} points from ${winner === player1 ? player2.name : player1.name}!`);
        logMove(`\n${winner.name} wins the round with ${winner === player1 ? player2Pips : player1Pips} points from ${winner === player1 ? player2.name : player1.name}!`);
        logMove(`${player1.name} has ${player1Pips} pips left: ${player1.hand.map(t => `[${t[0]}|${t[1]}]`).join(', ')}`);
        logMove(`${player2.name} has ${player2Pips} pips left: ${player2.hand.map(t => `[${t[0]}|${t[1]}]`).join(', ')}`);
        logMove(`Final table: ${table.toASCII()}`);
    }
    updateScoreboard();
    checkGameWin();
    endGame();
}

// Check if game is won based on target score
function checkGameWin() {
    const target = parseInt(document.getElementById('targetScore').value) || targetScore;
    if ((scoringType === 'wins' && (player1Score >= target || player2Score >= target)) ||
        (scoringType === 'points' && (player1Score >= target || player2Score >= target))) {
        const winner = player1Score > player2Score ? player1.name : player2.name;
        alert(`${winner} wins the game with a score of ${Math.max(player1Score, player2Score)}!`);
        logMove(`\n${winner} wins the game with a score of ${Math.max(player1Score, player2Score)}!`);
    }
}

// Common function to end the round
function endGame() {
    document.getElementById('drawButton').style.display = 'none';
    document.getElementById('newGameBtn').style.display = 'block';
}

// Setup mode buttons
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded, attaching event listeners"); // Debug log
    document.getElementById('twoPlayerBtn').onclick = () => {
        console.log("2 Players button clicked"); // Debug log
        initGame(true, true);
    };

    document.getElementById('vsCompBtn').onclick = () => {
        console.log("Player vs Computer button clicked"); // Debug log
        initGame(true, false);
    };

    document.getElementById('drawButton').onclick = handleDraw;
    document.getElementById('newGameBtn').onclick = () => {
        console.log("New Game button clicked"); // Debug log
        document.getElementById('gameArea').style.display = 'none';
        document.getElementById('instructions').style.display = 'none';
        document.getElementById('logContent').textContent = '';
        document.getElementById('newGameBtn').style.display = 'none';
        document.getElementById('modeSelection').style.display = 'block'; // Show mode selection for new game
    };
    document.getElementById('resetScores').onclick = () => {
        player1Score = 0;
        player2Score = 0;
        updateScoreboard();
    };
    document.getElementById('scoringType').onchange = (e) => {
        scoringType = e.target.value;
        updateScoreboard();
    };
    document.getElementById('targetScore').onchange = (e) => {
        targetScore = parseInt(e.target.value) || 100;
        updateScoreboard();
    };
});