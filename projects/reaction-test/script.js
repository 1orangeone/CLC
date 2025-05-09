// DOM elements
const reactionBox = document.getElementById('reaction-box');
const instructions = document.getElementById('instructions');

// Game state variables
let state = 'waiting'; // waiting, ready, go, finished
let startTime;
let endTime;
let timeoutId;

// Initialize the game
function init() {
    reactionBox.textContent = 'Click here to start';
    reactionBox.className = 'waiting';
    instructions.textContent = 'Wait for the box to turn green, then click as quickly as possible!';
    state = 'waiting';
}

// Start the game
function startGame() {
    reactionBox.textContent = 'Wait...';
    reactionBox.className = 'ready';
    instructions.textContent = 'Wait for green...';
    state = 'ready';
    
    // Random delay between 1-5 seconds before turning green
    const delay = Math.floor(Math.random() * 4000) + 1000;
    timeoutId = setTimeout(setGo, delay);
}

// Set state to "go" - time to click!
function setGo() {
    reactionBox.textContent = 'CLICK NOW!';
    reactionBox.className = 'go';
    instructions.textContent = 'Click now!';
    state = 'go';
    startTime = Date.now();
}

// Handle click on reaction box
reactionBox.addEventListener('click', function() {
    switch (state) {
        case 'waiting':
            startGame();
            break;
        
        case 'ready':
            // Clicked too soon
            clearTimeout(timeoutId);
            reactionBox.textContent = 'Too soon! Click to try again';
            reactionBox.className = 'clicked';
            instructions.textContent = 'You clicked too early. Try again!';
            state = 'waiting';
            break;
        
        case 'go':
            // Calculate reaction time
            endTime = Date.now();
            const reactionTime = endTime - startTime;
            
            // Update display
            reactionBox.textContent = `${reactionTime} ms - Click to try again`;
            reactionBox.className = 'clicked';
            instructions.textContent = 'Good job! Click to try again.';
            state = 'waiting';
            break;
    }
});

// Initialize the game
init(); 