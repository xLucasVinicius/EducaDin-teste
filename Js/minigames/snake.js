const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const score = document.querySelector('.score-value');
const menuScreen = document.querySelector('.menu-screen');
const finalScore = document.querySelector('.final-score span');
const finalCoins = document.querySelector('.final-coins span');
const btnPlay = document.querySelector('.play-again');
const btnMobile = document.querySelector('.btns-movimentar');

const eatAudio = new Audio('../audios/minigames/snake.mp3');
const clickAudio = new Audio('../audios/minigames/click.mp3');
const gameOverAudio = new Audio('../audios/minigames/game-over.mp3');

const size = 30;
const inicialPosition = { x: 270, y: 240 };
let snake = [inicialPosition];
let direction = undefined;
let directionQueue = [];
let lastFrameTime = 0;
const moveInterval = 180;


const incrementScore = () => {
    score.textContent = parseInt(score.textContent) + 10;
};

const randomNumber = (min, max) => {
    return Math.round(Math.random() * (max - min) + min);
};

const randomPosition = () => {
    const number = randomNumber(0, canvas.width - size);
    return number - (number % size);
};

const food = {
    x: randomPosition(),
    y: randomPosition(),
    color: "#f2a900"
};

const drawFood = () => {
    const { x, y } = food;
    const radius = size / 2;
    const centerX = x + radius;
    const centerY = y + radius;

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = "#FFD700";
    ctx.shadowColor = "#fff";
    ctx.shadowBlur = 5;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.closePath();

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.8, 0, Math.PI * 2);
    ctx.fillStyle = "#FFFACD";
    ctx.fill();
    ctx.closePath();

    ctx.fillStyle = "#228B22";
    ctx.font = `${radius}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("💲", centerX, centerY);
};

const drawSnake = () => {
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, "#ffe259");
    gradient.addColorStop(1, "#ffa751");

    snake.forEach((position, index) => {
        const isHead = index === snake.length - 1;
        const radius = 6;
        const x = position.x;
        const y = position.y;

        ctx.beginPath();
        ctx.fillStyle = isHead ? "#FFD700" : gradient;
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + size - radius, y);
        ctx.quadraticCurveTo(x + size, y, x + size, y + radius);
        ctx.lineTo(x + size, y + size - radius);
        ctx.quadraticCurveTo(x + size, y + size, x + size - radius, y + size);
        ctx.lineTo(x + radius, y + size);
        ctx.quadraticCurveTo(x, y + size, x, y + size - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.fill();
        ctx.closePath();

        if (isHead) {
            ctx.fillStyle = "#000";
            ctx.beginPath();
            ctx.arc(x + size * 0.3, y + size * 0.3, 2, 0, 2 * Math.PI);
            ctx.arc(x + size * 0.7, y + size * 0.3, 2, 0, 2 * Math.PI);
            ctx.fill();
        }
    });
};

const moveSnake = () => {
    if (directionQueue.length) {
        const next = directionQueue.shift();
        const opposite = {
            "up": "down",
            "down": "up",
            "left": "right",
            "right": "left"
        };
        if (!direction || direction !== opposite[next]) {
            direction = next;
        }
    }

    if (!direction) return;

    const head = snake[snake.length - 1];
    let newHead;

    switch (direction) {
        case "right": newHead = { x: head.x + size, y: head.y }; break;
        case "left": newHead = { x: head.x - size, y: head.y }; break;
        case "up": newHead = { x: head.x, y: head.y - size }; break;
        case "down": newHead = { x: head.x, y: head.y + size }; break;
    }

    snake.push(newHead);
    snake.shift();
};

const drawGrid = () => {
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#191919";
    for (let i = 0; i < canvas.width; i += size) {
        for (let j = 0; j < canvas.height; j += size) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, canvas.height);
            ctx.moveTo(0, j);
            ctx.lineTo(canvas.width, j);
            ctx.stroke();
        }
    }
};

const checkEat = () => {
    const head = snake[snake.length - 1];
    if (head.x === food.x && head.y === food.y) {
        incrementScore();
        snake.push({ x: head.x, y: head.y });

        eatAudio.currentTime = 0; // Garante que o som reinicia
        eatAudio.play();

        let x = randomPosition();
        let y = randomPosition();
        while (snake.some(pos => pos.x === x && pos.y === y)) {
            x = randomPosition();
            y = randomPosition();
        }

        food.x = x;
        food.y = y;
    }
};

const checkCollision = () => {
    const head = snake[snake.length - 1];
    const neckIndex = snake.length - 2;

    const hitWall = head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height;
    const hitSelf = snake.find((pos, index) => index < neckIndex && pos.x === head.x && pos.y === head.y);

    if (hitWall || hitSelf) {
        gameOver();
    }
};

const gameOver = () => {
    gameOverAudio.currentTime = 0;
    gameOverAudio.play();

    direction = undefined;
    directionQueue = [];
    snake = [inicialPosition];
    menuScreen.style.display = "flex";
    finalScore.textContent = score.textContent;
    finalCoins.textContent = score.textContent / 10;

    const miniGame = document.getElementById('minigame');
    const idMinigame = miniGame.dataset;

    fetch('../Paginas/configs/salvar-pontos.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            pontuacao: score.textContent,
            id_minigame: idMinigame.idMg,
            moedas_ganhas: score.textContent / 10
        })
    })
        .then(response => response.json())
        .catch(error => console.error('Erro:', error));
};

const gameLoop = (timestamp = 0) => {
    const deltaTime = timestamp - lastFrameTime;

    if (deltaTime > moveInterval) {
        lastFrameTime = timestamp;
        moveSnake();
        checkEat();
        checkCollision();
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    drawFood();
    drawSnake();

    requestAnimationFrame(gameLoop);
};

gameLoop();

// ... (demais códigos acima continuam iguais)

document.addEventListener('keydown', ({ key }) => {
    const allowed = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
    if (!allowed.includes(key)) return;

    const isMenuVisible = window.getComputedStyle(menuScreen).display !== "none";
    if (isMenuVisible) return;

    const map = {
        "ArrowRight": "right",
        "ArrowLeft": "left",
        "ArrowUp": "up",
        "ArrowDown": "down"
    };

    const next = map[key];

    const opposite = {
        "up": "down",
        "down": "up",
        "left": "right",
        "right": "left"
    };

    const lastQueued = directionQueue.length > 0 ? directionQueue[directionQueue.length - 1] : direction;

    if (next !== opposite[lastQueued] && directionQueue.length < 2) {
        directionQueue.push(next);

        clickAudio.currentTime = 0; // toca ao mudar de direção
        clickAudio.play();
    }
});

btnPlay.addEventListener("click", () => {
    menuScreen.style.display = "none";
    score.textContent = "00";
});

// Botões de direção na tela (mobile)
["up", "down", "left", "right"].forEach(dir => {
    document.getElementById(dir).addEventListener("click", () => {
        const isMenuVisible = window.getComputedStyle(menuScreen).display !== "none";
        if (isMenuVisible) return;

        const opposite = {
            "up": "down",
            "down": "up",
            "left": "right",
            "right": "left"
        };

        const lastQueued = directionQueue.length > 0 ? directionQueue[directionQueue.length - 1] : direction;

        if (dir !== opposite[lastQueued] && directionQueue.length < 2) {
            directionQueue.push(dir);
            clickAudio.currentTime = 0;
            clickAudio.play();
        }
    });
});

function exibirBotoes() {
    if (!btnMobile) return;

    if (window.innerWidth < 1200) {
        btnMobile.style.display = 'flex';
    } else {
        btnMobile.style.display = 'none';
    }
}


exibirBotoes();

window.addEventListener('resize', exibirBotoes);
window.addEventListener('DOMContentLoaded', exibirBotoes);
