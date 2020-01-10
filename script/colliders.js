import { GameOver } from './gameover.js'

// when a shoot touch the up bound
export function ColliderBetweenShootAndBound(shoots,shootsBad,height) {
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
export function ColliderBetweenBonusAndBound(bonus,height) {
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
export function ColliderBetweenEnnemyAndBound(gameOver,
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
                                            height,
                                            startGame,
                                            db) {

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
        return GameOver(gameOver,restartGame,spatialShip,scoreText,score,ennemies,ennemiesBonus,ennemiesBad,bonus,shoots,shootsBad,instance,startGame,db);
    }
}
