// on charge images & sons
export function LoadImage(instance){
    instance.load.image('spatialShip', 'img/spatialShip.png');
    instance.load.image('shoot', 'img/shoot.png');
    instance.load.image('shootBad', 'img/shootBad.png');
    instance.load.image('ennemy', 'img/ennemy.png');
    instance.load.image('ennemyBonus', 'img/ennemyBonus.png');
    instance.load.image('ennemyBad', 'img/ennemyBad.png');
    instance.load.image('gameOver', 'img/game_over.png');
    instance.load.image('restartGame', 'img/restart.png');
    instance.load.image('bonusSpeedShoot', 'img/bonusSpeedShoot.png');
    instance.load.image('bonusSpeedShip', 'img/bonusSpeedShip.png');
    instance.load.image('bonusAddShoot', 'img/bonusAddShoot.png');
    instance.load.image('heart', 'img/heart.png');
}

export function LoadAudio(instance){
    instance.load.audio('soundShipShoot', 'sound/shipshoot.wav');
    instance.load.audio('soundDestroyEnnemy', 'sound/destroyEnnemy.wav');
    instance.load.audio('soundGainBonus', 'sound/gainBonus.wav');
}