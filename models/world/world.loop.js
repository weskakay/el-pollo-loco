/**
 * Controls the main game loop and update cycle of the World.
 */

/**
 * Starts the main game loop running at ~60 FPS.
 * The loop is paused automatically when the game is over.
 *
 * @this {World}
 */
World.prototype.run = function () {
    this.runIntervalId = setInterval(() => {
        if (this.gameOver) return;
        this.tick();
    }, 1000 / 60);
};

/**
 * Stops the active game loop.
 * Used when resetting or switching levels to avoid multiple loops.
 *
 * @this {World}
 */
World.prototype.stopRunLoop = function () {
    if (this.runIntervalId) clearInterval(this.runIntervalId);
    this.runIntervalId = null;
};

/**
 * Executes one update cycle of the game.
 * Handles all gameplay logic such as collisions,
 * input handling, enemy behavior and win/lose conditions.
 *
 * @this {World}
 */
World.prototype.tick = function () {
    this.checkChickenKills();
    this.checkCollisions();
    this.handleThrowInput();
    this.checkCollisionCharacterCoin();
    this.checkCollisionCharacterBottle();
    this.checkEndbossActivation();
    this.checkBottleHitsEndboss();
    this.checkEndbossDead();
    this.checkCharacterDead();
};