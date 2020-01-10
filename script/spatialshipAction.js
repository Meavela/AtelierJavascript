// when the ship shoot
export function Shooting(cursors,startShoot,waitShoot,numberOfShoots,spatialShip,shoots,instance,speedShoot,endShoot) {
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

            
            return [startShoot, endShoot];
        }
        return [null,endShoot];
    }

    return null;
}

// move the spatial ship
export function Move(cursors,spatialShip,speedSpatialShip) {
    // if key left is down
    if (cursors.left.isDown) {
        spatialShip.x -= speedSpatialShip;
    }
    // if key right is down
    if (cursors.right.isDown) {
        spatialShip.x += speedSpatialShip;
    }
}