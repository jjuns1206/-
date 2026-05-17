// 게임 설정
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gameOverScreen = document.getElementById('gameOverScreen');
const scoreValue = document.getElementById('scoreValue');
const finalScore = document.getElementById('finalScore');

// 캔버스 크기 설정
canvas.width = 800;
canvas.height = 400;

// 게임 상태
let gameRunning = true;
let score = 0;

// 플레이어 (아이언맨)
const player = {
    x: 50,
    y: 300,
    width: 40,
    height: 40,
    velocityY: 0,
    jumping: false,
    color: '#FFD700' // 금색
};

// 중력
const gravity = 0.6;
const jumpPower = -12;
const groundY = 300;

// 좀비 배열
let zombies = [];
const zombieSpeed = 4;
const zombieSpawnRate = 0.02; // 프레임마다 좀비 생성 확률

// 키 입력 상태
const keys = {};

// 이벤트 리스너
window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    if (e.key === ' ' || e.key === 'ArrowUp') {
        jump();
        e.preventDefault();
    }
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

canvas.addEventListener('click', jump);
canvas.addEventListener('touchstart', jump);

// 점프 함수
function jump() {
    if (!player.jumping && gameRunning) {
        player.velocityY = jumpPower;
        player.jumping = true;
    }
}

// 좀비 생성
function spawnZombie() {
    if (Math.random() < zombieSpawnRate) {
        zombies.push({
            x: canvas.width,
            y: groundY + 10,
            width: 35,
            height: 35,
            color: '#00AA00' // 초록색
        });
    }
}

// 충돌 감지
function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// 플레이어 그리기
function drawPlayer() {
    // 몸통
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
    
    // 헬멧 (빨간색)
    ctx.fillStyle = '#FF0000';
    ctx.beginPath();
    ctx.arc(player.x + player.width / 2, player.y + 10, 12, 0, Math.PI * 2);
    ctx.fill();
    
    // 눈
    ctx.fillStyle = '#000';
    ctx.fillRect(player.x + 8, player.y + 5, 5, 5);
    ctx.fillRect(player.x + 22, player.y + 5, 5, 5);
}

// 좀비 그리기
function drawZombies() {
    zombies.forEach(zombie => {
        // 몸통
        ctx.fillStyle = zombie.color;
        ctx.fillRect(zombie.x, zombie.y, zombie.width, zombie.height);
        
        // 눈 (흰색)
        ctx.fillStyle = '#FFF';
        ctx.fillRect(zombie.x + 6, zombie.y + 8, 8, 8);
        ctx.fillRect(zombie.x + 20, zombie.y + 8, 8, 8);
        
        // 동공 (검은색)
        ctx.fillStyle = '#000';
        ctx.fillRect(zombie.x + 8, zombie.y + 10, 4, 4);
        ctx.fillRect(zombie.x + 22, zombie.y + 10, 4, 4);
    });
}

// 게임 오버
function gameOver() {
    gameRunning = false;
    gameOverScreen.style.display = 'flex';
    finalScore.textContent = `최종 점수: ${score}`;
}

// 게임 업데이트
function update() {
    if (!gameRunning) return;

    // 플레이어 중력 처리
    player.velocityY += gravity;
    player.y += player.velocityY;

    // 지면 충돌
    if (player.y + player.height >= groundY + 10) {
        player.y = groundY + 10;
        player.velocityY = 0;
        player.jumping = false;
    }

    // 좀비 생성
    spawnZombie();

    // 좀비 업데이트
    for (let i = zombies.length - 1; i >= 0; i--) {
        zombies[i].x -= zombieSpeed;

        // 좀비와 플레이어 충돌 감지
        if (checkCollision(player, zombies[i])) {
            gameOver();
            return;
        }

        // 좀비가 화면 밖으로 나가면 삭제 및 점수 증가
        if (zombies[i].x + zombies[i].width < 0) {
            zombies.splice(i, 1);
            score += 10;
            scoreValue.textContent = score;
        }
    }

    // 점수에 따른 난이도 증가
    zombieSpawnRate = 0.02 + score * 0.0001;
}

// 게임 그리기
function draw() {
    // 배경
    ctx.fillStyle = '#87ceeb';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 지면
    ctx.fillStyle = '#8B7355';
    ctx.fillRect(0, groundY + 10, canvas.width, canvas.height - groundY - 10);

    // 게임 요소 그리기
    drawPlayer();
    drawZombies();
}

// 게임 루프
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// 게임 시작
gameLoop();
