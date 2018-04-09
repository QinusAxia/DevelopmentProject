var myGamePiece;
var myObstacles = [];
var myBackground;
var mySound;
var mySound1;
var mySound2;
var myScore;
var myHighScore;
var gameOver;
var restart;

function startGame() {
    myGamePiece = new component(45, 35, "images/plane1.png", 10, 0, "image");
	myBackground = new component(512, 512, "images/bground1.jpg", 0, 0, "image"); 
    myGamePiece.gravity = 1;
    myScore = new component("30px", "Consolas, sans serif", "black", 180, 40, "text");
	myHighScore = new component("30px", "Consolas, sans serif", "black", 180, 80, "text");
	mySound = new sound("sounds/explosion.mp3");
	mySound1 = new sound("sounds/BGM.mp3");
	mySound2 = new sound("sounds/Accelerate.mp3");
	gameOver = new component("30px", "Consolas, sans serif", "red", 180, 80, "text");
    restart = new component("30px", "Consolas, sans serif", "black", 100, 120, "text");
    myGameArea.start();
	
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
		mySound1.play();
		
        this.canvas.width = 512;
        this.canvas.height = 512;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        },
		stop : function() {
        clearInterval(this.interval);
    }, 
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function component(width, height, color, x, y, type) {
    this.type = type;
    if (type == "image")
    {
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
    this.update = function() 
      {
        ctx = myGameArea.context;
        if (type == "image") {
          ctx.drawImage(this.image, 
            this.x, 
            this.y,
            this.width, this.height);
        }
		else if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        }
        else 
        {
          ctx.fillStyle = color;
          ctx.fillRect(this.x, this.y, this.width, this.height);
        }
      }
    this.newPos = function() {
		this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        this.hitBottom();
		this.hitTop();
    }
    this.hitBottom = function() {
        var rockbottom = myGameArea.canvas.height - this.height;
        if (this.y > rockbottom) {
            this.y = rockbottom;
        }
		this.gravitySpeed = 0;
    }
	this.hitTop = function() {
        var rocktop = 0;
        if (this.y <= rocktop) {
            this.y = rocktop;
        }
    }
    this.crashWith = function(otherobj) {
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
}

function myFunction(event) {
    var x = event.which || event.keyCode;
    
    if (x == 114 || x == 82) {
        location.reload();
    }
}

function updateGameArea() {
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;
	var highscore = localStorage.getItem("highscore");
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            myGameArea.stop();
			mySound.play();
			mySound1.stop();
			myGameArea.clear();
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
	myBackground.newPos(); 
    myBackground.update();
    if (myGameArea.frameNo == 1 || everyinterval(150)) {
        x = myGameArea.canvas.width;
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        minGap = 78;
        maxGap = 200;
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
        myObstacles.push(new component(40, height, "white", x, 0));
        myObstacles.push(new component(40, x - height - gap, "white", x, height + gap));
    }
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x += -1;
        myObstacles[i].update();
    }
    myScore.text="SCORE: " + myGameArea.frameNo;
    myScore.update();
	myHighScore.text = "HIGH SCORE: " + highscore;
	// https://stackoverflow.com/questions/29370017/adding-a-high-score-to-local-storage
	if(highscore != null){
		if(myGameArea.frameNo > highscore){
			localStorage.setItem("highscore", myGameArea.frameNo);
		}
	}
	else{
		localStorage.setItem("highscore", myGameArea.frameNo);
	}
	myHighScore.update();
    myGamePiece.newPos();
    myGamePiece.update();
}

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }    
	
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

function accelerate(n) {
    myGamePiece.gravity = n ;
	mySound2.play();
}