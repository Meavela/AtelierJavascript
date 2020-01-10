// add row of ennemies x times
export function AddEnnemy(instance,genereEnnemies,spatialShip,bonus,ennemiesBonus,ennemies) {
    genereEnnemies = instance.time.addEvent({
        delay: 3000,
        callback: newRowOfEnnemies,
        args: [spatialShip,bonus,ennemiesBonus,ennemies],
        callbackScope: instance,
        loop: true
    });

    return genereEnnemies;
}

// when a bad ennemy shoot
export function BadEnnemyShoot(ennemiesBad,badShootEnd,badShootStart,shootsBad) {
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
            shootsBad.setVelocityY(400);

            return badShootStart;
        }
    }
    return null;
}


// create X ennemies while it's not endgame
function newRowOfEnnemies(spatialShip,bonus,ennemiesBonus,ennemies) {
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
