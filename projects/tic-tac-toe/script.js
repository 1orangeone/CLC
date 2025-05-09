const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const statusDisplay = document.getElementById('status');
const resetButton = document.getElementById('resetButton');

const PLAYER_X = 'X';
const PLAYER_O = 'O'; // AI
let currentPlayer = PLAYER_X;
let gameActive = true;
let gameState = ['', '', '', '', '', '', '', '', '']; // Represents the 3x3 board

const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (gameState[clickedCellIndex] !== '' || !gameActive || currentPlayer === PLAYER_O) {
        return; // Cell already played, game over, or not player's turn
    }

    handlePlayerMove(clickedCell, clickedCellIndex);

    if (gameActive) {
        // Short delay before AI moves for better UX
        setTimeout(handleAIMove, 500);
    }
}

function handlePlayerMove(cell, index) {
    gameState[index] = PLAYER_X;
    cell.textContent = PLAYER_X;
    cell.classList.add('x');
    if (checkWin(PLAYER_X)) {
        endGame(false, PLAYER_X);
    } else if (isDraw()) {
        endGame(true);
    } else {
        switchPlayer(PLAYER_O);
    }
}

function handleAIMove() {
    if (!gameActive) return;

    const bestMoveIndex = findBestMove();

    if (bestMoveIndex !== -1) { // Check if a valid move was found
        gameState[bestMoveIndex] = PLAYER_O;
        const cell = document.querySelector(`.cell[data-index='${bestMoveIndex}']`);
        cell.textContent = PLAYER_O;
        cell.classList.add('o');

        if (checkWin(PLAYER_O)) {
            endGame(false, PLAYER_O);
        } else if (isDraw()) {
            endGame(true);
        } else {
            switchPlayer(PLAYER_X);
        }
    }
    // If bestMoveIndex is -1, it implies no moves are possible (shouldn't happen if not draw/win)
}

function findBestMove() {
    // 1. Check if AI can win
    for (let i = 0; i < gameState.length; i++) {
        if (gameState[i] === '') {
            gameState[i] = PLAYER_O;
            if (checkWin(PLAYER_O)) {
                gameState[i] = ''; // Reset temporary move
                return i;
            }
            gameState[i] = ''; // Reset temporary move
        }
    }

    // 2. Check if Player can win and block
    for (let i = 0; i < gameState.length; i++) {
        if (gameState[i] === '') {
            gameState[i] = PLAYER_X;
            if (checkWin(PLAYER_X)) {
                gameState[i] = ''; // Reset temporary move
                return i;
            }
            gameState[i] = ''; // Reset temporary move
        }
    }

    // 3. Take center if available
    if (gameState[4] === '') {
        return 4;
    }

    // 4. Take corners if available
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(index => gameState[index] === '');
    if (availableCorners.length > 0) {
        return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }

    // 5. Take sides if available
    const sides = [1, 3, 5, 7];
    const availableSides = sides.filter(index => gameState[index] === '');
    if (availableSides.length > 0) {
        return availableSides[Math.floor(Math.random() * availableSides.length)];
    }

    return -1; // Should not happen in a normal game flow unless board is full
}


function switchPlayer(nextPlayer) {
    currentPlayer = nextPlayer;
    statusDisplay.textContent = `Player ${currentPlayer}'s Turn`;
}

function checkWin(player) {
    return winConditions.some(condition => {
        return condition.every(index => {
            return gameState[index] === player;
        });
    });
}

function isDraw() {
    return !gameState.includes('') && !checkWin(PLAYER_X) && !checkWin(PLAYER_O);
}

function endGame(draw, winner = null) {
    gameActive = false;
    if (draw) {
        statusDisplay.textContent = "Game ended in a draw!";
    } else {
        statusDisplay.textContent = `Player ${winner} has won!`;
    }
}

function resetGame() {
    gameState = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = PLAYER_X;
    statusDisplay.textContent = `Player ${currentPlayer}'s Turn`;
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o');
    });
}

// Add event listeners
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);

// Initial status
statusDisplay.textContent = `Player ${currentPlayer}'s Turn`; 