const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Set canvas dimensions based on screen size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Paddle and ball properties
const paddleWidth = canvas.width / 100;
const paddleHeight = canvas.height / 5;
const ballSize = Math.min(canvas.width, canvas.height) / 50;

// Paddle positions
let leftPaddleY = (canvas.height - paddleHeight) / 2;
let rightPaddleY = (canvas.height - paddleHeight) / 2;

// Paddle speeds
let leftPaddleSpeed = 0;
let rightPaddleSpeed = 0;

// Ball position and speed
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = canvas.width / 100;
let ballSpeedY = canvas.height / 100;

// Score tracking
let leftPlayerScore = 0;
let rightPlayerScore = 0;

// AI opponent
const aiSpeed = canvas.height / 100;

// Game settings
const winningScore = 5;
let showingWinScreen = false;

function drawRect(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function drawCircle(x, y, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    ctx.fill();
}

function drawNet() {
    for (let i = 0; i < canvas.height; i += canvas.height / 20) {
        drawRect(canvas.width / 2 - 1, i, 2, canvas.height / 10, "#fff");
    }
}

function drawText(text, x, y, color, fontSize) {
    ctx.fillStyle = color;
    ctx.font = `bold ${fontSize} 'Press Start 2P', cursive`;
    ctx.fillText(text, x, y);
}

function draw() {
    // Clear the canvas
    drawRect(0, 0, canvas.width, canvas.height, "#000");

    if (showingWinScreen) {
        ctx.fillStyle = "#fff";
        if (leftPlayerScore >= winningScore) {
            drawText("You Win!", canvas.width / 3, canvas.height / 2 - canvas.height / 15, "#fff", canvas.width / 40 + "px");
        } else if (rightPlayerScore >= winningScore) {
            drawText("You Lose!", canvas.width / 3, canvas.height / 2 - canvas.height / 15, "#fff", canvas.width / 40 + "px");
        }
        drawText("Click to Continue", canvas.width / 4, canvas.height / 2 + canvas.height / 30, "#fff", canvas.width / 60 + "px");
        return;
    }

    // Draw the net
    drawNet();

    // Left Paddle
    drawRect(0, leftPaddleY, paddleWidth, paddleHeight, "#fff");

    // Right Paddle
    drawRect(canvas.width - paddleWidth, rightPaddleY, paddleWidth, paddleHeight, "#fff");

    // Ball
    drawCircle(ballX, ballY, ballSize, "#fff");

    // Display the scores
    drawText(leftPlayerScore, canvas.width / 7, canvas.height / 10, "#fff", canvas.width / 20 + "px");
    drawText(rightPlayerScore, (canvas.width * 6) / 7, canvas.height / 10, "#fff", canvas.width / 20 + "px");
}

function move() {
    if (showingWinScreen) {
        return;
    }

    rightPaddleY += (ballY - (rightPaddleY + paddleHeight / 2)) * 0.06;

    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Ball hits right wall
    if (ballX > canvas.width - ballSize) {
        if (ballY > rightPaddleY && ballY < rightPaddleY + paddleHeight) {
            ballSpeedX = -ballSpeedX;

            let deltaY = ballY - (rightPaddleY + paddleHeight / 2);
            ballSpeedY = deltaY * 0.35;
        } else {
            leftPlayerScore++;
            resetBall();
        }
    }

    // Ball hits left wall
    if (ballX < ballSize) {
        if (ballY > leftPaddleY && ballY < leftPaddleY + paddleHeight) {
            ballSpeedX = -ballSpeedX;

            let deltaY = ballY - (leftPaddleY + paddleHeight / 2);
            ballSpeedY = deltaY * 0.35;
        } else {
            rightPlayerScore++;
            resetBall();
        }
    }

    // Ball hits top or bottom wall
    if (ballY > canvas.height - ballSize || ballY < ballSize) {
        ballSpeedY = -ballSpeedY;
    }
}

function resetBall() {
    if (leftPlayerScore >= winningScore || rightPlayerScore >= winningScore) {
        showingWinScreen = true;
        return;
    }

    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = -ballSpeedX;
    ballSpeedY = canvas.height / 100;
}

function handleMouseClick(event) {
    if (showingWinScreen) {
        leftPlayerScore = 0;
        rightPlayerScore = 0;
        showingWinScreen = false;
    }
}

function handleMouseMovement(event) {
    let mouseY = event.clientY - canvas.getBoundingClientRect().top;
    leftPaddleY = mouseY - paddleHeight / 2;
}

function update() {
    move();
    draw();
    requestAnimationFrame(update);
}

canvas.addEventListener("mousemove", handleMouseMovement);
canvas.addEventListener("click", handleMouseClick);

resetBall();
update();
