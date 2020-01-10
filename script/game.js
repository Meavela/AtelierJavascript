import { LoadImage,LoadAudio } from './preload.js';
import { ReadData } from './bdd.js';
import { GameOver } from './gameover.js';
import { AddEnnemy,BadEnnemyShoot } from './ennemies.js';
import { BonusIsCollide } from './bonus.js';
import { Shooting,Move } from './spatialshipAction.js';
import { ColliderBetweenShootAndBound,ColliderBetweenBonusAndBound,ColliderBetweenEnnemyAndBound } from './colliders.js';


// Size of the game
var height = 600;
var width = 600;

// Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyDUhVjxB27hiHnvRIXsLcOUZLeA5Iw4RUQ",
    authDomain: "atelierjavascript.firebaseapp.com",
    databaseURL: "https://atelierjavascript.firebaseio.com",
    projectId: "atelierjavascript",
    storageBucket: "atelierjavascript.appspot.com",
    messagingSenderId: "56466323023",
    appId: "1:56466323023:web:2aa21dc26c389808251c3a",
    measurementId: "G-XC4P6JDDX3"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

// Config of the game
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
var life = 3;
var db = firebase.firestore();
var spatialShip;
var cursors;
var speedSpatialShip = 5;
var speedShootStart = 400;
var speedShoot = speedShootStart;
var waitShootStart = 700;
var waitShoot = waitShootStart;
var shoots;
var hearts;
var shootsBad;
var numberOfShoots = 1;
var ennemies;
var ennemiesBonus;
var ennemiesBad;
var genereEnnemies;
var startShoot = 0;
var endShoot = 0;
var score;
var scoreText;
var gameOver;
var restartGame;
var instance;
var bonus;
var startGame = 0;
var badShootStart = 0;
var badShootEnd = 0;

function preload(){    
    LoadImage(this);
    LoadAudio(this);
}
// initialisation variables, affichages...
function create() {
    //initialize variables
    startGame = new Date().getTime();
    instance = this;
    life = 3;
    numberOfShoots = 1;
    startShoot = 0;
    badShootStart = 0;
    spatialShip = null;
    speedSpatialShip = 5;
    ennemies = null;
    hearts = null;
    ennemiesBonus = null;
    ennemiesBad = null;
    bonus = null;
    waitShoot = waitShootStart;
    speedShoot = speedShootStart;

    // display all the score of the database
    ReadData(db);

    // set the bounds
    this.physics.world.setBoundsCollision(true, true, true, true);

    // create spatial ship
    spatialShip = this.physics.add.sprite(300, 500, 'spatialShip').setCollideWorldBounds(true).setBounce(1);;
    spatialShip.alive = true;

    hearts = instance.physics.add.group();
    for (let index = 1; index <= life; index++) {
        hearts.create((index*50)+200, (560), 'heart');
    }

    // create group of differents ennemies
    ennemies = instance.physics.add.group();
    ennemiesBonus = instance.physics.add.group();
    ennemiesBad = instance.physics.add.group();
    bonus = instance.physics.add.group();

    // add X ennemies
    genereEnnemies = AddEnnemy(instance,genereEnnemies,spatialShip,bonus,ennemiesBonus,ennemies);

    // get cursors
    cursors = this.input.keyboard.createCursorKeys();

    // add score
    let style = { font: '20px Arial', fill: '#fff' };
    score = 0;
    scoreText = this.add.text(550, 20, score, style);

    // create group of differents shoots
    shoots = this.physics.add.group();
    shootsBad = this.physics.add.group();
}


// boucle principale du jeu
function update() {

    // if is not game over
    if (spatialShip.alive) {
        // move the spatial ship
        Move(cursors,spatialShip,speedSpatialShip);

        // shoot with the spatial ship
        var arrayShoot = Shooting(cursors,startShoot,waitShoot,numberOfShoots,spatialShip,shoots,this,speedShoot,endShoot);
        if (arrayShoot != null) {
            if(arrayShoot[0] != null){
                startShoot = arrayShoot[0];
                endShoot = arrayShoot[1];
            }else if(arrayShoot[0] == null){
                endShoot = arrayShoot[1];
            }
        }

        // bad ennemy shoot
        var arrayEnnemyShoot = BadEnnemyShoot(ennemiesBad,badShootEnd,badShootStart,shootsBad);
        if (arrayEnnemyShoot != null) {
            badShootStart = arrayEnnemyShoot;
        }

        //  colliders
        // between ennemies and spatial ship
        this.physics.add.collider(spatialShip, ennemies, LooseLife, null, this);
        this.physics.add.collider(spatialShip, ennemiesBonus, LooseLife, null, this);
        this.physics.add.collider(spatialShip, ennemiesBad, LooseLife, null, this);

        var bonusToChange = BonusIsCollide(spatialShip, bonus, this,speedShoot,speedShootStart,waitShoot,numberOfShoots,speedSpatialShip);
        speedShoot = bonusToChange[0];
        numberOfShoots = bonusToChange[1];
        speedSpatialShip = bonusToChange[2];
        
        // between spatial ship shoot and ennemies
        this.physics.add.collider(shoots, ennemiesBad, GainPoint, null, this);
        this.physics.add.collider(shoots, ennemiesBonus, GainPoint, null, this);
        this.physics.add.collider(shoots, ennemies, GainPoint, null, this);
        // between shoot ennemies and spatial ship
        this.physics.add.collider(spatialShip, shootsBad, LooseLife, null, this);

        // between bounds and ennemies/shoot/bonus
        instance = ColliderBetweenEnnemyAndBound(gameOver,restartGame,spatialShip,scoreText,score,ennemies,ennemiesBonus,ennemiesBad,bonus,shoots,shootsBad,this,height,startGame,db);
        ColliderBetweenShootAndBound(shoots,shootsBad,height);
        ColliderBetweenBonusAndBound(bonus,height);
    }
}

function LooseLife(ship, elementCollide){
    life = life-1;

    ship.setVelocityY(0);

    elementCollide.destroy();

    hearts.children.iterate(function (he) {
        he.disableBody(true, true);
    });
    hearts.children.iterate(function (he) {
        if (he != undefined) {
            he.destroy();
        }
    });
    hearts = this.physics.add.group();

    switch (life) {
        case 2:
            for (let index = 1; index <= life; index++) {
                hearts.create((index*50)+225, (560), 'heart');
            }
            break;
        case 1:
            
            for (let index = 1; index <= life; index++) {
                hearts.create(300, (560), 'heart');
            }
            break;
        case 0: 
            instance = GameOver(gameOver,restartGame,spatialShip,scoreText,score,ennemies,ennemiesBonus,ennemiesBad,bonus,shoots,shootsBad,this,startGame,db);
            break;
    }
}

//if a shoot touch an ennemy
function GainPoint(shoot, ennemy) {

    // if it's an ennemy bonus which is touch
    if (ennemy.texture.key == "ennemyBonus") {

        // get randomly the bonus choose
        var random = Phaser.Math.Between(1, 3);
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

        // add bad ennemy
        ennemiesBad.create(ennemy.x, ennemy.y, 'ennemyBad');
        ennemiesBad.setVelocityY(40);

        // bonus go down
        bonus.setVelocityY(200);

        // add 2 to the score
        score += 2;

    } else if (ennemy.texture.key == "ennemyBad") {
        // add 3 to the score
        score += 3;
    } else {
        // add 3 to the score
        score += 1;
    }
    this.sound.play('soundDestroyEnnemy');


    // disable shoot and ennemy touch
    shoot.destroy();
    ennemy.destroy();

    // set the score
    scoreText.setText(score);
}