// js/flappy.js v2.0 - Super Ascension Mode
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');

    const startScreen = document.getElementById('start-screen');
    const gameOverScreen = document.getElementById('game-over-screen');
    const startButton = document.getElementById('start-button');
    const restartButton = document.getElementById('restart-button');
    const finalScoreDisplay = document.getElementById('final-score');
    const highScoreDisplay = document.getElementById('high-score');
    const gameOverTitle = document.getElementById('game-over-title');
    const gameOverText = document.getElementById('game-over-text');

    // Game Configuration
    const levels = [
        { level: 1, target: 15, speed: 3, pipeMove: 0 },
        { level: 2, target: 20, speed: 3.5, pipeMove: 0.5 },
        { level: 3, target: 25, speed: 4, pipeMove: 1 }
    ];

    // Game State
    let bird, pipes, items, burdens, score, highScore, gameInterval, currentLevelIndex;
    let isGameOver = true;
    let frameCount = 0;

    const birdProps = {
        x: 80, y: canvas.height / 2, radius: 15, velocity: 0, gravity: 0.5, jump: -9, shrinkTimer: 0
    };
    const pipeProps = { width: 60, gap: 180, interval: 90 };
    const itemProps = { radius: 10 };
    const burdenProps = { width: 30, height: 30, speed: 5 };

    function resetGame() {
        bird = { ...birdProps };
        pipes = [];
        items = [];
        burdens = [];
        score = 0;
        currentLevelIndex = 0;
        highScore = localStorage.getItem('flappyCoreHighScoreV2') || 0;
        isGameOver = false;
        frameCount = 0;
        
        startScreen.style.display = 'none';
        gameOverScreen.style.display = 'none';
        canvas.style.display = 'block';

        document.addEventListener('keydown', handleInput);
        canvas.addEventListener('mousedown', handleInput);

        gameInterval = setInterval(gameLoop, 1000 / 60);
    }

    function handleInput(e) {
        if (isGameOver) return;
        if (e.code === 'Space' || e.type === 'mousedown') {
            bird.velocity = birdProps.jump;
        }
    }

    function gameLoop() {
        if (isGameOver) return;
        update();
        draw();
    }

    function update() {
        frameCount++;
        const level = levels[currentLevelIndex];

        // Bird physics
        bird.velocity += bird.gravity;
        bird.y += bird.velocity;
        if (bird.shrinkTimer > 0) bird.shrinkTimer--;
        bird.radius = bird.shrinkTimer > 0 ? birdProps.radius * 0.6 : birdProps.radius;

        // Pipe management
        if (frameCount % pipeProps.interval === 0) {
            let topHeight = Math.random() * (canvas.height - pipeProps.gap - 150) + 75;
            pipes.push({ x: canvas.width, topHeight: topHeight, scored: false, moveDir: 1 });
            
            // Spawn items or burdens
            if (Math.random() < 0.2) { // 20% chance to spawn an item
                items.push({ x: canvas.width + pipeProps.width / 2, y: topHeight + pipeProps.gap / 2 });
            }
            if (currentLevelIndex > 0 && Math.random() < 0.15) { // 15% chance for burden from level 2
                burdens.push({ x: canvas.width, y: Math.random() * canvas.height });
            }
        }

        pipes.forEach(pipe => {
            pipe.x -= level.speed;
            if (level.pipeMove > 0) {
                pipe.topHeight += pipe.moveDir * level.pipeMove;
                if (pipe.topHeight < 50 || pipe.topHeight > canvas.height - pipeProps.gap - 50) {
                    pipe.moveDir *= -1;
                }
            }
        });
        items.forEach(item => item.x -= level.speed);
        burdens.forEach(burden => burden.x -= burdenProps.speed);

        pipes = pipes.filter(p => p.x + pipeProps.width > 0);
        items = items.filter(i => i.x + itemProps.radius > 0);
        burdens = burdens.filter(b => b.x + burdenProps.width > 0);

        checkCollisions();

        // Score & Level Up
        const currentPipe = pipes.find(p => !p.scored && p.x + pipeProps.width < bird.x);
        if (currentPipe) {
            score++;
            currentPipe.scored = true;
            if (score >= level.target) {
                if (currentLevelIndex < levels.length - 1) {
                    currentLevelIndex++;
                    score = 0; // Reset score for next level
                } else {
                    endGame(true, "飞升成功！你已超凡入圣！");
                }
            }
        }
    }

    function checkCollisions() {
        if (bird.y + bird.radius > canvas.height || bird.y - bird.radius < 0) {
            endGame(false, "核心坠落，挑战失败。");
            return;
        }

        for (let pipe of pipes) {
            if (bird.x + bird.radius > pipe.x && bird.x - bird.radius < pipe.x + pipeProps.width &&
                (bird.y - bird.radius < pipe.topHeight || bird.y + bird.radius > pipe.topHeight + pipeProps.gap)) {
                endGame(false, "撞上世俗的烦恼，挑战失败。");
                return;
            }
        }
        
        for (let item of items) {
            const dist = Math.hypot(bird.x - item.x, bird.y - item.y);
            if (dist < bird.radius + itemProps.radius) {
                bird.shrinkTimer = 300; // 5 seconds shrink
                items = items.filter(i => i !== item);
            }
        }

        for (let burden of burdens) {
            if (bird.x < burden.x + burdenProps.width && bird.x + bird.radius > burden.x &&
                bird.y < burden.y + burdenProps.height && bird.y + bird.radius > burden.y) {
                endGame(false, "被责任的重担压垮，挑战失败。");
                return;
            }
        }
    }

    function endGame(isWin, message) {
        if (isGameOver) return; // Prevent multiple calls
        isGameOver = true;
        clearInterval(gameInterval);
        document.removeEventListener('keydown', handleInput);
        canvas.removeEventListener('mousedown', handleInput);

        let totalScore = 0;
        for(let i=0; i<currentLevelIndex; i++) totalScore += levels[i].target;
        totalScore += score;

        if (totalScore > highScore) {
            highScore = totalScore;
            localStorage.setItem('flappyCoreHighScoreV2', highScore);
        }

        gameOverTitle.textContent = isWin ? "挑战成功！" : "挑战失败！";
        gameOverText.textContent = message;
        finalScoreDisplay.textContent = totalScore;
        highScoreDisplay.textContent = highScore;
        gameOverScreen.style.display = 'block';
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw Bird
        ctx.beginPath();
        ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
        ctx.fillStyle = bird.shrinkTimer > 0 ? 'var(--border-color)' : 'var(--highlight-color)';
        ctx.fill();
        ctx.closePath();

        // Draw Pipes
        pipes.forEach(pipe => {
            ctx.fillStyle = 'var(--text-color)';
            ctx.fillRect(pipe.x, 0, pipeProps.width, pipe.topHeight);
            ctx.fillRect(pipe.x, pipe.topHeight + pipeProps.gap, pipeProps.width, canvas.height - pipe.topHeight - pipeProps.gap);
        });

        // Draw Items
        items.forEach(item => {
            ctx.beginPath();
            ctx.arc(item.x, item.y, itemProps.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'var(--border-color)'; // Blue shrink item
            ctx.fill();
            ctx.closePath();
        });

        // Draw Burdens
        burdens.forEach(burden => {
            ctx.fillStyle = 'var(--warning-color)'; // Red burden
            ctx.fillRect(burden.x, burden.y, burdenProps.width, burdenProps.height);
        });

        // Draw Score & Level
        if (!isGameOver) {
            ctx.fillStyle = '#fff';
            ctx.font = "20px 'Press Start 2P'";
            ctx.textAlign = 'left';
            ctx.fillText(`关卡: ${levels[currentLevelIndex].level}`, 10, 30);
            ctx.fillText(`得分: ${score}/${levels[currentLevelIndex].target}`, 10, 60);
        }
    }

    startButton.addEventListener('click', resetGame);
    restartButton.addEventListener('click', resetGame);
});