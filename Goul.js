
var spritesheet = [];
function loadSpriteSheets(AM){
    //right
    spritesheet['dying'] = AM.getAsset("./img/Goul Die.png");

}

function Goul(game, spritesheet) {
    this.animation = new Animation(spritesheet, 713, 842, 10, 0.1, 10, true, .3); //walking animation
    this.x = 100;
    this.y = 350;
    this.speed = 0;
    this.game = game;
    this.ctx = game.ctx;
}
Goul.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
}

Goul.prototype.update = function () {
    //this.x += 3; //for walking
    if (this.animation.elapsedTime < this.animation.totalTime * 8 / 14)
        this.x += this.game.clockTick * this.speed;
}

Goul.prototype.die = function () {
    this.animation = new Animation(spritesheet['dying'], 852, 872, 10, 0.08, 10, true, .3);
    //this.x = 0;
    this.y = 350;
    this.speed = 0;

}