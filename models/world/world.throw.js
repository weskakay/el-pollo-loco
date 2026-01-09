/**
 * Handles bottle throwing logic including input detection,
 * cooldown handling and ammo consumption.
 */

/**
 * Checks throw input (rising edge) and spawns a bottle
 * if cooldown and ammo conditions are met.
 *
 * Uses a rising-edge check to prevent continuous throwing
 * while the key is held down.
 *
 * @this {World}
 */
World.prototype.handleThrowInput = function () {
    const now = Date.now();
    const rising = this.keyboard.THROW && !this.throwPressedPrev;
    const cooled = now - this.lastThrowAt >= this.throwCooldownMs;

    if (rising && cooled && this.bottlesAmmo > 0) {
        this.prepareCharacterForThrow();
        this.spawnBottle();
        this.consumeBottleAmmo();
        this.lastThrowAt = now;
    }

    this.throwPressedPrev = this.keyboard.THROW;
};

/**
 * Resets character idle/sleep states so throwing
 * works instantly even after inactivity.
 *
 * @this {World}
 */
World.prototype.prepareCharacterForThrow = function () {
    this.character.isSleeping = false;
    this.character.stopSnoreIfNecessary?.();
    this.character.resetStandingTime?.();
};

/**
 * Reduces bottle ammo by one and updates the HUD.
 *
 * @this {World}
 */
World.prototype.consumeBottleAmmo = function () {
    this.bottlesAmmo--;
    this.updateBottleBar();
};

/**
 * Spawns a throwable bottle at the character's hand position
 * depending on the facing direction.
 *
 * @this {World}
 */
World.prototype.spawnBottle = function () {
    const facingLeft = this.character.otherDirection === true;
    const handY = this.character.y + this.character.height * 0.45;
    const handX = this.getHandX(facingLeft);

    const bottle = new ThrowableObject(handX, handY);
    bottle.otherDirection = facingLeft;
    this.throwableObjects.push(bottle);

    this.sound?.playThrow?.();
};

/**
 * Calculates the horizontal spawn position of a thrown bottle
 * based on the character's facing direction.
 *
 * @param {boolean} facingLeft
 * @returns {number}
 */
World.prototype.getHandX = function (facingLeft) {
    return facingLeft
        ? this.character.x + this.character.width * 0.2
        : this.character.x + this.character.width * 0.8;
};