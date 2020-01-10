import { AddData, ReadData } from './bdd.js';

// check if the ship touch an ennemy
export function GameOver(gameOver,
                        restartGame,
                        spatialShip,
                        scoreText,
                        score,
                        ennemies,
                        ennemiesBonus,
                        ennemiesBad,
                        bonus,
                        shoots,
                        shootsBad,
                        instance,
                        startGame,
                        db) {
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

    AddScore(startGame,score,db);

    // if click on the restart image, restart the game
    instance.input.on('gameobjectdown', function () { instance.scene.restart(); });

    return instance;
}

// add the score to database and display it
function AddScore(startGame,score,db) {
    // get the time that the person play
    var timePlay = GetTimePlay(startGame);

    // get the person who play
    var person = GetPerson();

    // add the score of the person to the database
    AddData(person, timePlay, score, db);

    // read all the score of the database
    ReadData(db);
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
function GetTimePlay(startGame) {
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
