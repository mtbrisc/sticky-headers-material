var GameState = function(game) {
};

// Load images and sounds
GameState.prototype.preload = function() {
    this.game.load.image('name', '/assets/images/matt-b.png');
    this.game.load.image('ground', '/assets/images/groundblock.jpg');
    this.game.load.image('player', '/assets/images/skater.png');
     this.game.load.image('background', '/assets/images/cloud.png');
    this.scale.scaleMode = Phaser.ScaleManager.SCALE;
};

// Setup the example
GameState.prototype.create = function() {
    // Set stage background to something sky colored
    //this.game.stage.backgroundColor = 'transparent';
    for (var i = 0; i < 50; i++)
    {   
        var rand = game.rnd.realInRange(-.5, 2.2);
        var cloud = game.add.sprite(game.world.randomX*4, game.world.randomY*1.5, 'background');
        cloud.scale.setTo(rand, rand);
        cloud.alpha = game.rnd.realInRange(0,8)*0.1;
        //cloud.body.scale(Math.random()*4,Math.random()*4);
    }
    //this.game.add.tileSprite(0, 0, 4000, 1920, 'background');

    this.game.world.setBounds(0, 0, document.getElementById('container').offsetWidth*4, document.getElementById('container').offsetHeight*2);
    // Define movement constants
    this.MAX_SPEED = 900; // pixels/second
    this.ACCELERATION = 1200; // pixels/second/second
    this.DRAG = 600; // pixels/second
    this.GRAVITY = 2600; // pixels/second/second
    this.JUMP_SPEED = -700; // pixels/second (negative y is up)

    // Create a player sprite
    this.player = this.game.add.sprite(this.game.width/2, this.game.height/2, 'player');
    this.player.anchor.setTo(0.5);
    this.game.camera.follow(this.player);
    // Enable physics on the player
    this.game.physics.enable(this.player, Phaser.Physics.ARCADE);

    // Make player collide with world boundaries so he doesn't leave the stage
    this.player.body.collideWorldBounds = true;

    // Set player minimum and maximum movement speed
    this.player.body.maxVelocity.setTo(this.MAX_SPEED, this.MAX_SPEED * 10); // x, y

    // Add drag to the player that slows them down when they are not accelerating
    this.player.body.drag.setTo(this.DRAG, 0); // x, y
    this.player.scale.setTo(0.7);

    // Since we're jumping we need gravity
    game.physics.arcade.gravity.y = this.GRAVITY;

    //window.innerWidth, window.innerHeight
    // var style = { font: "10vw Venus Rising", fill: "#fff", wordWrap: false, align: "center", };
    // var textCustom = game.add.text(this.game.width, this.game.height*1.5, "MATT BRISCOE", style);
    // textCustom.anchor.set(0.5);
    this.name = this.game.add.sprite(this.game.width, this.game.height/.8, 'name');
    this.name.scale.setTo(.5);
    this.name.anchor.setTo(0.5,.4);
     //game.physics.startSystem(Phaser.Physics.P2JS);
    // Flag to track if the jump button is pressed
    this.jumping = false;

    // Create some ground for the player to walk on
    this.ground = this.game.add.group();
    for(var x = 0; x < this.world.width; x += document.getElementById('container').offsetWidth*.75) {
        // Add the ground blocks, enable physics on each, make them immovable
        var groundBlock = this.game.add.sprite(x, this.world.height-Math.random()*(document.getElementById('container').offsetHeight/4), 'ground');
        this.game.physics.enable(groundBlock, Phaser.Physics.ARCADE);
        groundBlock.body.immovable = true;
        groundBlock.body.allowGravity = false;
        groundBlock.scale.setTo(document.getElementById('container').offsetWidth, 2);
        this.ground.add(groundBlock);
    }
    this.player.smoothed = false;
    // Capture certain keys to prevent their default actions in the browser.
    // This is only necessary because this is an HTML5 game. Games on other
    // platforms may not need code like this.
    this.game.input.keyboard.addKeyCapture([
        Phaser.Keyboard.LEFT,
        Phaser.Keyboard.RIGHT,
        Phaser.Keyboard.UP,
        Phaser.Keyboard.DOWN
    ]);
};

// The update() method is called every frame
GameState.prototype.update = function() {
    // Collide the player with the ground
    this.game.physics.arcade.collide(this.player, this.ground);

    if (this.leftInputIsActive()) {
    	this.player.scale.setTo(-.7,.7);
        // If the LEFT key is down, set the player velocity to move left
        this.player.body.acceleration.x = -this.ACCELERATION;
    } else if (this.rightInputIsActive()) {
    	this.player.scale.setTo(.7,.7);
        // If the RIGHT key is down, set the player velocity to move right
        this.player.body.acceleration.x = this.ACCELERATION;
    } else {
        this.player.body.acceleration.x = 0;
    }

    // Set a variable that is true when the player is touching the ground
    var onTheGround = this.player.body.touching.down;

    // If the player is touching the ground, let him have 2 jumps
    if (onTheGround) {
        this.jumps = 2;
        this.jumping = false;
    }

    // Jump! Keep y velocity constant while the jump button is held for up to 150 ms
    if (this.jumps > 0 && this.upInputIsActive(150)) {
        this.player.body.velocity.y = this.JUMP_SPEED;
        this.jumping = true;
    }

    // Reduce the number of available jumps if the jump input is released
    if (this.jumping && this.upInputReleased()) {
        this.jumps--;
        this.jumping = false;
    }
};

GameState.prototype.render= function() {

    //this.game.debug.cameraInfo(this.game.camera, 32, 32);
    //this.game.debug.spriteCoords(this.player, 32, 500);

};

// This function should return true when the player activates the "go left" control
// In this case, either holding the right arrow or tapping or clicking on the left
// side of the screen.
GameState.prototype.leftInputIsActive = function() {
    var isActive = false;

    isActive = this.input.keyboard.isDown(Phaser.Keyboard.LEFT);
    isActive |= (this.game.input.activePointer.isDown &&
        this.game.input.activePointer.x < this.game.width/4);

    return isActive;
};

// This function should return true when the player activates the "go right" control
// In this case, either holding the right arrow or tapping or clicking on the right
// side of the screen.
GameState.prototype.rightInputIsActive = function() {
    var isActive = false;

    isActive = this.input.keyboard.isDown(Phaser.Keyboard.RIGHT);
    isActive |= (this.game.input.activePointer.isDown &&
        this.game.input.activePointer.x > this.game.width/2 + this.game.width/4);

    return isActive;
};

// This function should return true when the player activates the "jump" control
// In this case, either holding the up arrow or tapping or clicking on the center
// part of the screen.
GameState.prototype.upInputIsActive = function(duration) {
    var isActive = false;

    isActive = this.input.keyboard.downDuration(Phaser.Keyboard.UP, duration);
    isActive |= (this.game.input.activePointer.justPressed(duration + 1000/60) &&
        this.game.input.activePointer.x > this.game.width/4 &&
        this.game.input.activePointer.x < this.game.width/2 + this.game.width/4);

    return isActive;
};

// This function returns true when the player releases the "jump" control
GameState.prototype.upInputReleased = function() {
    var released = false;

    released = this.input.keyboard.upDuration(Phaser.Keyboard.UP);
    released |= this.game.input.activePointer.justReleased();

    return released;
};
var game = new Phaser.Game(document.getElementById('container').offsetWidth, document.getElementById('container').offsetHeight, Phaser.canvas, 'container', true, true);
game.state.add('game', GameState, true);