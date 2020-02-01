var AM = new AssetManager();

var spritesheet = [];
function loadSpriteSheets(AM){
    //right
    spritesheet['goul dying'] = AM.getAsset("./img/Goul Die.png");
    spritesheet['bat attack left'] = AM.getAsset("./img/Bat Attack Left.png");
    spritesheet['bat fly left'] = AM.getAsset("./img/Bat Fly Flip.png");

}
function Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
    this.spriteSheet = spriteSheet;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.sheetWidth = sheetWidth;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.scale = scale;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y) {
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    }
    var frame = this.currentFrame();
    var xindex = 0;
    var yindex = 0;
    xindex = frame % this.sheetWidth;
    yindex = Math.floor(frame / this.sheetWidth);

    ctx.drawImage(this.spriteSheet,
                 xindex * this.frameWidth, yindex * this.frameHeight,  // source from sheet
                 this.frameWidth, this.frameHeight,
                 x, y,
                 this.frameWidth * this.scale,
                 this.frameHeight * this.scale);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

// no inheritance
function Background(game, spritesheet) {
    this.x = 0;
    this.y = 0;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
};

Background.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet,
                   this.x, this.y, 1200, 780);
};

Background.prototype.update = function () {
};

Bat.prototype = new Entity();
Bat.prototype.constructor = Bat;

function Bat(game, spritesheet) {
    this.animation = new Animation(spritesheet, 2800, 850, 10, 0.07, 10, true, .34);
    this.x = 800;
    this.y = 400;
        //this.y = Math.pow(this.x, 2)
    this.speed = 0;
    this.game = game;
    this.ctx = game.ctx;
    this.state = "flying";
    this.playingTempAnimation = "false";
    this.default = "true";
}

Bat.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);

}

Bat.prototype.update = function () {
   // this.x -= 3; //for flying

    if (this.state === "flying") {
        this.x -= 3; //for flying

        this.y = (-.95*this.x)+750;
        
    }

    if(this.x <= 400 && this.playingTempAnimation === "false"){
        Bat.prototype.AttackLeft.call(this);
    }
    // else if (this.playingTempAnimation === "true" && this.default === "false"){
    //     Bat.prototype.default.call(this);

    // }
    
     this.x += this.game.clockTick * this.speed;
     Entity.prototype.update.call(this);

}
Bat.prototype.default = function(){
    this.animation = new Animation(spritesheet['bat fly left'], 2800, 850, 10, 0.07, 10, true, .34);
    this.state = "flying";
    this.default = "true"; 
}

Bat.prototype.AttackLeft = function () {
    this.y = 380;
    this.state = "bat attack left";
    this.animation = new Animation(spritesheet['bat attack left'], 2800, 850, 10, 0.07, 10, true, .34);
    this.playingTempAnimation = "true";
    this.default = "false";
    //this.speed = 0;
    //this.playingTempAnimation = "false";
}


Goul.prototype = new Entity();
Goul.prototype.constructor = Goul;

function Goul(game, spritesheet) {
    this.animation = new Animation(spritesheet, 713, 842, 10, 0.1, 10, true, .3); //walking animation
    this.x = 100;
    this.y = 400;
    this.speed = 0;
    this.game = game;
    this.ctx = game.ctx;
    this.state = "walking";
    this.playingTempAnimation = "false";
    this.jumping = "false";

}
Goul.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);

}

Goul.prototype.update = function () {
    this.x += this.game.clockTick * this.speed;

    console.log(this.x + ", " + this.y);

    if (this.state = "walking") this.x += 2; //for walking
    if(this.x >=296){
        this.y = Math.sqrt(2500+(this.x-350)*(this.x-350)) + 200;
    } 
     
    if(this.x > 500 && this.playingTempAnimation === "false"){
        Goul.prototype.die.call(this);
    }

    
    //this.x += this.game.clockTick * this.speed;
    Entity.prototype.update.call(this);

}

Goul.prototype.die = function () {
    this.state = "dying";
    this.animation = new Animation(spritesheet['goul dying'], 852, 872, 10, 0.08, 10, false, .3);
    this.speed = 0;
    this.playingTempAnimation = "true";
}

AM.queueDownload("./img/cave.png");
AM.queueDownload("./img/Goul Walk.png");
AM.queueDownload("./img/Goul Die.png");
AM.queueDownload("./img/Bat Fly.png");
AM.queueDownload("./img/Bat Fly Left.png");
AM.queueDownload("./img/Bat Attack Left.png");

//C:\Users\AWJaners\Desktop\CompWorldAssignments\Assignment 1\img\3\Goul Idle
AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();

    loadSpriteSheets(AM);
    gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/cave.png")));

    var goul = new Goul(gameEngine, AM.getAsset("./img/Goul Walk.png"));
    var bat = new Bat(gameEngine, AM.getAsset("./img/Bat Fly Left.png"));

    gameEngine.addEntity(goul);
    gameEngine.addEntity(bat);
   
    console.log("All Done!");
});