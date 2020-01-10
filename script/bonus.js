var speedShoot = 400;
var speedShootStart = 400;
var waitShoot = 700;
var numberOfShoots = 1;
var speedSpatialShip = 5;
var instance;

// when the ship touch the bonus
export function BonusIsCollide(spatialShip, bonus, Instance){
    instance = Instance;

    // between spatial ship and bonus
    Instance.physics.add.collider(spatialShip, bonus, GainBonus, null, Instance);

    return [speedShoot,numberOfShoots,speedSpatialShip];
}

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

    instance.sound.play('soundGainBonus');

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

