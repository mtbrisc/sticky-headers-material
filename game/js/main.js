var GameState = function(game) {
};
var skater;

// Load images and sounds
GameState.prototype.preload = function() {
    this.game.load.image('name', 'assets/images/matt-b.png');
    this.game.load.image('ground', 'assets/images/groundblock.jpg');
    //this.game.load.image('player', 'assets/images/skater.png');
    this.game.load.atlasJSONHash('kickflip', 'assets/spritesheets/kickflip.png', 'assets/spritesheets/kickflip.json');
    this.game.load.atlasJSONHash('ollie', 'assets/spritesheets/kickflip.png', 'assets/spritesheets/kickflip.json');
    // this.game.load.spritesheet('kickflip', 'assets/spritesheets/kickflip/0001');
    this.game.load.image('moonGround', 'assets/images/skater.png');
    this.game.load.image('background', 'assets/images/cloud.png');
    this.scale.scaleMode = Phaser.ScaleManager.SCALE;
};

// Setup the example
GameState.prototype.create = function() {
    this.game.world.setBounds(0, 0, 16000, 6000);
    // Set stage background to something sky colored
    //this.game.stage.backgroundColor = 'transparent';
    this.bg = this.game.add.group();
    for (var i = 0; i < 310; i++)
    {   
        var rand = game.rnd.realInRange(-.8, 2.4);
        var cloud = game.add.sprite(this.game.world.randomX, this.game.world.randomY, 'background');
        cloud.scale.setTo(rand, rand);
        cloud.alpha = game.rnd.realInRange(0,5)*0.1;
        //cloud.body.scale(Math.random()*4,Math.random()*4);
        this.bg.add(cloud);
    }
    //this.game.add.tileSprite(0, 0, 4000, 1920, 'background');

    // Define movement constants
    this.MAX_SPEED = 900; // pixels/second
    this.ACCELERATION = 1200; // pixels/second/second
    this.DRAG = 600; // pixels/second
    this.GRAVITY = 2600; // pixels/second/second
    this.JUMP_SPEED = -700; // pixels/second (negative y is up)

    // Infinity and beyond!!
    // this.world.wrap(skater, -(this.game.width*4), false, true);


    // Create a player sprite
    skater = this.game.add.sprite(this.game.width/2, this.game.height/2, 'kickflip','ollie0001');
    skater.anchor.setTo(.5);
    // skater.animations.add('ollie', [0,1], 10,true);
    this.game.camera.follow(skater);
    // Enable physics on the player
    this.game.physics.enable(skater, Phaser.Physics.ARCADE);

    // Make player collide with world boundaries so he doesn't leave the stage
    skater.body.collideWorldBounds = true;

    // Set player minimum and maximum movement speed
    skater.body.maxVelocity.setTo(this.MAX_SPEED, this.MAX_SPEED * 10); // x, y

    // Add drag to the player that slows them down when they are not accelerating
    skater.body.drag.setTo(this.DRAG, 0); // x, y
    skater.anchor.setTo(0.5,1);
    skater.scale.setTo(0.5,0.5);

    skater.animations.add('kickflip', Phaser.Animation.generateFrameNames('kickflip', 1, 25, '', 4), 44, false, false);
    skater.animations.add('ollie', Phaser.Animation.generateFrameNames('ollie', 1, 22, '', 4), 40, false, false);
    skater.animations.add('riding', Phaser.Animation.generateFrameNames('ollie', 7, 1, '', 4), 40, false, false);
    skater.animations.add('space', Phaser.Animation.generateFrameNames('space', 1, 16, '', 4), 10, true, false);

    // Since we're jumping we need gravity
    game.physics.arcade.gravity.y = this.GRAVITY;

     //game.physics.startSystem(Phaser.Physics.P2JS);
    // Flag to track if the jump button is pressed
    this.jumping = false;

    // Create some ground for the player to walk on
    this.ground = this.game.add.group();
    for(var x = 0; x < this.world.width*10; x += 950) {
        // Add the ground blocks, enable physics on each, make them immovable
        var groundBlock = this.game.add.sprite(x, this.world.height-Math.random()*this.game.width/4, 'ground');
        this.game.physics.enable(groundBlock, Phaser.Physics.ARCADE);
        groundBlock.body.immovable = true;
        groundBlock.body.allowGravity = false;
        groundBlock.scale.setTo(10, 10);
        this.ground.add(groundBlock);
    }
    globalBg = this.bg;
    globalGround = this.ground;


    this.name = this.game.add.sprite(this.game.width, this.game.world.height-this.game.height*(3/4), 'name');
    this.name.scale.setTo(.5);
    this.name.anchor.setTo(0.3,.3);
    // this.game.physics.enable(this.name, Phaser.Physics.ARCADE);
    // this.name.body.immovable = true;
    // this.name.body.allowGravity = false;

    skater.smoothed = false;
    // Capture certain keys to prevent their default actions in the browser.
    // This is only necessary because this is an HTML5 game. Games on other
    // platforms may not need code like this.
    this.game.input.keyboard.addKeyCapture([
        Phaser.Keyboard.LEFT,
        Phaser.Keyboard.RIGHT,
        Phaser.Keyboard.UP,
        Phaser.Keyboard.DOWN
    ]);
    //new Animation(game, parent, name, frameData, frames, frameRate, loop, loop)
};



function checkOverlap(spriteA, spriteB) {

    var boundsA = spriteA.getBounds();
    var boundsB = spriteB.getBounds();

    return Phaser.Rectangle.intersects(boundsA, boundsB);

}
var kicked = false;
var ollied = false;
var riding = false;
var spacemode = false;
var spaceUnlockCount = 0;
var globalBg;
var globalGround;

// The update() method is called every frame
GameState.prototype.update = function() {
    // Collide the player with the ground
    this.game.physics.arcade.collide(skater, this.ground);
    //this.game.physics.arcade.overlap(skater, this.name);

    this.bg.x= game.camera.x*0.2;
    this.bg.y= game.camera.y*0.5+240;
    // this.ground.x= game.camera.x*0.2;
    // this.ground.y= game.camera.y*0.2+300;

    if (this.leftInputIsActive()) {
    	skater.scale.setTo(-0.5,0.5);
        // If the LEFT key is down, set the player velocity to move left
        skater.body.acceleration.x = -this.ACCELERATION;
    } else if (this.rightInputIsActive()) {
    	skater.scale.setTo(0.5,0.5);
        // If the RIGHT key is down, set the player velocity to move right
        skater.body.acceleration.x = this.ACCELERATION;
    } else {
        skater.body.acceleration.x = 0;
    }

    // Set a variable that is true when the player is touching the ground
    var onTheGround = skater.body.touching.down;
    var animateTrick =  function(sprite,event){
        if(event === 'kickflip'){
           sprite.play('kickflip');
           kicked = true;
        } else if(event === 'ollie'){
            sprite.play('ollie');
            ollied = true;
        } else if(event === 'space'){
            sprite.play('space');
        }else {
            sprite.play('riding');
            riding = true;
        }
    }
    if (checkOverlap(skater, this.name))
    {
        spaceUnlockCount += 1;
        if(spaceUnlockCount%127 === 0){
            spacemode = true;
            animateTrick(skater,'space');
            window.document.getElementById('container').classList.remove('awesomeBackground');
            window.document.getElementById('stars').style.cssText = 'display:block!important';
            window.document.getElementById('stars2').style.cssText = 'display:block!important';
            window.document.getElementById('stars3').style.cssText = 'display:block!important';

            globalBg.alpha = 0.5;
            globalGround.alpha = 0.5;
            setTimeout(function(){
                window.document.getElementById('container').classList.add('awesomeBackground');
                window.document.getElementById('stars').style.cssText = 'display:none';
                window.document.getElementById('stars2').style.cssText = 'display:none';
                window.document.getElementById('stars3').style.cssText = 'display:none';
                globalBg.alpha = 1;
                globalGround.alpha = 1;
                spacemode = false;
                animateTrick(skater,'riding');
            },10000);
        }
        //this.game.physics.arcade.collide(skater, this.name);
    }
    if(spacemode){
        game.physics.arcade.gravity.y = this.GRAVITY/8;
    } else {
        game.physics.arcade.gravity.y = this.GRAVITY;
    }
    // If the player is touching the ground, let him have 2 jumps
    if (onTheGround) {
        if (!riding && !spacemode){
            animateTrick(skater,'riding');
        }
        this.jumps = 3;
        this.jumping = false;
        skater.body.drag.setTo(this.DRAG, 0); // x, y
        kicked = false;
        ollied = false;
    } else {
        skater.body.drag.setTo(this.DRAG*.3, 0); // x, y
        if(this.jumps === 1 && !kicked && !spacemode){
            animateTrick(skater,'kickflip');
        } else if (!ollied && !spacemode){
            animateTrick(skater,'ollie');
        }
        riding = false;
    }

    // Jump! Keep y velocity constant while the jump button is held for up to 150 ms
    if (this.jumps > 0 && this.upInputIsActive(150)) {
        skater.body.velocity.y = this.JUMP_SPEED;
        this.jumping = true;
        //skater.play('ollie',true,true);
    } else {
        //skater.animations.stop();
        // skater.frame = ;
    }

    // Reduce the number of available jumps if the jump input is released
    if (this.jumping && this.upInputReleased()) {
        this.jumps--;
        this.jumping = false;
    }
};

GameState.prototype.render= function() {

    //this.game.debug.cameraInfo(this.game.camera, 32, 32);
    //this.game.debug.spriteCoords(skater, 32, 500);

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

GameState.prototype.spaceInputActive = function() {
    var isActive = false;

    isActive = this.input.keyboard.isDown(Phaser.Keyboard.DOWN);
    isActive |= (this.game.input.activePointer.isDown &&
        this.game.input.activePointer.y > this.game.height/2);
    spacemode = !spacemode;
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

var game = new Phaser.Game(document.getElementById('container').offsetWidth, document.getElementById('container').offsetHeight, Phaser.CANVAS, 'container', true, true, 'nearest-neighbor');
game.state.add('game', GameState, true);

function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

var myEfficientFn = debounce(function() {
    window.location.reload();
}, 500);

window.addEventListener('resize', myEfficientFn);