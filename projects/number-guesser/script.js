// Script for Number Guesser 
const guessInput = document.getElementById('guessInput');
const guessButton = document.getElementById('guessButton');
const resetButton = document.getElementById('resetButton');
const feedback = document.getElementById('feedback');
const previousGuessesSpan = document.getElementById('previousGuesses');

let secretNumber;
let attempts;
let previousGuesses;

function initGame() {
    secretNumber = Math.floor(Math.random() * 100) + 1;
    attempts = 0;
    previousGuesses = [];
    feedback.textContent = '';
    feedback.className = 'feedback'; // Reset class
    previousGuessesSpan.textContent = '---';
    guessInput.value = '';
    guessInput.disabled = false;
    guessButton.disabled = false;
    guessInput.focus();
    // console.log(`Secret Number: ${secretNumber}`); // For debugging
}

function handleGuess() {
    const userGuess = parseInt(guessInput.value);

    if (isNaN(userGuess) || userGuess < 1 || userGuess > 100) {
        feedback.textContent = 'Please enter a valid number between 1 and 100.';
        feedback.className = 'feedback wrong';
        return;
    }

    attempts++;
    previousGuesses.push(userGuess);
    previousGuessesSpan.textContent = previousGuesses.join(', ');

    if (userGuess === secretNumber) {
        feedback.textContent = `Correct! You guessed the number ${secretNumber} in ${attempts} attempts.`;
        feedback.className = 'feedback correct';
        endGame();
    } else if (userGuess < secretNumber) {
        feedback.textContent = 'Too low! Try again.';
        feedback.className = 'feedback wrong';
    } else {
        feedback.textContent = 'Too high! Try again.';
        feedback.className = 'feedback wrong';
    }

    guessInput.value = '';
    guessInput.focus();
}

function endGame() {
    guessInput.disabled = true;
    guessButton.disabled = true;
}

guessButton.addEventListener('click', handleGuess);
guessInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        handleGuess();
    }
});
resetButton.addEventListener('click', initGame);

// Initialize the game on load
initGame(); 