// Get canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// variables
let score = 0;
let gameOver = false;
let animationFrameId;
let startTime;
let gameTime = 0;

// Player circle
const player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 20,
    color: '#3498db',
    speed: 0.2, 
};

//array
const enemies = [];

// Mouse position
const mouse = {
    x: canvas.width / 2,
    y: canvas.height / 2
};

function getRandomColor() {
    const colors = ['#e74c3c', '#9b59b6', '#2ecc71', '#f1c40f', '#1abc9c', '#e67e22'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// random number within a range
function randomRange(min, max) {
    return Math.random() * (max - min) + min;
}

// new enemy circle
function createEnemy() {
    const radius = randomRange(15, player.radius * 2);
    const speed = randomRange(1, 3);
    
    // spawn position
    let x, y;
    if (Math.random() > 0.5) {
        // Spawn on left or right side
        x = Math.random() > 0.5 ? -radius : canvas.width + radius;
        y = Math.random() * canvas.height;
    } else {
        // Spawn on top or bottom
        x = Math.random() * canvas.width;
        y = Math.random() > 0.5 ? -radius : canvas.height + radius;
    }
    
    // Calculate direction toward canvas center with slight randomization
    const targetX = canvas.width / 2 + randomRange(-canvas.width/4, canvas.width/4);
    const targetY = canvas.height / 2 + randomRange(-canvas.height/4, canvas.height/4);
    
    const dx = targetX - x;
    const dy = targetY - y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    const velocityX = (dx / distance) * speed;
    const velocityY = (dy / distance) * speed;
    
    enemies.push({
        x: x,
        y: y,
        radius: radius,
        color: getRandomColor(),
        speedX: velocityX,
        speedY: velocityY
    });
}

// Update score display
function updateScore() {
    const currentTime = Date.now();
    gameTime = (currentTime - startTime) / 1000; // Convert to seconds
    document.getElementById('score').textContent = Math.floor(gameTime);
}

// Check collision between two circles
function checkCollision(circle1, circle2) {
    const dx = circle1.x - circle2.x;
    const dy = circle1.y - circle2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    return distance < circle1.radius + circle2.radius;
}

// Draw a circle
function drawCircle(x, y, radius, color) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

// Mouse move event listener
canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;
});

// Game loop
function gameLoop() {
    if (gameOver) return;
    
    // Update score based on time survived
    updateScore();
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Move player towards mouse with easing
    player.x += (mouse.x - player.x) * player.speed;
    player.y += (mouse.y - player.y) * player.speed;
    
    // Draw player
    drawCircle(player.x, player.y, player.radius, player.color);
    
    // Add targeting visual indicator
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius + 5, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();
    
    // Spawn enemies more frequently as time goes on
    const spawnChance = 0.005 + (gameTime / 1000); 
    if (Math.random() < spawnChance) {
        createEnemy();
    }
    
    // Process enemies
    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];
        
        // Move enemy
        enemy.x += enemy.speedX;
        enemy.y += enemy.speedY;
        
        // Draw enemy
        drawCircle(enemy.x, enemy.y, enemy.radius, enemy.color);
        
        // Check if off screen
        if (
            enemy.x < -50 || 
            enemy.x > canvas.width + 50 || 
            enemy.y < -50 || 
            enemy.y > canvas.height + 50
        ) {
            enemies.splice(i, 1);
            continue;
        }
        
        // check collision with player
        if (checkCollision(player, enemy)) {
            // game over when colliding with any enmy
            endGame();
            return;
        }
    }
    
    // request next animation frame
    animationFrameId = requestAnimationFrame(gameLoop);
}

// show game over screen
function endGame() {
    gameOver = true;
    document.getElementById('final-score').textContent = Math.floor(gameTime);
    document.getElementById('game-over').classList.remove('hidden');
}

// restart game
function restartGame() {
    // reset game variables
    gameOver = false;
    startTime = Date.now();
    gameTime = 0;
    player.x = canvas.width / 2;
    player.y = canvas.height / 2;
    enemies.length = 0;
    
    // Update scre display
    updateScore();
    
    // Hide game over screen
    document.getElementById('game-over').classList.add('hidden');
    
    // Start game loop
    gameLoop();
}

// Restart button event listener
document.getElementById('restart-button').addEventListener('click', restartGame);

// Initialize game
startTime = Date.now();
gameLoop(); 