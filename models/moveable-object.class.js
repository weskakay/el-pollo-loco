/**
 * @fileoverview Defines the {@link MoveableObject} class.
 * Extends {@link DrawableObject} with physics-based properties such as
 * movement, gravity, collisions, and basic animation handling.
 *
 * This class serves as the foundation for all moveable entities,
 * including {@link Character}, {@link Chicken}, {@link Endboss}, and {@link ThrowableObject}.
 *
 * @extends DrawableObject
 * @see DrawableObject
 * @see Character
 * @see World
 * 
 * @author KW
 * @version 1.1.0
 */

/**
 * Class representing all moveable objects in the game.
 * Provides shared logic for gravity, collision detection,
 * movement, and sprite animation.
 *
 * @class MoveableObject
 * @extends DrawableObject
 */
class MoveableObject extends DrawableObject {
    /**
     * Horizontal movement speed in pixels per frame.
     * @type {number}
     */
    speed = 0.15;

    /**
     * Indicates if the object is facing the opposite direction (mirrored horizontally).
     * @type {boolean}
     */
    otherDirection = false;

    /**
     * Vertical speed, used for jumping and falling physics.
     * @type {number}
     */
    speedY = 0;

    /**
     * Acceleration factor applied to vertical movement (gravity).
     * @type {number}
     */ 
    acceleration = 2.6;

    /**
     * Current health or energy value of the object.
     * @type {number}
     */
    energy = 100;

    /**
     * Timestamp (in ms) of the last registered hit.
     * Used for temporary invulnerability or damage feedback.
     * @type {number}
     */
    lastHit = 0;

    /**
     * Ground level in pixels used for vertical snapping when landing.
     * @type {number}
     */
    groundY = 180;

    /**
     * Applies gravity to the object, causing it to fall when above ground.
     * Gravity continuously decreases vertical speed (`speedY`) until the object lands.
     * When landing, the object is snapped back to the configured ground level.
     *
     * @returns {void}
     */
    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;

                if (!this.isAboveGround() && this.speedY < 0 && !(this instanceof ThrowableObject)) {
                    this.y = this.groundY;
                    this.speedY = 0;
                }
            }
        }, 1000 / 25);
    }

    /**
     * Determines whether the object is above the ground.
     * Throwable objects are always considered above ground.
     *
     * @returns {boolean} True if the object is above ground, otherwise false.
     */
    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return true;
        } else {
            return this.y < this.groundY;
        }
    }

    /**
     * Checks whether this object is colliding with another moveable object.
     * Collision boxes differ slightly for the {@link Character} to match the sprite shape.
     *
     * @param {MoveableObject} mo - The other moveable object to test against.
     * @returns {boolean} True if the two objects are overlapping (collision detected).
     */
    isColliding(mo) {
        if (this instanceof Character) {
            return (
                this.x + 60 + this.width - 105 > mo.x &&
                this.y + this.height > mo.y &&
                this.x + 60 < mo.x + mo.width &&
                this.y + 130 < mo.y + mo.height
            );
        } else {
            return (
                this.x + this.width > mo.x &&
                this.y + this.height > mo.y &&
                this.x < mo.x + mo.width &&
                this.y < mo.y + mo.height
            );
        }
    }

    /**
     * Reduces the object's energy when hit and records the timestamp.
     * Triggers the hurt sound effect from the active world instance.
     *
     * @returns {void}
     */
    hit() {
        this.energy -= 10;
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
        this.world.sound.playHurt();
    }

    /**
     * Determines whether the object was recently hit (within the last second).
     * Useful for flashing effects or temporary invulnerability.
     *
     * @returns {boolean} True if the object was hit within the last second.
     */
    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 1000;
        return timepassed < 1;
    }

    /**
     * Checks if the object is dead (i.e., its energy has reached zero).
     *
     * @returns {boolean} True if the object has no remaining energy.
     */
    isDead() {
        return this.energy === 0;
    }

    /**
     * Plays an animation by cycling through an array of image paths.
     * Updates the current frame index each call to simulate motion.
     *
     * @param {string[]} images - Array of image paths used as animation frames.
     * @returns {void}
     */
    playAnimation(images) {
        const i = this.currentImage % images.length;
        const path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    /**
     * Moves the object to the right based on its horizontal speed.
     *
     * @returns {void}
     */
    moveRight() {
        this.x += this.speed;
    }

    /**
     * Moves the object to the left based on its horizontal speed.
     *
     * @returns {void}
     */
    moveLeft() {
        this.x -= this.speed;
    }
}