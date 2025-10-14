// js/whack.js v2.0
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const gameGrid = document.querySelector('.game-grid');
    const levelDisplay = document.querySelector('#level');
    const scoreDisplay = document.querySelector('#score');
    const targetScoreDisplay = document.querySelector('#target-score');
    const timeLeftDisplay = document.querySelector('#time-left');
    const startButton = document.querySelector('#start-button');
    const gameOverMessage = document.querySelector('#game-over-message');
    const gameOverTitle = document.querySelector('#game-over-title');
    const gameOverText = document.querySelector('#game-over-text');

    // Game Configuration
    const gridSize = 9;
    const levels = [
        { level: 1, target: 10, duration: 20, speed: 800 }, // Level 1: 10 points in 20s, speed 800ms
        { level: 2, target: 15, duration: 20, speed: 650 }, // Level 2: 15 points in 20s, speed 650ms
        { level: 3, target: 20, duration: 25, speed: 500 }  // Level 3: 20 points in 25s, speed 500ms
    ];

    // Game State
    let currentLevelIndex = 0;
    let score = 0;
    let timeLeft = 0;
    let gameLoopId = null;
    let moleTimerId = null;
    let currentMolePosition = null;
    let isGameRunning = false;
    let levelCheckInterval = null;

    // 1. Create Game Grid
    function createGrid() {
        gameGrid.innerHTML = ''; // Clear previous grid
        for (let i = 0; i < gridSize; i++) {
            const square = document.createElement('div');
            square.classList.add('game-square');
            square.id = i;
            gameGrid.appendChild(square);
            square.addEventListener('mousedown', handleHit);
        }
    }

    // 2. Handle Player Hits
    function handleHit() {
        if (!isGameRunning || this.id != currentMolePosition) return;

        if (this.classList.contains('mole')) {
            score++;
            scoreDisplay.textContent = score;
        } else if (this.classList.contains('bonus')) {
            score -= 2;
            scoreDisplay.textContent = score;
        } else if (this.classList.contains('bomb')) {
            endGame(false, "你点到了炸弹！挑战失败！");
            return;
        } else if (this.classList.contains('clock')) {
            timeLeft += 3; // Add 3 seconds
            timeLeftDisplay.textContent = timeLeft;
        }
        
        clearMole();
    }
    
    function clearMole() {
        const squares = document.querySelectorAll('.game-square');
        if (currentMolePosition !== null && squares[currentMolePosition]) {
            squares[currentMolePosition].className = 'game-square';
        }
        currentMolePosition = null;
    }

    // 3. Randomly Move Moles/Items
    function randomMove() {
        clearMole();
        
        const squares = document.querySelectorAll('.game-square');
        let randomIndex = Math.floor(Math.random() * squares.length);
        let randomSquare = squares[randomIndex];
        
        // Determine item type based on probability
        const rand = Math.random();
        if (rand < 0.65) { // 65% Mole
            randomSquare.classList.add('mole');
        } else if (rand < 0.80) { // 15% Bomb
            randomSquare.classList.add('bomb');
        } else if (rand < 0.90) { // 10% Bonus (Thumbs-up)
            randomSquare.classList.add('bonus');
        } else { // 10% Clock
            randomSquare.classList.add('clock');
        }
        
        currentMolePosition = randomSquare.id;
    }

    // 4. Countdown Timer
    function countDown() {
        timeLeft--;
        timeLeftDisplay.textContent = timeLeft;

        if (timeLeft <= 0) {
            endGame(false, "时间到！未能完成目标。");
        }
    }
    
    // 5. Start a Level
    function startLevel(levelIndex) {
        currentLevelIndex = levelIndex;
        const levelData = levels[currentLevelIndex];
        
        score = 0; // Reset score for the new level
        timeLeft = levelData.duration;
        isGameRunning = true;

        // Update UI
        levelDisplay.textContent = levelData.level;
        scoreDisplay.textContent = score;
        targetScoreDisplay.textContent = levelData.target;
        timeLeftDisplay.textContent = timeLeft;
        gameOverMessage.style.display = 'none';
        startButton.style.display = 'none';

        // Start timers
        gameLoopId = setInterval(countDown, 1000);
        moleTimerId = setInterval(randomMove, levelData.speed);
        
        // Check for level completion
        levelCheckInterval = setInterval(() => {
            if (!isGameRunning) {
                clearInterval(levelCheckInterval);
                return;
            }
            if (score >= levelData.target) {
                if (currentLevelIndex < levels.length - 1) {
                    // Go to next level
                    endLevelTransition(`关卡 ${levelData.level} 通过！准备进入下一关...`);
                    setTimeout(() => startLevel(currentLevelIndex + 1), 2000);
                } else {
                    // Game won
                    endGame(true, `恭喜！你已完成所有挑战，成功晋升为“甩锅之王”！`);
                }
            }
        }, 100);
    }

    // 6. End Game or Level Transition
    function endLevelTransition(message) {
        isGameRunning = false;
        clearInterval(gameLoopId);
        clearInterval(moleTimerId);
        clearInterval(levelCheckInterval);
        clearMole();
        gameOverTitle.textContent = "干得漂亮！";
        gameOverText.textContent = message;
        gameOverMessage.style.display = 'block';
    }

    function endGame(isWin, message) {
        isGameRunning = false;
        clearInterval(gameLoopId);
        clearInterval(moleTimerId);
        clearInterval(levelCheckInterval);
        clearMole();
        
        gameOverTitle.textContent = isWin ? "挑战成功！" : "挑战失败！";
        gameOverText.textContent = message;
        gameOverMessage.style.display = 'block';
        startButton.textContent = "再试一次";
        startButton.style.display = 'block';
    }

    // Initial Setup
    createGrid();
    startButton.addEventListener('click', () => startLevel(0));
});