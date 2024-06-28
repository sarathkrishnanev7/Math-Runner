let character = document.getElementById('numberCharacter');
let obstacle = document.getElementById('obstacle');
let scoreDisplay = document.getElementById('score');
let currentEquation = "1";
let targetScore = Math.floor(Math.random() * 100) + 1;
let steps = 0;
let maxSteps = 100;
let jumping = false;

document.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
        jump();
    }
});

function jump() {
    if (!jumping) {
        jumping = true;
        character.classList.add('jump');
        setTimeout(function() {
            character.classList.remove('jump');
            jumping = false;
        }, 300);
    }
}

function generateObstacle() {
    let random = Math.random();
    if (random < 0.5) {
        obstacle.innerHTML = getRandomMathSymbol();
    } else {
        obstacle.innerHTML = getRandomDigit();
    }
    obstacle.style.left = '800px'; // Start the obstacle from the right edge
}

function getRandomMathSymbol() {
    const symbols = ['+', '-', '*', '/'];
    return symbols[Math.floor(Math.random() * symbols.length)];
}

function getRandomDigit() {
    return Math.floor(Math.random() * 10);
}

function checkCollision() {
    let characterRect = character.getBoundingClientRect();
    let obstacleRect = obstacle.getBoundingClientRect();

    if (
        characterRect.right >= obstacleRect.left &&
        characterRect.left <= obstacleRect.right &&
        characterRect.bottom >= obstacleRect.top &&
        characterRect.top <= obstacleRect.bottom
    ) {
        let obstacleContent = obstacle.innerHTML;
        console.log(`Collision detected: ${obstacleContent}`);
        handleCollision(obstacleContent);
    }
}

function handleCollision(obstacleContent) {
    if (!isNaN(obstacleContent)) { // If obstacle is a number
        if (isNaN(currentEquation.slice(-1))) { // If last in equation is a symbol
            currentEquation += obstacleContent;
            evaluateEquation();
        } else { // If last in equation is a number
            gameOver();
            return;
        }
    } else { // If obstacle is a symbol
        if (!isNaN(currentEquation.slice(-1))) { // If last in equation is a number
            currentEquation += ' ' + obstacleContent + ' ';
        } else { // If last in equation is a symbol
            gameOver();
            return;
        }
    }

    steps++;
    if (steps >= maxSteps) {
        gameOver();
    }
    generateObstacle();
}

function evaluateEquation() {
    try {
        let result = eval(currentEquation);
        if (!isNaN(result)) {
            character.innerHTML = result;
            scoreDisplay.innerHTML = `Score: ${result}`;
            currentEquation = result.toString();
        } else {
            gameOver();
        }
    } catch (error) {
        gameOver();
    }
}

function gameOver() {
    alert(`Game Over! Final Score: ${eval(currentEquation)}. Target Score was: ${targetScore}`);
    document.location.reload();
}

generateObstacle();
setInterval(function() {
    let obstaclePosition = parseInt(obstacle.style.left);
    if (obstaclePosition <= 0) {
        obstacle.style.left = '800px';
        generateObstacle();
    } else {
        obstacle.style.left = obstaclePosition - 5 + 'px';
    }
    checkCollision();
}, 50);
