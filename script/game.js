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
var speedShootStart = 400;
var speedShoot = speedShootStart;
var waitShootStart = 700;
var waitShoot = waitShootStart;
var shoots;
var numberOfShoots = 1;
var ennemies;
var ennemiesBonus;
var genereEnnemies;
var startShoot = 0;
var endShoot = 0;
var score;
var scoreText;
var gameOver;
var restartGame;
var instance;
var bonus;

// on charge images & sons
function preload() {
    this.load.image('spatialShip', 'img/spatialShip.png');
    this.load.image('shoot', 'img/shoot.png');
    this.load.image('ennemy', 'img/ennemy.png');
    this.load.image('ennemyBonus', 'img/ennemyBonus.png');
    this.load.image('gameOver', 'img/game_over.png');
    this.load.image('restartGame', 'img/restart.png');
    this.load.image('bonusSpeedShoot', 'img/bonusSpeedShoot.png');
    this.load.image('bonusSpeedShip', 'img/bonusSpeedShip.png');
    this.load.image('bonusAddShoot', 'img/bonusAddShoot.png');
}

// initialisation variables, affichages...
function create() {
    instance = this;
    numberOfShoots = 1;
    spatialShip = null;
    ennemies = null;
    ennemiesBonus = null;
    bonus = null;
    waitShoot = waitShootStart;
    speedShoot = speedShootStart;
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
    shoots = this.physics.add.group();

    // create group of differents ennemy
    ennemies = instance.physics.add.group();
    ennemiesBonus = instance.physics.add.group();
    bonus = instance.physics.add.group();
}

// add row of ennemies x times
function AddEnnemy(){
    genereEnnemies = instance.time.addEvent({
        delay:3000,
        callback: newRowOfEnnemies,
        callbackScope: instance,
        loop: true
    });
}

// create X ennemies
function newRowOfEnnemies(){
    if(spatialShip.alive){
        // check number of ennemies bonus by row
        var bonus = Phaser.Math.Between(1,6);
        var elementBonus = new Array(bonus);
        for (let index = 0; index < bonus; index++) {
            elementBonus.push(Phaser.Math.Between(1,6));
        }

        for (let i = 0; i < 6; i++) {
            // if the cell correspond to a bonusEnnemy
            if(elementBonus.includes(i)){
                // add an ennemy bonus
                ennemiesBonus.create(170+(50*i), 50, 'ennemyBonus');
            }else{
                // add an ennemy
                ennemies.create(170+(50*i), 50, 'ennemy');
            }
        }

        // the ennemies go down
        ennemies.setVelocityY(40);
        ennemiesBonus.setVelocityY(40);
    }
    
}

// boucle principale du jeu
function update() {
    // if is not game over
    if (spatialShip.alive) {
        // move the spatial ship
        Move();

        // shoot with the spatial ship
        Shooting();

        //  colliders
        this.physics.add.collider(spatialShip, ennemies, GameOver, null, this);
        this.physics.add.collider(spatialShip, ennemiesBonus, GameOver, null, this);
        this.physics.add.collider(spatialShip, bonus, GainBonus, null, this);
        this.physics.add.collider(shoots, ennemiesBonus, GainPoint, null, this);
        this.physics.add.collider(shoots, ennemies, GainPoint, null, this);
    
        ColliderBetweenEnnemyAndBound();
    }
}

function GainBonus(ship,bonus){
    ship.setVelocityY(0);
    switch (bonus.texture.key) {
        case "bonusSpeedShoot":
            BonusSpeedShoot();
            break;
        case "bonusAddShoot":
            BonusAddShoot();
            break;
        case "bonusSpeedShip":
            BonusSpeedShip();
            break;
    }
    bonus.disableBody(true,true);
}

function BonusSpeedShoot(){
    speedShoot = speedShoot+200;
    if(speedShoot == speedShootStart+500 && waitShoot != 500){
        waitShoot = waitShoot-200;
    }
}

function BonusAddShoot(){
    if (numberOfShoots < 2) {
        numberOfShoots += 1;
    }
}

function BonusSpeedShip(){
    speedSpatialShip += 1;
}

function ColliderBetweenShootAndBound(){
    shoots.children.iterate(function(sh){
        if (sh.y >= 10) {
            sh.disableBody(true,true);
        }
    });
}

function ColliderBetweenEnnemyAndBound(){
    ennemies.children.iterate(function (el) {
        if (el.y >= height - 10) {
            GameOver();
        }
    });
    ennemiesBonus.children.iterate(function (el) {
        if (el.y >= height - 10) {
            GameOver();
        }
    });
}

//if a shoot touch an ennemy
function GainPoint(shoot,ennemy) {
    // disable shoot and ennemy touch
    if(ennemy.texture.key == "ennemyBonus"){
        var random = Phaser.Math.Between(1,3);
        switch (random) {
            case 1:
                bonus.create(ennemy.x, ennemy.y, 'bonusSpeedShoot');
                break;
            case 2:
                bonus.create(ennemy.x, ennemy.y, 'bonusAddShoot');
                break;
            case 3:
                bonus.create(ennemy.x, ennemy.y, 'bonusSpeedShip');
                break;
            default:
                break;
        }
        bonus.setVelocityY(400);

        // add 2 to the score
        score += 2;
    }else{
        // add 1 to the score
        score += 1;
    }

    shoot.disableBody(true,true);
    ennemy.disableBody(true,true);

    scoreText.setText(score);      
}

// check if the ship touch an ennemy
function GameOver() {
    // add the image gameover
    gameOver = instance.physics.add.sprite(300, 200, 'gameOver');
    
    // add the image restart
    restartGame = instance.physics.add.sprite(300, 400, 'restartGame');
    restartGame.setInteractive();
    
    // block the movements of the spatial ship
    spatialShip.alive = false;
    
    // display the score
    let style={font: 'bold 30px Arial', fill: '#0000ff'};
    scoreText = instance.add.text(230, 320, "SCORE : "+score, style);

    // disable all ennemies
    ennemies.children.iterate(function (el) {
        el.disableBody(true,true);
    });
    ennemiesBonus.children.iterate(function (el) {
        el.disableBody(true,true);
    });

    // disable the spatial ship
    spatialShip.disableBody(true,true);

    // if click on the restart image, restart the game
    instance.input.on('gameobjectdown', function(){instance.scene.restart();});
}

function Shooting() {
    // if key space is down
    if (cursors.space.isDown) {
        endShoot = new Date().getTime();
        // if 200ms are passed since next time ship shoot
        if (endShoot > startShoot + waitShoot) {
            startShoot = new Date().getTime();
            // add a sprite shoot
            console.log("shoot");
            for (let i = 0; i < numberOfShoots; i++) {
                shoots.create(spatialShip.x-(10*i), spatialShip.y - (30), 'shoot');
            }
            // sprite go to the up
            shoots.setVelocityY(-speedShoot);
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
}