/**
 * Handles collectible logic such as coins and bottle pickups,
 * including collision detection and HUD updates.
 */

/**
 * Checks collisions between the character and all coins.
 * Removes collected coins, updates counters and plays sound.
 *
 * @this {World}
 */
World.prototype.checkCollisionCharacterCoin = function () {
    this.level.coins.forEach((coin, index) => {
        if (!this.character.isColliding(coin)) return;

        this.level.coins.splice(index, 1);
        this.character.coinsCollected++;
        this.updateCoinBar();
        this.soundManager?.playCoinSound?.();
    });
};

/**
 * Checks collisions between the character and collectible bottles.
 * Picked-up bottles are removed from the level.
 *
 * @this {World}
 */
World.prototype.checkCollisionCharacterBottle = function () {
    this.level.bottles = this.level.bottles.filter((bottle) => {
        if (!this.isBottlePickupCollision(bottle)) return true;
        this.handleBottlePickup();
        return false;
    });
};

/**
 * Returns the effective collision hitbox of the character.
 * The hitbox is intentionally smaller than the sprite.
 *
 * @returns {{left:number,right:number,top:number,bottom:number}}
 * @this {World}
 */
World.prototype.getCharacterHitbox = function () {
    const left = this.character.x + 60;
    const right = this.character.x + 60 + this.character.width - 105;
    const top = this.character.y + 130;
    const bottom = this.character.y + this.character.height;
    return { left, right, top, bottom };
};

/**
 * Returns the effective collision hitbox of a bottle.
 * Supports optional collision offsets and custom hitbox sizes.
 *
 * @param {*} bottle
 * @returns {{left:number,right:number,top:number,bottom:number}}
 */
World.prototype.getBottleHitbox = function (bottle) {
    const offsetX = bottle.collisionOffsetX || 0;
    const offsetY = bottle.collisionOffsetY || 0;
    const width = bottle.collisionWidth || bottle.width;
    const height = bottle.collisionHeight || bottle.height;

    const left = bottle.x + offsetX;
    const top = bottle.y + offsetY;
    const right = left + width;
    const bottom = top + height;

    return { left, right, top, bottom };
};

/**
 * Checks whether the character collides with a bottle pickup.
 *
 * @param {*} bottle
 * @returns {boolean}
 * @this {World}
 */
World.prototype.isBottlePickupCollision = function (bottle) {
    const c = this.getCharacterHitbox();
    const b = this.getBottleHitbox(bottle);

    return (
        c.right > b.left &&
        c.bottom > b.top &&
        c.left < b.right &&
        c.top < b.bottom
    );
};

/**
 * Applies logic when a bottle is picked up:
 * increases ammo, clamps values, updates HUD and plays sound.
 *
 * @this {World}
 */
World.prototype.handleBottlePickup = function () {
    this.bottlesAmmo++;
    this.bottlesAmmo = this.clampAmmo(this.bottlesAmmo, this.maxBottlesInLevel);

    if (typeof this.character.bottlesCollected === 'number') {
        this.character.bottlesCollected++;
    }

    this.updateBottleBar();
    this.sound?.playBottlePickup?.();
};

/**
 * Clamps the bottle ammo value between 0 and the maximum allowed.
 *
 * @param {number} ammo
 * @param {number} max
 * @returns {number}
 */
World.prototype.clampAmmo = function (ammo, max) {
    if (max <= 0) return Math.max(0, ammo);
    return Math.max(0, Math.min(ammo, max));
};