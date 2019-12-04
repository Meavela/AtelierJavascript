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
var db = firebase.firestore();
var spatialShip;
var cursors;
var speedSpatialShip = 5;
var speedShootStart = 400;
var speedShoot = speedShootStart;
var waitShootStart = 700;
var waitShoot = waitShootStart;
var shoots;
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

// on charge images & sons
function preload() {
    this.load.image('spatialShip', 'img/spatialShip.png');
    this.load.image('shoot', 'img/shoot.png');
    this.load.image('shootBad', 'img/shootBad.png');
    this.load.image('ennemy', 'img/ennemy.png');
    this.load.image('ennemyBonus', 'img/ennemyBonus.png');
    this.load.image('ennemyBad', 'img/ennemyBad.png');
    this.load.image('gameOver', 'img/game_over.png');
    this.load.image('restartGame', 'img/restart.png');
    this.load.image('bonusSpeedShoot', 'img/bonusSpeedShoot.png');
    this.load.image('bonusSpeedShip', 'img/bonusSpeedShip.png');
    this.load.image('bonusAddShoot', 'img/bonusAddShoot.png');

    this.load.audio('soundShipShoot', 'sound/shipShoot.wav');
    this.load.audio('soundDestroyEnnemy', 'sound/destroyEnnemy.wav');
}

// initialisation variables, affichages...
function create() {
    //initialize variables
    startGame = new Date().getTime();
    instance = this;
    numberOfShoots = 1;
    startShoot = 0;
    badShootStart = 0;
    spatialShip = null;
    speedSpatialShip = 5;
    ennemies = null;
    ennemiesBonus = null;
    ennemiesBad = null;
    bonus = null;
    waitShoot = waitShootStart;
    speedShoot = speedShootStart;

    // display all the score of the database
    ReadData();

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

    // create group of differents shoots
    shoots = this.physics.add.group();
    shootsBad = this.physics.add.group();

    // create group of differents ennemies
    ennemies = instance.physics.add.group();
    ennemiesBonus = instance.physics.add.group();
    ennemiesBad = instance.physics.add.group();
    bonus = instance.physics.add.group();
}

// add row of ennemies x times
function AddEnnemy() {
    genereEnnemies = instance.time.addEvent({
        delay: 3000,
        callback: newRowOfEnnemies,
        callbackScope: instance,
        loop: true
    });
}

// create X ennemies while it's not endgame
function newRowOfEnnemies() {
    if (spatialShip.alive) {
        // check number of ennemies bonus by row
        var elementBonus = new Array(bonus);
        for (let index = 0; index < Phaser.Math.Between(1, 6); index++) {
            elementBonus.push(Phaser.Math.Between(1, 6));
        }

        for (let i = 0; i < 6; i++) {
            // if the cell correspond to a bonusEnnemy
            if (elementBonus.includes(i)) {
                // add an ennemy bonus
                ennemiesBonus.create(170 + (50 * i), 50, 'ennemyBonus');
            } else {
                // add an ennemy
                ennemies.create(170 + (50 * i), 50, 'ennemy');
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

        // bad ennemy shoot
        BadEnnemyShoot();

        //  colliders
        // between ennemies and spatial ship
        this.physics.add.collider(spatialShip, ennemies, GameOver, null, this);
        this.physics.add.collider(spatialShip, ennemiesBonus, GameOver, null, this);
        this.physics.add.collider(spatialShip, ennemiesBad, GameOver, null, this);

        // between shoot ennemies and spatial ship
        this.physics.add.collider(spatialShip, shootsBad, GameOver, null, this);

        // between spatial ship and bonus
        this.physics.add.collider(spatialShip, bonus, GainBonus, null, this);

        // between spatial ship shoot and ennemies
        this.physics.add.collider(shoots, ennemiesBad, GainPoint, null, this);
        this.physics.add.collider(shoots, ennemiesBonus, GainPoint, null, this);
        this.physics.add.collider(shoots, ennemies, GainPoint, null, this);

        // between bounds and ennemies/shoot/bonus
        ColliderBetweenEnnemyAndBound();
        ColliderBetweenShootAndBound();
        ColliderBetweenBonusAndBound();
    }
}

// when a bad ennemy shoot
function BadEnnemyShoot() {
    //check if a bad ennemy exist
    var isExist = false;
    ennemiesBad.children.iterate(function (el) {
        isExist = true;
    });

    // if a bad ennemy exist
    if (isExist) {
        // check if the laps time is passed
        badShootEnd = new Date().getTime();
        if (badShootEnd > badShootStart + 2000) {
            badShootStart = new Date().getTime();

            // create a shoot foreach bad ennemy
            ennemiesBad.children.iterate(function (el) {
                shootsBad.create(el.x, el.y + (30), 'shootBad');
            });

            // sprite go to the down
            shootsBad.setVelocityY(200);
        }
    }

}

// when the ship touch the bonus
function GainBonus(ship, bonus) {
    ship.setVelocityY(0);

    // get which bonus is touch
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

    // disable the bonus
    bonus.destroy();
}

// when the bonus is a speed shoot
function BonusSpeedShoot() {
    speedShoot = speedShoot + 200;
    if (speedShoot == speedShootStart + 500 && waitShoot != 500) {
        waitShoot = waitShoot - 200;
    }
}

// when the bonus is an add shoot
function BonusAddShoot() {
    if (numberOfShoots < 4) {
        numberOfShoots += 1;
    }
}

// when the bonus is a speed ship
function BonusSpeedShip() {
    speedSpatialShip += 1;
}

// when a shoot touch the up bound
function ColliderBetweenShootAndBound() {
    // if the shoot touch the bound
    shoots.children.iterate(function (sh) {
        if (sh != undefined) {
            if (sh.y <= 10) {
                // disable the shoot
                sh.destroy();
            }
        }

    });

    // if the shoot touch the bound
    shootsBad.children.iterate(function (sh) {
        if (sh != undefined) {
            if (sh.y >= height - 10) {
                // disable the shoot
                sh.destroy();
            }
        }

    });
}

// when a bonus touch the down bound
function ColliderBetweenBonusAndBound() {
    // if the bonus touch the bound
    bonus.children.iterate(function (bo) {
        if (bo != undefined) {
            if (bo.y >= height - 10) {
                // disable the bonus
                bo.destroy();
            }
        }
    });
}

// when an ennemy touch the down bound
function ColliderBetweenEnnemyAndBound() {

    var isGameOver = false;

    // if an ennemy touch the bound
    ennemies.children.iterate(function (el) {
        if (el.y >= height - 10) {
            isGameOver = true;
        }
    });

    // if an ennemy bonus touch the bound
    ennemiesBonus.children.iterate(function (el) {
        if (el.y >= height - 10) {
            isGameOver = true;
        }
    });

    // if an ennemy bonus touch the bound
    ennemiesBad.children.iterate(function (el) {
        if (el.y >= height - 10) {
            isGameOver = true;
        }
    });

    if (isGameOver) {
        // game over
        GameOver();
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
        bonus.setVelocityY(400);

        // add 2 to the score
        score += 2;

    } else if (ennemy.texture.key == "ennemyBad") {
        // add 3 to the score
        score += 3;
    } else {
        // add 3 to the score
        score += 1;
    }
    instance.sound.play('soundDestroyEnnemy');


    // disable shoot and ennemy touch
    shoot.destroy();
    ennemy.destroy();

    // set the score
    scoreText.setText(score);
}

// check if the ship touch an ennemy
function GameOver() {
    // add the image gameover
    gameOver = instance.physics.add.sprite(300, 200, 'gameOver');

    // add the image restart
    restartGame = instance.physics.add.sprite(300, 450, 'restartGame');
    restartGame.setInteractive();

    // block the movements of the spatial ship
    spatialShip.alive = false;

    // display the score
    let style = { font: 'bold 30px Arial', fill: '#0000ff' };
    scoreText = instance.add.text(230, 320, "SCORE : " + score, style);

    // disable all ennemies
    ennemies.children.iterate(function (el) {
        el.disableBody(true, true);
    });
    ennemies.children.iterate(function (el) {
        if (el != undefined) {
            el.destroy();
        }
    });
    ennemiesBonus.children.iterate(function (el) {
        el.disableBody(true, true);
    });
    ennemiesBonus.children.iterate(function (el) {
        if (el != undefined) {
            el.destroy();
        }
    });
    ennemiesBad.children.iterate(function (el) {
        el.disableBody(true, true);
    });
    ennemiesBad.children.iterate(function (el) {
        if (el != undefined) {
            el.destroy();
        }
    });

    // disable all Bonus
    bonus.children.iterate(function (bo) {
        bo.disableBody(true, true);
    });
    bonus.children.iterate(function (bo) {
        if (bo != undefined) {
            bo.destroy();
        }
    });

    //disable all shoots
    shoots.children.iterate(function (sh) {
        sh.disableBody(true, true);
    });
    shoots.children.iterate(function (sh) {
        if (sh != undefined) {
            sh.destroy();
        }
    });
    shootsBad.children.iterate(function (sh) {
        sh.disableBody(true, true);
    });
    shootsBad.children.iterate(function (sh) {
        if (sh != undefined) {
            sh.destroy();
        }
    });

    // disable the spatial ship
    spatialShip.destroy();

    AddScore();

    // if click on the restart image, restart the game
    instance.input.on('gameobjectdown', function () { instance.scene.restart(); });
}

// add the score to database and display it
function AddScore() {
    // get the time that the person play
    var timePlay = GetTimePlay();

    // get the person who play
    var person = GetPerson();

    // add the score of the person to the database
    AddData(person, timePlay, score);

    // read all the score of the database
    ReadData();
}

// get the person who play
function GetPerson() {
    // create a prompt asking the name of the person
    var person = prompt("Please enter your name", "Anonymous");

    // if the person has not enter a name
    if (person == null || person == "") {
        person = "Anonymous"
    }

    return person;
}

// get the time that the person play
function GetTimePlay() {
    // get when the person loose
    var endGame = new Date().getTime();

    // get total seconds between the times
    var delta = Math.abs(endGame - startGame) / 1000;

    // calculate (and subtract) whole days
    var days = Math.floor(delta / 86400);
    delta -= days * 86400;

    // calculate (and subtract) whole hours
    var hours = parseInt(Math.floor(delta / 3600) % 24);
    delta -= hours * 3600;

    // calculate (and subtract) whole minutes
    var minutes = parseInt(Math.floor(delta / 60) % 60);
    delta -= minutes * 60;

    // what's left is seconds
    var seconds = parseInt(delta % 60);

    // create the string to send to database
    var timePlay = "";
    if (hours != 0) {
        timePlay += hours + "h ";
    }
    if (minutes != 0) {
        timePlay += minutes + "m ";
    }
    timePlay += seconds + "s ";

    return timePlay;
}

// add the score of the person to the database
function AddData(person, timePlay, score) {
    // send the data to database
    db.collection("scores").add({
        name: person,
        timePlay: timePlay,
        score: score
    })
        .then(function (docRef) {
            console.log("Document written with ID: ", docRef.id);
        })
        .catch(function (error) {
            console.error("Error adding document: ", error);
        });
}

// read all the score of the database and display it
function ReadData() {
    // remove the tbody already existing
    $("#displayScore").remove();

    // create a new tbody empty
    var tbody = '<tbody id="displayScore"></tbody>';
    $("#scores").append(tbody);

    var count = 1;
    // read all the data of database and display it in the tbody
    db.collection("scores").orderBy("score", "desc").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            if (doc != null) {
                var datas = doc.data();
                var result = "";
                result += '<tr><th scope="row">' + count + '</th>';
                result += '<td>' + datas.name + '</td>';
                result += '<td>' + datas.timePlay + '</td>';
                result += '<td>' + datas.score + '</td>';
                result += '</tr>';

                count++;
                $("#displayScore").append(result);
            }
        });
    });
}

// when the ship shoot
function Shooting() {
    // if key space is down
    if (cursors.space.isDown) {
        endShoot = new Date().getTime();
        // if 200ms are passed since next time ship shoot
        if (endShoot > startShoot + waitShoot) {
            startShoot = new Date().getTime();
            // add a sprite shoot
            for (let i = 0; i < numberOfShoots; i++) {
                shoots.create(spatialShip.x - (10 * i), spatialShip.y - (30), 'shoot');
                instance.sound.play('soundShipShoot');
            }
            // sprite go to the up
            shoots.setVelocityY(-speedShoot);
        }
    }
}

// move the spatial ship
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