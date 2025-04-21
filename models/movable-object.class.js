/**
 * Class representing all movable objects in the game.
 * Extends DrawableObject with movement, gravity, collision detection, and animation.
 */
class MovableObject extends DrawableObject {
    /**
     * Horizontal movement speed.
     * @type {number}
     */
    speed = 0.15;
    /**
     * Indicates if the object is facing the other direction (mirrored).
     * @type {boolean}
     */
    otherDirection = false;
    /**
     * Vertical speed, used for jumping and falling.
     * @type {number}
     */
    speedY = 0;
    /**
     * Acceleration affecting vertical movement (gravity).
     * @type {number}
     */ 
    acceleration = 2.5;
    /**
     * Energy of the object, used for health status.
     * @type {number}
     */
    energy = 100;
    /**
     * Timestamp of the last hit.
     * @type {number}
     */
    lastHit = 0;
    /**
     * Applies gravity to the object, making it fall when not on the ground.
     */
    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25);
    }
    /**
     * Checks if the object is above the ground.
     * @returns {boolean} True if above ground.
     */
    isAboveGround() {
        if (this instanceof ThrowableObject) { // Throwable object should always fall
            return true;
        } else {
            return this.y < 180;
        }
    }
    /**
     * Checks collision with another movable object.
     * @param {MovableObject} mo - The other movable object.
     * @returns {boolean} True if colliding. character.isColliding(chicken); 
     */
    isColliding(mo) {
        return this.x + this.width > mo.x &&
            this.y + this.height > mo.y &&
            this.x < mo.x &&
            this.y < mo.y + mo.height;
    }
    /**
     * Reduces energy when hit and records the time of the hit.
     */
    hit() {
        this.energy -= 5;
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }
    /**
     * Checks if the object is currently hurt.
     * @returns {boolean} True if the object is recently hit.
     */
    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit; // Difference in ms
        timepassed = timepassed / 1000; // Difference in s
        return timepassed < 1;
    }
    /**
     * Checks if the object is dead (energy = 0).
     * @returns {boolean} True if dead.
     */
    isDead() {
        return this.energy == 0;
    }
    /**
     * Plays an animation by switching images from a list.
     * @param {string[]} images - Array of image paths.
     */
    playAnimation(images) {
        let i = this.currentImage % images.length; // let i = 7 % 6; =>  1, Rest 1 
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }
    /**
     * Moves the object to the right.
     */
    moveRight() {
        this.x += this.speed;
    }
    /**
     * Moves the object to the left.
     */
    moveLeft() {
        this.x -= this.speed;
    }
    /**
     * Makes the object jump by setting a positive vertical speed.
     */
    jump() {
        this.speedY = 30;
    }
}