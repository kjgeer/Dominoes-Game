// Remove highlights and click handlers from all tiles in the player's hand
function clearHighlights(player) {
    const handDivs = Array.from(player.div.children);
    handDivs.forEach(d => {
        d.style.border = '';
        d.style.borderRadius = '';
        d.style.cursor = '';
        d.onclick = null;
    });
}

// LANDING PAGE DOMINOES


function drawLandingDominoes() {
    const canvas1 = document.getElementById('domino1');
    if (canvas1) {
        const ctx1 = canvas1.getContext('2d');
        drawDecorativeDomino(ctx1, 5, 4);
    }
    
    const canvas2 = document.getElementById('domino2');
    if (canvas2) {
        const ctx2 = canvas2.getContext('2d');
        drawDecorativeDomino(ctx2, 6, 6);
    }
    
    const canvas3 = document.getElementById('domino3');
    if (canvas3) {
        const ctx3 = canvas3.getContext('2d');
        drawDecorativeDomino(ctx3, 4, 1);
    }
}

function drawDecorativeDomino(ctx, val1, val2) {
    const w = 120;
    const h = 180;
    const radius = 16;
    
    ctx.fillStyle = '#f5f5f0';
    ctx.fillRect(0, 0, w, h);
    
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.moveTo(radius, 0);
    ctx.lineTo(w - radius, 0);
    ctx.quadraticCurveTo(w, 0, w, radius);
    ctx.lineTo(w, h - radius);
    ctx.quadraticCurveTo(w, h, w - radius, h);
    ctx.lineTo(radius, h);
    ctx.quadraticCurveTo(0, h, 0, h - radius);
    ctx.lineTo(0, radius);
    ctx.quadraticCurveTo(0, 0, radius, 0);
    ctx.closePath();
    ctx.fill();
    
    ctx.strokeStyle = '#e5e5e5';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(0, h / 2);
    ctx.lineTo(w, h / 2);
    ctx.strokeStyle = '#e5e5e5';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    drawPipsDecorative(ctx, w / 2, h / 4, w * 0.4, h * 0.4, val1);
    drawPipsDecorative(ctx, w / 2, h * 0.75, w * 0.4, h * 0.4, val2);
}

function drawPipsDecorative(ctx, centerX, centerY, w, h, val) {
    if (val === 0) return;
    ctx.fillStyle = '#1a1a1a';
    const r = 6;
    
    const positions = [
        [],
        [[0.5, 0.5]],
        [[0.3, 0.3], [0.7, 0.7]],
        [[0.3, 0.3], [0.5, 0.5], [0.7, 0.7]],
        [[0.3, 0.3], [0.3, 0.7], [0.7, 0.3], [0.7, 0.7]],
        [[0.3, 0.3], [0.3, 0.7], [0.5, 0.5], [0.7, 0.3], [0.7, 0.7]],
        [[0.3, 0.3], [0.3, 0.5], [0.3, 0.7], [0.7, 0.3], [0.7, 0.5], [0.7, 0.7]]
    ];
    
    positions[val].forEach(pos => {
        const px = centerX - w / 2 + pos[0] * w;
        const py = centerY - h / 2 + pos[1] * h;
        ctx.beginPath();
        ctx.arc(px, py, r, 0, 2 * Math.PI);
        ctx.fill();
    });
}

// Navigation functions
function backToHome() {
    document.getElementById('landingPage').style.display = 'flex';
    document.getElementById('gameArea').style.display = 'none';
    document.getElementById('instructionsPage').style.display = 'none';
}

function showInstructions() {
    document.getElementById('landingPage').style.display = 'none';
    document.getElementById('gameArea').style.display = 'none';
    document.getElementById('instructionsPage').style.display = 'flex';
}

function showGame() {
    document.getElementById('landingPage').style.display = 'none';
    document.getElementById('instructionsPage').style.display = 'none';
    document.getElementById('gameArea').style.display = 'flex';
}


// GAME LOGIC

const pipPositions = [
    [],
    [[0.5, 0.5]],
    [[0.25, 0.25], [0.75, 0.75]],
    [[0.25, 0.25], [0.5, 0.5], [0.75, 0.75]],
    [[0.25, 0.25], [0.25, 0.75], [0.75, 0.25], [0.75, 0.75]],
    [[0.25, 0.25], [0.25, 0.75], [0.5, 0.5], [0.75, 0.25], [0.75, 0.75]],
    [[0.25, 0.25], [0.25, 0.5], [0.25, 0.75], [0.75, 0.25], [0.75, 0.5], [0.75, 0.75]]
];

const pipColors = [null, 'red', '#ff9900', 'yellow', 'green', 'blue', 'purple'];

function drawDomino(ctx, x, y, val1, val2, w, h) {
    ctx.fillStyle = 'white';
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = 'black';
    ctx.strokeRect(x, y, w, h);
    ctx.beginPath();
    ctx.moveTo(x + w / 2, y);
    ctx.lineTo(x + w / 2, y + h);
    ctx.stroke();
    drawPips(ctx, x, y, w / 2, h, val1, pipColors[val1]);
    drawPips(ctx, x + w / 2, y, w / 2, h, val2, pipColors[val2]);
}

function drawBlankDomino(ctx, x, y, w, h) {
    ctx.fillStyle = 'white';
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = 'black';
    ctx.strokeRect(x, y, w, h);
}

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

class CRandom {
    static shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
}

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

class CTable {
    constructor() {
        this.chain = [];
        this.canvas = document.getElementById('tableCanvas');
        this.ctx = this.canvas.getContext('2d');
    }

    place(tile, position) {
        if (this.chain.length === 0) {
            this.chain.push(tile);
        } else if (position === 'head') {
            this.chain.unshift(tile);
        } else if (position === 'tail') {
            this.chain.push(tile);
        }
        this.lastPlacement = position;
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

    render() {
        const dominoW = 80;
        const dominoH = 40;
        const spacing = 5;
        let y = 20;
        // Center the chain in the canvas
        const chainLen = this.chain.length;
        const totalWidth = chainLen * (dominoW + spacing) - spacing;
        let x = Math.max((this.canvas.width - totalWidth) / 2, 0);
        // Expand canvas if needed
        const requiredWidth = Math.max(this.canvas.width, totalWidth + 40);
        if (requiredWidth > this.canvas.width) {
            this.canvas.width = requiredWidth;
        }
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.chain.forEach(tile => {
            drawDomino(this.ctx, x, y, tile[0], tile[1], dominoW, dominoH);
            x += dominoW + spacing;
        });
        // Auto-scroll play area to the correct end
        const playArea = document.getElementById('tableArea');
        if (playArea) {
            if (this.lastPlacement === 'head') {
                // Scroll to the leftmost tile
                playArea.scrollLeft = 0;
            } else {
                // Scroll to the rightmost tile
                playArea.scrollLeft = playArea.scrollWidth;
            }
        }
    }
}

class CPlayer {
    constructor(name, divId, isHuman) {
        this.name = name;
        this.hand = [];
        this.div = document.getElementById(divId);
        this.isHuman = isHuman;
    }

    renderHand() {
        this.div.innerHTML = '';
        this.hand.forEach((tile, idx) => {
            const canv = document.createElement('canvas');
            canv.width = 80;
            canv.height = 40;
            const ctx = canv.getContext('2d');
            drawDomino(ctx, 0, 0, tile[0], tile[1], 80, 40);
            const div = document.createElement('div');
            div.appendChild(canv);
            div.tile = tile;
            div.idx = idx;
            this.div.appendChild(div);
        });
        updateHandCount(this);
    }

    renderBlankHand(count) {
        this.div.innerHTML = '';
        for (let i = 0; i < count; i++) {
            const canv = document.createElement('canvas');
            canv.width = 80;
            canv.height = 40;
            const ctx = canv.getContext('2d');
            drawBlankDomino(ctx, 0, 0, 80, 40);
            const div = document.createElement('div');
            div.appendChild(canv);
            this.div.appendChild(div);
        }
        updateHandCount(this);
    }

    playAITurn(head, tail, boneyard) {
        if (head === null && tail === null) {
            const index = Math.floor(Math.random() * this.hand.length);
            let tile = this.hand.splice(index, 1)[0];
            if (tile[0] > tile[1]) {
                tile = [tile[1], tile[0]];
            }
            logMove(`${this.name} starts with [${tile[0]}|${tile[1]}]`);
            return {tile, position: 'start', newHead: tile[0], newTail: tile[1]};
        }
        const playableTiles = this.hand.filter(t => t[0] === head || t[1] === head || t[0] === tail || t[1] === tail);
        if (playableTiles.length > 0) {
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

    getTotalPips() {
        return this.hand.reduce((sum, tile) => sum + tile[0] + tile[1], 0);
    }
}

let dominoes, boneyard, player1, player2, players, current, table, head, tail, isVsComp;
let player1Score = 0;
let player2Score = 0;
let lastTurnWasPass = false;
let scoringType = 'wins';
let targetScore = 100;

function logMove(message) {
    console.log(message);
    const logContent = document.getElementById('logContent');
    logContent.textContent += message + '\n';
    logContent.scrollTop = logContent.scrollHeight;
}

function updateHandCount(player) {
    const countSpan = document.getElementById(player.name === "Player 1" ? "player1Count" : "player2Count");
    countSpan.textContent = `(${player.hand.length} tiles)`;
}

function initGame(p1Human, p2Human) {
    isVsComp = !p2Human;
    dominoes = new CDominoes();
    boneyard = dominoes;
    player1 = new CPlayer("Player 1", "player1Hand", p1Human);
    player2 = new CPlayer(isVsComp ? "Computer" : "Player 2", "player2Hand", p2Human);
    player1Score = 0;
    player2Score = 0;
    
    for (let i = 0; i < 10; i++) {
        player1.hand.push(boneyard.pieces.shift());
    }
    for (let i = 0; i < 10; i++) {
        player2.hand.push(boneyard.pieces.shift());
    }
    
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
    document.getElementById('newGameBtn').style.display = 'none';
    updateScoreboard();
    showGame();
}

function toggleHands() {
    const player = players[current];
    const other = players[1 - current];
    if (player.isHuman) {
        player.renderHand();
    } else {
        player.renderBlankHand(player.hand.length);
    }
    if (isVsComp && !other.isHuman) {
        other.renderBlankHand(other.hand.length);
    } else if (!other.isHuman) {
        other.renderBlankHand(other.hand.length);
    } else {
        other.renderBlankHand(other.hand.length);
    }
    updateHandCount(player);
    updateHandCount(other);
}

function nextTurn() {
    toggleHands();
    const player = players[current];
    updateTurnInfo(`${player.name}'s turn`);
    if (player.isHuman) {
        setupHumanTurn(player);
    } else {
        setTimeout(() => doCompTurn(player), 700);
    }
}

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
            d.style.border = '3px solid #ff4444';
            d.style.borderRadius = '4px';
            d.style.cursor = 'pointer';
            d.onclick = () => handleTileClick(player, d, player.hand[idx], idx);
        });
    } else {
        document.getElementById('drawButton').style.display = 'block';
    }
}

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
            d.style.border = '3px solid #ff4444';
            d.style.borderRadius = '4px';
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
        const choiceDiv = document.createElement('div');
        choiceDiv.style.position = 'fixed';
        choiceDiv.style.top = '50%';
        choiceDiv.style.left = '50%';
        choiceDiv.style.transform = 'translate(-50%, -50%)';
        choiceDiv.style.background = 'white';
        choiceDiv.style.padding = '20px';
        choiceDiv.style.borderRadius = '12px';
        choiceDiv.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)';
        choiceDiv.style.zIndex = '1000';
        choiceDiv.innerHTML = `
            <p style="margin-bottom: 15px; font-weight: 600; color: #1a1a1a;">Choose placement:</p>
            <button id="headBtn" style="margin-right: 10px; padding: 10px 20px; background: #1a1a1a; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">Head</button>
            <button id="tailBtn" style="padding: 10px 20px; background: #1a1a1a; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">Tail</button>
        `;
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

function placeTile(player, tile, idx, pos) {
    let oriented = tile;
    // Safeguard: Only allow play on valid end, and update head/tail correctly
    if (pos === 'head') {
        if (tile[1] === head) {
            oriented = [tile[1], tile[0]];
        } else {
            oriented = [tile[0], tile[1]];
        }
    } else {
        if (pos === 'start') pos = 'tail';
        if (tile[0] === tail) {
            oriented = [tile[0], tile[1]];
        } else {
            oriented = [tile[1], tile[0]];
        }
    }
    player.hand.splice(idx, 1);
    table.place(oriented, pos);
    // Always update head and tail after placing
    head = table.getHead();
    tail = table.getTail();
    lastTurnWasPass = false;
    player.renderHand();
    updateBoneyardCount();
    logMove(`${player.name} plays [${oriented[0]}|${oriented[1]}] on ${pos}`);
    logMove(`Table after turn: ${table.toASCII()}`);
    if (player.hand.length === 0) {
        gameWin(player);
        return;
    }
    current = 1 - current;
    nextTurn();
        // ...existing code...
}

function updateTurnInfo(text) {
    document.getElementById('turnInfo').textContent = text;
}

function updateBoneyardCount() {
    document.getElementById('boneyardCount').textContent = `Boneyard: ${boneyard.pieces.length} pieces`;
}

function updateScoreboard() {
    const target = parseInt(document.getElementById('targetScore').value) || targetScore;
    if (scoringType === 'wins') {
        document.getElementById('scoreText').textContent = `${player1.name}: ${player1Score} - ${player2.name}: ${player2Score} (Target: ${target})`;
    } else {
        document.getElementById('scoreText').textContent = `${player1.name}: ${player1Score} pts - ${player2.name}: ${player2Score} pts (Target: ${target})`;
    }
}

// Add a function to clear the table
function clearTable() {
    if (table && table.chain) {
        table.chain = [];
        table.render();
    }
}

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
        alert(`${winner.name} wins the round!`);
        logMove(`\n${winner.name} wins the round!`);
        logMove(`${player1.name} has ${player1Pips} pips left`);
        logMove(`${player2.name} has ${player2Pips} pips left`);
        logMove(`Final table: ${table.toASCII()}`);
    }
    updateScoreboard();
    checkGameWin();
    endGame();
}

function checkGameWin() {
    const target = parseInt(document.getElementById('targetScore').value) || targetScore;
    if ((scoringType === 'wins' && (player1Score >= target || player2Score >= target)) ||
        (scoringType === 'points' && (player1Score >= target || player2Score >= target))) {
        const winner = player1Score > player2Score ? player1.name : player2.name;
        alert(`${winner} wins the game with a score of ${Math.max(player1Score, player2Score)}!`);
        logMove(`\n${winner} wins the game!`);
    }
}

function endGame() {
    document.getElementById('drawButton').style.display = 'none';
    document.getElementById('newGameBtn').style.display = 'block';
    document.getElementById('continueGameBtn').style.display = 'block';
}

// EVENT LISTENERS

document.addEventListener('DOMContentLoaded', () => {
    // Landing page buttons
    document.getElementById('twoPlayerBtn').onclick = () => {
        initGame(true, true);
    };

    document.getElementById('vsCompBtn').onclick = () => {
        initGame(true, false);
    };

    document.getElementById('howToPlayLandingBtn').onclick = () => {
        showInstructions();
    };

    // Game buttons
    document.getElementById('drawButton').onclick = handleDraw;
    
    document.getElementById('newGameBtn').onclick = () => {
        document.getElementById('logContent').textContent = '';
        clearTable();
        backToHome();
    };
    document.getElementById('continueGameBtn').onclick = () => {
        clearTable();
        document.getElementById('newGameBtn').style.display = 'none';
        document.getElementById('continueGameBtn').style.display = 'none';
        initGame(player1.isHuman, player2.isHuman);
    };

    // Settings toggle
    document.getElementById('settingsBtn').onclick = () => {
        const panel = document.getElementById('settingsPanel');
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    };

    // How to Play button in game
    document.getElementById('howToPlayBtn').onclick = () => {
        showInstructions();
    };

    // Game log toggle
    document.getElementById('logToggle').onclick = () => {
        const log = document.getElementById('gameLog');
        const toggle = document.getElementById('logToggle');
        if (log.style.display === 'none') {
            log.style.display = 'block';
            toggle.classList.add('active');
        } else {
            log.style.display = 'none';
            toggle.classList.remove('active');
        }
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
