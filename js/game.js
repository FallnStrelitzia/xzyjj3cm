// js/game.js - “3cm守护者”的核心逻辑

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    const scoreEl = document.getElementById('score');
    const livesEl = document.getElementById('lives');

    // 弹窗元素
    const modal = document.getElementById('game-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');
    const restartButton = document.getElementById('restart-button');

    // 从CSS变量中获取颜色
    const style = getComputedStyle(document.documentElement);
    const textColor = style.getPropertyValue('--text-color').trim();
    const highlightColor = style.getPropertyValue('--highlight-color').trim();
    const borderColor = style.getPropertyValue('--border-color').trim();
    const warningColor = style.getPropertyValue('--warning-color').trim();

    let score = 0;
    let lives = 3;
    let gameRunning = true;
    const originalPaddleWidth = 100;
    let keyboardMalfunction = false;
    let malfunctionMessage = '';
    let easterEggMessage = '';

    // 游戏对象
    const paddle = {
        x: canvas.width / 2 - 50,
        y: canvas.height - 20,
        width: originalPaddleWidth,
        height: 15,
        dx: 0
    };

    const ball = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        radius: 8,
        speed: 4,
        dx: 4,
        dy: -4
    };

    // 砖块属性
    const brickInfo = {
        rowCount: 5,
        columnCount: 9,
        width: 75,
        height: 20,
        padding: 10,
        offsetTop: 40,
        offsetLeft: 30
    };

    let bricks = [];
    let powerUps = [];

    function createBricks() {
        bricks = [];
        for (let c = 0; c < brickInfo.columnCount; c++) {
            bricks[c] = [];
            for (let r = 0; r < brickInfo.rowCount; r++) {
                bricks[c][r] = { x: 0, y: 0, status: 1 };
            }
        }
    }
    createBricks();

    function createPowerUp(x, y) {
        if (Math.random() < 0.2) {
            powerUps.push({ x, y, width: 20, height: 20, dy: 2, type: 'wallet' });
        }
    }

    function applyPowerUp(powerUp) {
        if (powerUp.type === 'wallet') {
            if (Math.random() < 0.5) {
                paddle.width = originalPaddleWidth * 1.5;
                setTimeout(() => paddle.width = originalPaddleWidth, 5000);
            } else {
                paddle.width = originalPaddleWidth * 0.5;
                setTimeout(() => paddle.width = originalPaddleWidth, 5000);
            }
        }
    }

    function triggerKeyboardMalfunction() {
        if (Math.random() < 0.0005 && !keyboardMalfunction) {
            keyboardMalfunction = true;
            malfunctionMessage = '设备问题!';
            setTimeout(() => {
                keyboardMalfunction = false;
                malfunctionMessage = '';
            }, 2000);
        }
    }

    function drawMalfunctionMessage() {
        if (malfunctionMessage) {
            ctx.font = '20px "Press Start 2P"';
            ctx.fillStyle = warningColor;
            ctx.textAlign = 'center';
            ctx.fillText(malfunctionMessage, canvas.width / 2, canvas.height / 2 - 50);
        }
    }

    function drawEasterEggMessage() {
        if (easterEggMessage) {
            ctx.font = '24px "Press Start 2P"';
            ctx.fillStyle = highlightColor;
            ctx.textAlign = 'center';
            ctx.fillText(easterEggMessage, canvas.width / 2, canvas.height / 2);
        }
    }

    function drawPaddle() {
        ctx.beginPath();
        ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
        ctx.fillStyle = highlightColor;
        ctx.fill();
        ctx.closePath();
    }

    function drawBall() {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = borderColor;
        ctx.fill();
        ctx.closePath();
        
        ctx.font = 'bold 8px "Press Start 2P", cursive';
        ctx.fillStyle = '#000';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('3cm', ball.x, ball.y);
    }

    function drawBricks() {
        for (let c = 0; c < brickInfo.columnCount; c++) {
            for (let r = 0; r < brickInfo.rowCount; r++) {
                if (bricks[c][r].status === 1) {
                    const brickX = c * (brickInfo.width + brickInfo.padding) + brickInfo.offsetLeft;
                    const brickY = r * (brickInfo.height + brickInfo.padding) + brickInfo.offsetTop;
                    bricks[c][r].x = brickX;
                    bricks[c][r].y = brickY;
                    ctx.beginPath();
                    ctx.rect(brickX, brickY, brickInfo.width, brickInfo.height);
                    ctx.fillStyle = textColor;
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    }

    function drawPowerUps() {
        powerUps.forEach(p => {
            ctx.font = '15px "Press Start 2P"';
            ctx.fillText('💰', p.x, p.y);
        });
    }

    function movePaddle() {
        paddle.x += paddle.dx;
        if (paddle.x < 0) paddle.x = 0;
        if (paddle.x + paddle.width > canvas.width) paddle.x = canvas.width - paddle.width;
    }
    
    function moveBall() {
        ball.x += ball.dx;
        ball.y += ball.dy;

        if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) ball.dx *= -1;
        if (ball.y - ball.radius < 0) ball.dy *= -1;

        if (ball.y + ball.radius > canvas.height) {
            lives--;
            livesEl.textContent = lives;
            if (lives === 0) {
                showModal('任务失败', '核心科技已丢失！');
            } else {
                resetBall();
            }
        }

        if (ball.x > paddle.x && ball.x < paddle.x + paddle.width && ball.y + ball.radius > paddle.y) {
            ball.dy = -ball.speed;
        }
    }

    function movePowerUps() {
        powerUps.forEach((p, index) => {
            p.y += p.dy;
            if (p.x < paddle.x + paddle.width && p.x + p.width > paddle.x && p.y < paddle.y + paddle.height && p.y + p.height > paddle.y) {
                applyPowerUp(p);
                powerUps.splice(index, 1);
            }
            if (p.y > canvas.height) {
                powerUps.splice(index, 1);
            }
        });
    }

    function collisionDetection() {
        for (let c = 0; c < brickInfo.columnCount; c++) {
            for (let r = 0; r < brickInfo.rowCount; r++) {
                const b = bricks[c][r];
                if (b.status === 1) {
                    if (ball.x > b.x && ball.x < b.x + brickInfo.width && ball.y > b.y && ball.y < b.y + brickInfo.height) {
                        ball.dy *= -1;
                        b.status = 0;
                        score += 10;
                        scoreEl.textContent = score;
                        createPowerUp(b.x, b.y);
                        checkEasterEggs();
                        checkWin();
                    }
                }
            }
        }
    }

    function checkEasterEggs() {
        const bricksLeft = bricks.flat().filter(b => b.status === 1).length;
        if (bricksLeft === 10 || bricksLeft === 1) {
            easterEggMessage = '0 / 10 / 1';
            setTimeout(() => easterEggMessage = '', 1500);
        }
    }
    
    function checkWin() {
        const bricksLeft = bricks.flat().filter(b => b.status === 1).length;
        if (bricksLeft === 0) {
            showModal('任务成功', `恭喜你！成功守护了核心科技！最终得分: ${score}`);
        }
    }

    function resetBall() {
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        // 使用时间戳来生成更多变的初始角度
        const timestamp = Date.now();
        let randomX = ((timestamp % 100) / 100) * 8 - 4; // 生成 -4 到 4 之间的值
        if (Math.abs(randomX) < 1) { // 避免过于垂直的角度
            randomX = randomX > 0 ? 1 : -1;
        }
        ball.dx = randomX;
        ball.dy = -4;
    }

    function showModal(title, message) {
        gameRunning = false;
        modalTitle.textContent = title;
        modalMessage.textContent = message;
        modal.style.display = 'block';
    }

    function update() {
        if (!gameRunning) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBricks();
        drawBall();
        drawPaddle();
        drawPowerUps();
        drawMalfunctionMessage();
        drawEasterEggMessage();
        
        triggerKeyboardMalfunction();

        movePaddle();
        moveBall();
        movePowerUps();
        collisionDetection();
        requestAnimationFrame(update);
    }

    function keyDown(e) {
        const rightPressed = e.key === 'Right' || e.key === 'ArrowRight' || e.key.toLowerCase() === 'd';
        const leftPressed = e.key === 'Left' || e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a';

        if (keyboardMalfunction) {
            if (rightPressed) paddle.dx = -8;
            else if (leftPressed) paddle.dx = 8;
        } else {
            if (rightPressed) paddle.dx = 8;
            else if (leftPressed) paddle.dx = -8;
        }
    }

    function keyUp(e) {
        if (['right', 'arrowright', 'd', 'left', 'arrowleft', 'a'].includes(e.key.toLowerCase())) {
            paddle.dx = 0;
        }
    }
    
    restartButton.addEventListener('click', (e) => {
        e.preventDefault();
        document.location.reload();
    });

    document.addEventListener('keydown', keyDown);
    document.addEventListener('keyup', keyUp);

    update();
});