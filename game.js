var myGamePiece;
var myGamePiece1;
var myObstacles = [];
var myBackground;
var mySound;
var mySound1;
var mySound2;
var myScore;//stores current score based on framerate
var myHighScore; //stores highscore value
var gameOver;//text
var restart;//text
var myMute;//an image button, click to mute bgmusic
var myUnmute;//an image button, click to unmute bgmusic
var myHP;//this variable holds the health value of the plane
var gameSpeed;//this variable holds the speed of the game
var speedup;//this will be an image where users can click to speed up the game
var slowdown;//this will be an image where users can click to slow down the game speed

/* To initalise the game component
The speed of gamepiece is set to 1.
The score gained is based on the gameframe.
 */
 
 // This code will show the modal on page load
$(window).on('load',function(){
        $('#myModal').modal('show');
    });

function startGame() {
    myGamePiece = new component(45, 35, "images/plane1.png", 100, window.innerHeight/3, "image");
    myGamePiece1 = new component(70, 60, "images/Boom.png", 10, 0, "image");
    myBackground = new component(window.innerWidth - 10, window.innerHeight - 10, "images/bground1.jpg", 0, 0, "image");
    myMute = new component(35, 35, "images/mute.png", 0, 0, "image");
    myUnmute = new component(35, 35, "images/unmute.png", 40, 0, "image");
    speedup = new component(50,50, "images/Speedup.png", 0,40, "image");
    slowdown = new component(50, 50, "images/Slowdown.png", 65, 40, "image");
    myGamePiece.gravity = 1;
    gameSpeed = new component("30px", "Consolas, sans serif", "black", 500, 40, "text");
    gameSpeed.value = 10;
    myScore = new component("30px", "Consolas, sans serif", "black", 180, 40, "text");
    myHighScore = new component("30px", "Consolas, sans serif", "black", 180, 80, "text");
    myHP = new component("20px", "Consolas, sans serif", "black", myGamePiece.x, myGamePiece.y, "text");
    myHP.value =200;
    mySound = new sound("sounds/explosion.mp3");
    mySound1 = new sound("sounds/BGM.mp3");
    mySound2 = new sound("sounds/Accelerate.mp3");
    gameOver = new component("30px", "Consolas, sans serif", "red", window.innerWidth / 2.5, window.innerHeight / 2.5, "text");
    restart = new component("30px", "Consolas, sans serif", "black", window.innerWidth / 3, window.innerHeight / 5, "text");
    myGameArea.start();

}

/* This is to create the canvas of game. */
var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        mySound1.play();

        this.canvas.width = window.innerWidth - 10;
        this.canvas.height = window.innerHeight - 10;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
         //this determines the speed of the game, the lower the value the faster (gameSpeed.value): 
        this.interval = setInterval(updateGameArea, gameSpeed.value, myScore);

        window.addEventListener('mousedown', function (e) {
            myGameArea.x = e.pageX;
            myGameArea.y = e.pageY;
        })

        window.addEventListener('mouseup', function (e) {
            myGameArea.x = false;
            myGameArea.y = false;
        })
    },
    stop: function () {
        clearInterval(this.interval);
    },
    clear: function () {
        this.context.fillStyle = "white";
        this.context.globalAlpha = "0.5";
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.globalAlpha = "1.0";
    }

}

function resize() { //source: http://cssdeck.com/labs/emcxdwuz
    // Our canvas must cover full height of screen
    // regardless of the resolution
    var height = window.innerHeight;
    // So we need to calculate the proper scaled width
    // that should work well with every resolution
    var ratio = myGameArea.canvas.width / myGameArea.canvas.height;
    var width = height * ratio;

    myGameArea.canvas.style.width = width + 'px';
    myGameArea.canvas.style.height = height + 'px';
}
window.addEventListener('resize', resize, false);


/* This function is used to create object.*/
function component(width, height, color, x, y, type) {
    this.type = type;
    if (type == "image") {
        this.image = new Image();
        this.image.src = color;
    }
    this.score = 0;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.gravity = 0;
    this.gravitySpeed = 0;
    //This function is use to check whether the type of context is an image or text data type, else return a fillRect.
    this.update = function () {
        ctx = myGameArea.context;
        if (type == "image") {
            ctx.drawImage(this.image,
                this.x,
                this.y,
                this.width, this.height);
        } else if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    //This function sets default gravity speed to reach above or below for the object.
    this.newPos = function () {
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        this.hitBottom();
        this.hitTop();
    }
    //To prevent plane fly below the canvas.
    this.hitBottom = function () {
        var rockbottom = myGameArea.canvas.height - this.height;
        if (this.y > rockbottom) {
            this.y = rockbottom;
			myGameArea.clear();
            myGameArea.stop();
            mySound.play();
            myGamePiece1.x = myGamePiece.x;
            myGamePiece1.y = myGamePiece.y;
            myGamePiece1.update();
            myGamePiece.image.src = '';
            myGamePiece.update();
            mySound1.stop();
            gameOver.text = "GAME OVER";
            restart.text = "PRESS 'R' TO RESTART";
            restart.update();
            gameOver.update();
            myFunction(Event);
        }
        this.gravitySpeed = 0;
    }
    //To prevent plane fly beyond the canvas.
    this.hitTop = function () {
        var rocktop = 0;
        if (this.y <= rocktop) {
            this.y = rocktop;
			myGameArea.clear();
            myGameArea.stop();
            mySound.play();
            myGamePiece1.x = myGamePiece.x;
            myGamePiece1.y = myGamePiece.y;
            myGamePiece1.update();
            myGamePiece.image.src = '';
            myGamePiece.update();
            mySound1.stop();
            gameOver.text = "GAME OVER";
            restart.text = "PRESS 'R' TO RESTART";
            restart.update();
            gameOver.update();
            myFunction(Event);
        }
    }
    //To return a crash when object touches the obstacles
    this.crashWith = function (otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
    //this is the function to reduce the life when plane hits wall, status: needs fixing
    this.HitLife = function (otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var hit = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            hit = false;
        }
        return hit;
    }


    this.clicked = function () {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var clicked = true;
        if ((mybottom < myGameArea.y) || (mytop > myGameArea.y) ||
            (myright < myGameArea.x) || (myleft > myGameArea.x)) {
            clicked = false;
        }
        return clicked;
    }
}

function myFunction(event) {
    var x = event.which || event.keyCode;

    if (x == 114 || x == 82) {
        location.reload();
    }
}

//This function is used for updating the game area, when the user knocks obstacles it will trigger game over.
function updateGameArea() {
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;
    var highscore = localStorage.getItem("highscore");
    //this loop reduces the life of plane each time it hits obstacle. Status: needs fixing
    for (a = 0; a < myObstacles.length; a += 1) {
        if (myGamePiece.HitLife(myObstacles[a]))
            {
                myHP.value = myHP.value-1;
            }
    }
    for (i = 0; i < myObstacles.length; i += 1) {
            myHP.x=myGamePiece1.x+80;
            myHP.y =myGamePiece.y - 10;
        if ((myGamePiece.crashWith(myObstacles[i])) && (myHP.value<=0)) {
            myGameArea.clear();
            myGameArea.stop();
            mySound.play();
            myGamePiece1.x = myGamePiece.x;
            myGamePiece1.y = myGamePiece.y;
            myGamePiece1.update();
            myGamePiece.image.src = '';
            myGamePiece.update();
            mySound1.stop();
            gameOver.text = "GAME OVER";
            restart.text = "PRESS 'R' TO RESTART";
            restart.update();
            gameOver.update();
            myFunction(Event);
            return;
        }
    }
    myGameArea.clear();
    myGameArea.frameNo += 1;
    myBackground.update();
    if (myGameArea.x && myGameArea.y) {
        if (myMute.clicked()) {
            mySound1.stop();
        }
        if (myUnmute.clicked()) {
            mySound1.play();
        }
   /*     if (speedup.clicked()){
        } */
        if (slowdown.clicked()){
            this.interval = setInterval(myScore,gameSpeed.value + 1);
            gameSpeed.value += 1;
        }
    }
    
   
    
    //This is to create obstacles and set the height and gap for the obstacles.
    if (myGameArea.frameNo == 1 || everyinterval(200)) {
        x = myGameArea.canvas.width;
        minHeight = 20;
        maxHeight = window.innerHeight - (window.innerHeight / 4);
        height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
        minGap = 78;
        maxGap = 150;
        gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
        myObstacles.push(new component(40, height, "white", x, 0));
        myObstacles.push(new component(40, x - height - gap, "white", x, height + gap));
    }
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x += -2;
        myObstacles[i].update();
    }

    myMute.update();
    myUnmute.update();
    speedup.update();
    slowdown.update();
    //The score gained is based on the frameNo.
    myScore.text = "SCORE: " + myGameArea.frameNo;
    myScore.update();
    myHighScore.text = "HIGH SCORE: " + highscore;
    myHP.text = "HP:" + myHP.value;
    gameSpeed.text = "Speed: " + gameSpeed.value;
    gameSpeed.update();
    myHP.update();
    // https://stackoverflow.com/questions/29370017/adding-a-high-score-to-local-storage
    //After go through game over screen, the highscore will store the highest value and display in the canvas.
    if (highscore != null) {
        if (myGameArea.frameNo > highscore) {
            localStorage.setItem("highscore", myGameArea.frameNo);
        }
    } else {
        localStorage.setItem("highscore", myGameArea.frameNo);
    }
    
    myHighScore.update();
    myGamePiece.newPos();
    myGamePiece.update();
    
}

//This function is to initialise the sound effect.
function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function () {
        this.sound.play();
    }
    this.stop = function () {
        this.sound.pause();
    }

}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {
        return true;
    }
    return false;
}

function clearConsole() {
    console.clear();
}

function accelerate(n, event) {
    var x = event.which || event.keyCode;
    var y = event.which || event.mousePressed;
    if (x == 32 || y == 1) {
        myGamePiece.gravity = n;
        mySound2.play();
    }
}

/* function mute() {
    mySound1.stop();

}*/
