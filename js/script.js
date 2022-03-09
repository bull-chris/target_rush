//canvas settings
let gameCanvas = document.getElementById("gameCanvas");
gameCanvas.width = window.innerWidth;
gameCanvas.height = window.innerHeight - 350;
let canvasState = gameCanvas.getContext("2d");

//page elements
let homePage = document.getElementById("homeScreen");
let instructionsPage = document.getElementById("instructionScreen");
let gamePage = document.getElementById("gameScreen");
let scorePage = document.getElementById("endScreen");

//score elements
let score = document.getElementById("theScore");
let finalScore = document.getElementById("finalScore");

//mouse coordinate variables
let holdX;
let holdY;

//click coordinate variables
let clickX;
let clickY;

//boolean to track if ball has been shot
let shootBall = false;

//score and timer variables
let totalScore = 0000;
let timeLeft = 5;

//random positions for the target
let targetRandX = Math.random() * (window.innerWidth * 0.8) + 20;
let targetRandY = Math.random() * (window.innerHeight * 0.25) + 20;

//playButton element and event listener
let playButton = document.getElementById("startButton");
playButton.addEventListener("click", () => {
    homePage.style.display = "none";
    instructionsPage.style.display = "none";
    gamePage.style.display = "block";
    restartGame();
})

//instructionButton element and event listener
let instructionButton = document.getElementById("instructionsButton");
instructionButton.addEventListener("click", () => {
    homePage.style.display = "none";
    instructionsPage.style.display = "block";
})

//returnButton element and event listener
let returnButton = document.getElementById("returnButton");
returnButton.addEventListener("click", () => {
    instructionsPage.style.display = "none";
    homePage.style.display = "block";
})

//retryButton element and event listener
let retryButton = document.getElementById("retryButton");
retryButton.addEventListener("click", () => {
    scorePage.style.display = "none";
    restartGame();
})

//Reference for getting touch positions - https://stackoverflow.com/questions/41993176/determine-touch-position-on-tablets-with-javascript/61732450#61732450

//touch move event listener for the game canvas
gameCanvas.addEventListener("touchmove", (gameAction) => {
    //get the canvas bounds
    let canvasSize = gameCanvas.getBoundingClientRect();
    //get the touch actions of the gameAction
    let tapEvent = gameAction.touches[0];
    //update the mouse position to rotate the aim line
    holdX = tapEvent.pageX - canvasSize.left - scrollX;
    holdY = tapEvent.pageY - canvasSize.top - scrollY;
})

//touch end event listener for the game canvas
gameCanvas.addEventListener("touchend", (gameAction) => {
    //get the canvas bounds
    let canvasSize = gameCanvas.getBoundingClientRect();
    //get the touch actions of the gameAction
    let tapEvent = gameAction.touches[0] || gameAction.changedTouches[0];
    //if the ball has not been shot
    if (shootBall === false) {
        //update the click position to determine the direction the player will move
        clickX = player.posX - (tapEvent.pageX - canvasSize.left - scrollX);
        clickY = player.posY - (tapEvent.pageY - canvasSize.top - scrollY);
    }
    //set shootball to true
    shootBall = true;
})

//player object
let player = {
    //initial variables
    posX: window.innerWidth / 2,
    posY: window.innerHeight - 400,
    moveSpeed: 5,

    //addToCanvas function to display the player
    addToCanvas: function() {
        canvasState.beginPath();
        canvasState.strokeStyle = '#000';
        canvasState.arc(this.posX, this.posY, 10, 0, 360);
        canvasState.closePath();
        canvasState.stroke();
    },
    //resetShot function to reset the player when they go out of bounds
    resetShot: function() {
        if (this.posX > window.innerWidth || this.posX < 0 || this.posY < 0) {
            shootBall = false;
            this.posX = window.innerWidth / 2;
            this.posY = window.innerHeight - 400;
        }
    },
}

//function to update the score
function updateScore() {
    //increment the score and update the innerHTML of the page
    totalScore += 100;
    score.innerHTML = totalScore;
}

function checkForHit(playerX, playerY, targetX, targetY) {
    if (playerX <= targetX + 20 && playerX >= targetX - 20) {
        if (playerY <= targetY + 20 && playerY >= targetY - 20) {
            shootBall = false;
            player.posX = window.innerWidth / 2;
            player.posY = window.innerHeight - 400;

            //generate new target position
            targetRandX = Math.random() * (window.innerWidth * 0.8) + 20;
            targetRandY = Math.random() * (window.innerHeight * 0.25) + 20;

            updateScore();
        }
    }
}

//function to draw the game and the aim line
function game_aim(startX, startY, rotation) {
    //draw the platform for the player
    canvasState.fillStyle = '#000';
    canvasState.fillRect((window.innerWidth / 2) - 50, window.innerHeight - 390, 100, 25);

    //drow the target
    canvasState.beginPath();
    canvasState.strokeStyle = '#501239';
    canvasState.arc(targetRandX, targetRandY, 20, 0, 360);
    canvasState.fillStyle = '#501239';
    canvasState.fill();
    canvasState.closePath();
    canvasState.beginPath();
    canvasState.arc(targetRandX, targetRandY, 10, 0, 360);
    canvasState.fillStyle = '#fff';
    canvasState.fill();
    canvasState.closePath();
    canvasState.beginPath();
    canvasState.arc(targetRandX, targetRandY, 5, 0, 360);
    canvasState.fillStyle = '#501239';
    canvasState.fill();
    canvasState.closePath();
    canvasState.stroke();
    
    //draw the player
    player.addToCanvas();

    //add the velocity to the player if the ball is shot
    if (shootBall)
    {
        player.posX += (-clickX / 100) * player.moveSpeed;
        player.posY += (-clickY / 100) * player.moveSpeed;
    }
    else {
        //draw the aim line if ball hasn't been shot
        canvasState.setTransform(1,0,0,1, startX, startY);
        canvasState.rotate(rotation);
        canvasState.beginPath();
        canvasState.lineWidth = 5;
        canvasState.moveTo(0, 0);
        canvasState.lineTo(0, -102);
        canvasState.moveTo(0, -100);
        canvasState.lineTo(25, -75);
        canvasState.moveTo(0, -100);
        canvasState.lineTo(-25, -75);
        canvasState.strokeStyle = '#501239';
        canvasState.stroke();
    }

    //check if the player hit the target
    checkForHit(player.posX, player.posY, targetRandX, targetRandY);

    //reset the player ball
    player.resetShot();
}

//function to show the end results screen
function showEndScreen() {
    scorePage.style.display = "block";
    scorePage.style.animation = "loadIn 1s";
    finalScore.innerHTML = totalScore;
}

//Reference for rotation for and clearing of the aim line - https://stackoverflow.com/questions/47278740/how-to-rotate-a-canvas-by-following-mouse-if-the-canvas-already-has-something-dr#:~:text=You%20need%20to%20create%20a,set%20the%20transform%20with%20ctx.

//function to clear the canvas every frame
function gameTimer(gameFrame) {
    canvasState.setTransform(1, 0, 0, 1, 0, 0);
    canvasState.clearRect(0, 0, window.innerWidth, window.innerHeight);

    //get the offset posiiton of the mouse to handle the rotation of the aim line
    let rotation = Math.atan2(holdY - (window.innerHeight - 410), holdX - (window.innerWidth / 2));

    //call the game_aim function
    game_aim(window.innerWidth / 2, window.innerHeight - 410, rotation - 300);
    //request the animation frame
    requestAnimationFrame(gameTimer);
}

//request the inital animation frame for gameTimer
requestAnimationFrame(gameTimer);

//get theTime element from the HTML document
let time = document.getElementById("theTime");

//function to restart the game
function restartGame() {
    //set the inital values for the time and score
    timeLeft = 60;
    totalScore = 000;

    //set an interval to countdown once every second
    let restartTimer = setInterval(() => {
        //decrement the timeLeft and add it to the innerHTML of the page
        timeLeft -= 1;
        time.innerHTML = timeLeft;
    
        //if there are 0 seconds left
        if (timeLeft <= 0) {
            //show the end screen and clear the interval
            showEndScreen();
            clearInterval(restartTimer);
        }
    }, 1000)
}