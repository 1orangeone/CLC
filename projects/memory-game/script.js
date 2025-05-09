const gameGrid = document.getElementById('gameGrid');
const movesSpan = document.getElementById('moves');
const resetButton = document.getElementById('resetButton');

// Use simple symbols for cards
const symbols = ['🍎', '🍌', '🍒', '🍓', '🍉', '🍇'];
let cards = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false; // Prevents clicking more than 2 cards
let moves = 0;
let matchedPairs = 0;

function createBoard() {
    // double the symbols for pairs and shuffle
    let cardSymbols = [...symbols, ...symbols];
    cardSymbols.sort(() => 0.5 - Math.random());

    gameGrid.innerHTML = ''; // Clear previous grid
    cards = []; // Clear cards array
    matchedPairs = 0;
    moves = 0;
    updateMoves();

    cardSymbols.forEach(symbol => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.symbol = symbol;

        const frontFace = document.createElement('div');
        frontFace.classList.add('front-face');
        frontFace.textContent = ''; // Or leave blank

        const backFace = document.createElement('div');
        backFace.classList.add('back-face');
        backFace.textContent = symbol;

        card.appendChild(frontFace);
        card.appendChild(backFace);

        card.addEventListener('click', flipCard);
        gameGrid.appendChild(card);
        cards.push(card);
    });
}

function flipCard() {
    if (lockBoard) return; // Board is locked
    if (this === firstCard) return; // Clicked the same card twice

    this.classList.add('flipped');

    if (!firstCard) {
        // First card flipped
        firstCard = this;
        return;
    }

    // 2nd card flipped
    secondCard = this;
    lockBoard = true; // Lock board while checking
    incrementMoves();

    checkForMatch();
}

function checkForMatch() {
    const isMatch = firstCard.dataset.symbol === secondCard.dataset.symbol;

    if (isMatch) {
        disableCards();
        matchedPairs++;
        if (matchedPairs === symbols.length) {
            setTimeout(() => alert(`You won in ${moves} moves!`), 500);
        }
    } else {
        unflipCards();
    }
}

function disableCards() {
    // It's a match!
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    resetBoardState();
}

function unflipCards() {
    // if not match
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetBoardState();
    }, 1000); // 1 second 
}

function resetBoardState() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
}

function incrementMoves() {
    moves++;
    updateMoves();
}

function updateMoves() {
    movesSpan.textContent = moves;
}

resetButton.addEventListener('click', createBoard);

createBoard(); 