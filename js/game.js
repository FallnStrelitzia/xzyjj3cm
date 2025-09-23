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

    // 游戏对象
    const paddle = {
        x: canvas.width / 2 - 50,
        y: canvas.height - 20,
        width: 100,
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
                        checkWin();
                    }
                }
            }
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
        ball.dx = 4 * (Math.random() > 0.5 ? 1 : -1);
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
        movePaddle();
        moveBall();
        collisionDetection();
        requestAnimationFrame(update);
    }

    function keyDown(e) {
        if (e.key === 'Right' || e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') paddle.dx = 8;
        else if (e.key === 'Left' || e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') paddle.dx = -8;
    }

    function keyUp(e) {
        if (['right', 'arrowright', 'd', 'left', 'arrowleft', 'a'].includes(e.key.toLowerCase())) paddle.dx = 0;
    }
    
    restartButton.addEventListener('click', (e) => {
        e.preventDefault();
        document.location.reload();
    });

    document.addEventListener('keydown', keyDown);
    document.addEventListener('keyup', keyUp);

    update();
});