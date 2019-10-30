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
    spatialShip = this.physics.add.sprite(300, 500, 'spatialShip');
    spatialShip.alive = true;
    AddEnnemy(this);
    cursors = this.input.keyboard.createCursorKeys();
    let style = { font: '20px Arial', fill: '#fff' };
    score = 0;
    scoreText = this.add.text(20, 20, score, style);
    shoot = this.physics.add.group();
}

function AddEnnemy(scene){
    ennemy = scene.physics.add.group();
    for (let i = 0; i < numberOfEnnemyByColumn; i++) {
        for (let j = 0; j < numberOfEnnemyByRow; j++) {
            ennemy.create(70+(50*i), 70+(50*j), 'ennemy');
        }
        
    }
}

var instance;
// boucle principale du jeu
function update() {
    instance = this;
    if (spatialShip.alive) {
        // move the spatial ship
        Move();

        // shoot with the spatial ship
        Shooting();

        // if a shoot is on the board
        if (shoot != null) {
            Collide();
        }
    }
}

function Collide() {
    //if a shoot touch an ennemy
    GainPoint();

    // check if the game is over
    GameOver();
}

function GainPoint() {
    if (instance.physics.collide(shoot, ennemy)) {
        shoot.children.iterate(childShoot => {
            ennemy.children.iterate(childEnnemy => {
                if (childEnnemy && childShoot) {
                    if(childShoot.x <= childEnnemy.x+30 && childEnnemy.x-30 <= childShoot.x && childEnnemy.y-30 <= childShoot.y && childShoot.y <= childEnnemy.y+30){
                        // destroy the both
                        childShoot.destroy();
                        childEnnemy.destroy();
                        score += 1;
                        scoreText.setText(score);
                    }
                }
            });
        });
    }
}

function GameOver() {
    if (instance.physics.collide(spatialShip, ennemy)) {
        gameOver = instance.physics.add.sprite(300, 300, 'gameOver');
        restartGame = instance.physics.add.sprite(300, 500, 'restartGame');
        restartGame.setInteractive();
        spatialShip.alive = false;
        let style={font: 'bold 30px Arial', fill: '#0000ff'};
        scoreText = instance.add.text(230, 420, "SCORE : "+score, style);

        instance.input.on('gameobjectdown', function(){instance.scene.restart();});
        // instance.scene.restart()
    }
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
        // check if the spatial ship is not out of bounds
        if (spatialShip.x > 15) {
            spatialShip.x -= speedSpatialShip;
        }
    }
    // if key right is down
    if (cursors.right.isDown) {
        // check if the spatial ship is not out of bounds
        if (spatialShip.x < width - 15) {
            spatialShip.x += speedSpatialShip;
        }
    }
    // if key up is down
    if (cursors.up.isDown) {
        // check if the spatial ship is not out of bounds
        if (spatialShip.y > 15) {
            spatialShip.y -= speedSpatialShip;
        }
    }
    // if key down is down
    if (cursors.down.isDown) {
        // check if the spatial ship is not out of bounds
        if (spatialShip.y < height - 15) {
            spatialShip.y += speedSpatialShip;
        }
    }
}