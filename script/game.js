var height = 600;
var width = 600;

var config = {
    width: width,
    height: height,
    scene: {
        preload: preload, // chargement ressource
        create: create, // initilisation des variables & objets
        update: update // fonction appelée 60 fois par seconde
    },
    physics: {
        default: 'arcade',  // Permet d'appliquer un set de mouvements aux objets
        arcade: {
            gravity: {
                y: 0
            },
        },
    },
    backgroundColor: '#000',

    parent: 'game'
};

// Variables globales
var game = new Phaser.Game(config);
var spatialShip;
var cursors;
var speedSpatialShip = 5;
var shoot = null;
var ennemy;
var startShoot = 0;
var endShoot = 0;
var score;
var scoreText;
var numberOfEnnemyByRow = 6;
var numberOfEnnemyByColumn = 5;
var gameOver;
var restartGame;
var instance;

// on charge images & sons
function preload() {
    this.load.image('spatialShip', 'img/spatialShip.png');
    this.load.image('shoot', 'img/shoot.png');
    this.load.image('ennemy', 'img/ennemy.png');
    this.load.image('gameOver', 'img/game_over.png');
    this.load.image('restartGame', 'img/restart.png');
}

// initialisation variables, affichages...
function create() {
    instance = this;
    // set the bounds
    this.physics.world.setBoundsCollision(true, true, true, true);

    // create spatial ship
    spatialShip = this.physics.add.sprite(300, 500, 'spatialShip').setCollideWorldBounds(true).setBounce(1);;
    spatialShip.alive = true;

    // add X ennemies
    AddEnnemy();

    // get cursors
    cursors = this.input.keyboard.createCursorKeys();

    // add score
    let style = { font: '20px Arial', fill: '#fff' };
    score = 0;
    scoreText = this.add.text(20, 20, score, style);

    // create group of shoot
    shoot = this.physics.add.group();
}

// add row of ennemies x times
function AddEnnemy(){
    instance.time.addEvent({
        delay:3000,
        callback: newRowOfEnnemies,
        callbackScope: instance,
        loop: true
    });
}

// create X ennemies
function newRowOfEnnemies(){
    ennemy = instance.physics.add.group();
    for (let i = 0; i < 5; i++) {
        ennemy.create(200+(50*i), 50, 'ennemy');
    }
    ennemy.setVelocityY(50);
}

// boucle principale du jeu
function update() {
    // if is not game over
    if (spatialShip.alive) {
        // move the spatial ship
        Move();

        // shoot with the spatial ship
        Shooting();

        //  Our colliders
        this.physics.add.collider(spatialShip, ennemy, GameOver, null, this);
        this.physics.add.collider(shoot, ennemy, GainPoint, null, this);
    }
}

function Collide() {
    //if a shoot touch an ennemy
    GainPoint();

    // check if the game is over
    GameOver();
}

function GainPoint(shoot,ennemy) {
    // disable shoot and ennemy touch
    shoot.disableBody(true,true);
    ennemy.disableBody(true,true);

    // add 1 to the score
    score += 1;
    scoreText.setText(score);
}

function GameOver(ship,ennemy) {
        console.log("stop");
        // add the image gameover
        gameOver = instance.physics.add.sprite(300, 300, 'gameOver');
        
        // add the image restart
        restartGame = instance.physics.add.sprite(300, 500, 'restartGame');
        restartGame.setInteractive();
        
        // block the movements of the spatial ship
        spatialShip.alive = false;
        
        // display the score
        let style={font: 'bold 30px Arial', fill: '#0000ff'};
        scoreText = instance.add.text(230, 420, "SCORE : "+score, style);

        // if click on the restart image, restart the game
        instance.input.on('gameobjectdown', function(){instance.scene.restart();});
}

function Shooting() {
    // if key space is down
    if (cursors.space.isDown) {
        endShoot = new Date().getTime();
        // if 200ms are passed since next time ship shoot
        if (endShoot > startShoot + 200) {
            startShoot = new Date().getTime();
            // add a sprite shoot
            shoot.create(spatialShip.x, spatialShip.y - 30, 'shoot');
            // sprite go to the up
            shoot.setVelocityY(-500);
        }
    }
}

function Move() {
    // if key left is down
    if (cursors.left.isDown) {
        spatialShip.x -= speedSpatialShip;
    }
    // if key right is down
    if (cursors.right.isDown) {
        spatialShip.x += speedSpatialShip;  
    }
    // if key up is down
    if (cursors.up.isDown) {
        spatialShip.y -= speedSpatialShip;
    }
    // if key down is down
    if (cursors.down.isDown) {
        spatialShip.y += speedSpatialShip;
    }
}