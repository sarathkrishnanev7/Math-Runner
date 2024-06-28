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
    obstacle.style.right = '0px';
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

    if (obstacleRect.right >= characterRect.left &&
        obstacleRect.left <= characterRect.right &&
        obstacleRect.bottom >= characterRect.top &&
        obstacleRect.top <= characterRect.bottom) {
        
        if (!isNaN(obstacle.innerHTML)) {
            if (isNaN(currentEquation.slice(-1))) {
                currentEquation += obstacle.innerHTML;
            } else {
                gameOver();
                return;
            }
        } else {
            if (!isNaN(currentEquation.slice(-1))) {
                currentEquation += ' ' + obstacle.innerHTML + ' ';
            } else {
                gameOver();
                return;
            }
        }
        evaluateEquation();
        steps++;
        if (steps >= maxSteps) {
            gameOver();
        }
        generateObstacle();
    }
}

function evaluateEquation() {
    try {
        let result = eval(currentEquation);
        if (!isNaN(result)) {
            character.innerHTML = result;
            scoreDisplay.innerHTML = `Score: ${result}`;
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
    let obstaclePosition = parseInt(obstacle.style.right);
    if (obstaclePosition >= 800) {
        obstacle.style.right = '0px';
        generateObstacle();
    } else {
        obstacle.style.right = obstaclePosition + 5 + 'px';
        checkCollision();
    }
}, 100);
