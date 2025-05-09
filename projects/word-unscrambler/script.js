document.addEventListener('DOMContentLoaded', () => {
    const scrambledWordEl = document.getElementById('scrambled-word');
    const userInputEl = document.getElementById('user-input');
    const submitBtn = document.getElementById('submit-btn');
    const nextBtn = document.getElementById('next-btn');
    const hintBtn = document.getElementById('hint-btn');
    const scoreEl = document.getElementById('score');
    const timerEl = document.getElementById('timer');
    const messageEl = document.getElementById('message');
    const hintEl = document.getElementById('hint');
    const gameOverEl = document.getElementById('game-over');
    const finalScoreEl = document.getElementById('final-score');
    const playAgainBtn = document.getElementById('play-again-btn');

    // variables
    let currentWord = '';
    let scrambledWord = '';
    let score = 0;
    let timeLeft = 60;
    let timer;
    let hintUsed = false;

    // Word list
    const words = [
        'apple', 'banana', 'cherry', 'dolphin', 'elephant', 
        'flamingo', 'giraffe', 'honey', 'igloo', 'jungle',
        'kangaroo', 'lemon', 'monkey', 'orange', 'penguin',
        'queen', 'rabbit', 'strawberry', 'tiger', 'umbrella',
        'violin', 'walrus', 'xylophone', 'zebra', 'yacht'
    ];

    // Scramble a word
    function scrambleWord(word) {
        const wordArray = word.split('');
        for (let i = wordArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [wordArray[i], wordArray[j]] = [wordArray[j], wordArray[i]];
        }
        return wordArray.join('');
    }

    function getNewWord() {
        hintUsed = false;
        hintEl.classList.add('hidden');
        hintEl.textContent = '';
        messageEl.textContent = '';
        userInputEl.value = '';
        
        // Select random word
        currentWord = words[Math.floor(Math.random() * words.length)];
        
        // scrambling
        do {
            scrambledWord = scrambleWord(currentWord);
        } while (scrambledWord === currentWord);
        
        // Display the scrambled word
        scrambledWordEl.textContent = scrambledWord.toUpperCase();
        
        nextBtn.classList.add('hidden');
        submitBtn.classList.remove('hidden');
        userInputEl.focus();
    }

    // Check answer
    function checkAnswer() {
        const userInput = userInputEl.value.trim().toLowerCase();
        
        if (!userInput) {
            messageEl.textContent = 'Please enter a word!';
            messageEl.className = 'message error';
            return;
        }
        
        if (userInput === currentWord) {
            // Correct answer
            messageEl.textContent = 'Correct! Well done!';
            messageEl.className = 'message success';
            
            // Update score
            const pointsEarned = hintUsed ? 1 : 2;
            score += pointsEarned;
            scoreEl.textContent = score;
            
            nextBtn.classList.remove('hidden');
            submitBtn.classList.add('hidden');
            nextBtn.focus();
        } else {
            // Wrong answer
            messageEl.textContent = 'Incorrect. Try again!';
            messageEl.className = 'message error';
        }
    }

    // Show hint
    function showHint() {
        if (!hintUsed) {
            hintUsed = true;
            const firstLetter = currentWord[0];
            hintEl.textContent = `Hint: The word starts with "${firstLetter.toUpperCase()}"`;
            hintEl.classList.remove('hidden');
        }
    }

    // Start timer
    function startTimer() {
        timeLeft = 60;
        timerEl.textContent = timeLeft;
        
        timer = setInterval(() => {
            timeLeft--;
            timerEl.textContent = timeLeft;
            
            if (timeLeft <= 0) {
                endGame();
            }
        }, 1000);
    }

    function endGame() {
        clearInterval(timer);
        gameOverEl.classList.remove('hidden');
        document.querySelector('.game-container').classList.add('hidden');
        finalScoreEl.textContent = score;
    }

    function resetGame() {
        clearInterval(timer);
        score = 0;
        scoreEl.textContent = score;
        gameOverEl.classList.add('hidden');
        document.querySelector('.game-container').classList.remove('hidden');
        startTimer();
        getNewWord();
    }

    // Event listeners
    submitBtn.addEventListener('click', checkAnswer);
    nextBtn.addEventListener('click', getNewWord);
    hintBtn.addEventListener('click', showHint);
    playAgainBtn.addEventListener('click', resetGame);
    
    // Allow Enter key to submit
    userInputEl.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            if (nextBtn.classList.contains('hidden')) {
                checkAnswer();
            } else {
                getNewWord();
            }
        }
    });

    // Initialize
    resetGame();
}); 