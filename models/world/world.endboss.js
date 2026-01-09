/**
 * Handles endboss logic (activation, hits, death handling)
 * and game overlays (win/lose screens).
 */

/**
 * Removes a defeated endboss from the enemy list after a delay.
 *
 * @param {Endboss} endboss
 * @param {number} delayMs
 * @this {World}
 */
World.prototype.removeEndbossAfterDelay = function (endboss, delayMs) {
    setTimeout(() => {
        this.level.enemies = this.level.enemies.filter(e => e !== endboss);
    }, delayMs);
};

/**
 * Stops all active boss/background sounds after winning
 * and plays the win jingle once.
 *
 * @this {World}
 */
World.prototype.stopAllSoundsOnWin = function () {
    if (!this.soundManager) return;
    this.soundManager.stopEndbossSounds?.();
    this.soundManager.backgroundMusic?.pause();
    this.soundManager.playGameWin?.();
};

/**
 * Activates endbosses when the character approaches them.
 *
 * @this {World}
 */
World.prototype.checkEndbossActivation = function () {
    this.level.enemies.forEach(enemy => {
        if (!(enemy instanceof Endboss)) return;
        if (!this.shouldActivateEndboss(enemy)) return;
        this.activateEndboss(enemy);
    });
};

/**
 * Checks if an endboss should start its first-contact behavior.
 *
 * @param {Endboss} enemy
 * @returns {boolean}
 */
World.prototype.shouldActivateEndboss = function (enemy) {
    const distance = Math.abs(this.character.x - enemy.x);
    return distance < 600 && !enemy.hadFirstContact;
};

/**
 * Triggers the endboss "first contact" state and attack animation.
 *
 * @param {Endboss} enemy
 * @this {World}
 */
World.prototype.activateEndboss = function (enemy) {
    enemy.hadFirstContact = true;
    this.playEndbossAlertOnce(enemy);
    enemy.i = 5;
    enemy.endBossAnimation();
    this.soundManager?.playEndbossAttack?.();
};

/**
 * Plays the endboss alert sound only once per endboss instance.
 *
 * @param {Endboss} enemy
 * @this {World}
 */
World.prototype.playEndbossAlertOnce = function (enemy) {
    if (!this.soundManager || enemy._alertPlayedOnce) return;
    this.soundManager.playEndbossAlert();
    enemy._alertPlayedOnce = true;
};

/**
 * Checks if thrown bottles hit an endboss and applies damage.
 *
 * @this {World}
 */
World.prototype.checkBottleHitsEndboss = function () {
    this.throwableObjects.forEach((bottle) => {
        this.level.enemies.forEach((enemy) => {
            if (!(enemy instanceof Endboss)) return;
            if (enemy.isDeadEndBoss() || !bottle.isColliding(enemy)) return;

            enemy.hitEndBoss();
            this.statusBarBoss.setPercentage(enemy.energyEndBoss);
            this.throwableObjects.splice(this.throwableObjects.indexOf(bottle), 1);
        });
    });
};

/**
 * Returns all endboss instances in the current level.
 *
 * @returns {Endboss[]}
 */
World.prototype.getAllEndbosses = function () {
    return this.level.enemies.filter(e => e instanceof Endboss);
};

/**
 * Handles endboss death flow and triggers win screen
 * once all endbosses are defeated.
 *
 * @this {World}
 */
World.prototype.checkEndbossDead = function () {
    const endbosses = this.getAllEndbosses();
    if (endbosses.length === 0) return;

    const anyNewlyDead = this.handleDeadEndbosses(endbosses);
    if (!anyNewlyDead) return;
    if (!this.areAllEndbossesDead(endbosses)) return;

    this.stopAllSoundsOnWin();
    setTimeout(() => this.showWinScreen(), 800);
};

/**
 * Marks newly defeated endbosses and schedules their removal.
 *
 * @param {Endboss[]} endbosses
 * @returns {boolean} True if at least one endboss was newly detected as dead.
 * @this {World}
 */
World.prototype.handleDeadEndbosses = function (endbosses) {
    let anyNewlyDead = false;

    endbosses.forEach((endboss) => {
        if (!this.isEndbossNewlyDead(endboss)) return;
        this.markEndbossDeadHandled(endboss);
        this.removeEndbossAfterDelay(endboss, 1000);
        this.soundManager?.stopEndbossSounds?.();
        anyNewlyDead = true;
    });

    return anyNewlyDead;
};

/**
 * Checks whether an endboss is dead and has not been handled yet.
 *
 * @param {Endboss} endboss
 * @returns {boolean}
 */
World.prototype.isEndbossNewlyDead = function (endboss) {
    const isDeadFn = endboss.isDeadEndBoss?.bind(endboss);
    const isDead = typeof isDeadFn === 'function' ? isDeadFn() : false;
    return isDead && !endboss.deathHandled;
};

/**
 * Marks an endboss death as handled and prepares its death animation state.
 *
 * @param {Endboss} endboss
 */
World.prototype.markEndbossDeadHandled = function (endboss) {
    endboss.deathHandled = true;
    endboss.currentImage = 0;
    endboss.deathAnimationStarted = true;
};

/**
 * Checks whether all endbosses are dead.
 *
 * @param {Endboss[]} endbosses
 * @returns {boolean}
 */
World.prototype.areAllEndbossesDead = function (endbosses) {
    return endbosses.every((endboss) => {
        const isDeadFn = endboss.isDeadEndBoss?.bind(endboss);
        return typeof isDeadFn === 'function' ? isDeadFn() : false;
    });
};

/**
 * Triggers the lose screen when the character has no energy left.
 *
 * @this {World}
 */
World.prototype.checkCharacterDead = function () {
    if (this.character?.energy <= 0 && !this.gameOver) {
        this.showLoseScreen();
    }
};

/**
 * Creates a full-screen overlay element (win/lose).
 *
 * @param {string} title
 * @param {string} subtitle
 * @param {string} color
 * @param {string} [icon=""]
 * @returns {HTMLDivElement}
 * @this {World}
 */
World.prototype.createGameOverlay = function (title, subtitle, color, icon = "") {
    const overlay = document.createElement("div");
    overlay.classList.add("overlay");
    overlay.innerHTML = this.getOverlayHtml(title, subtitle, color, icon);
    this.appendOverlay(overlay);
    return overlay;
};

/**
 * Builds the HTML content for an overlay box.
 *
 * @param {string} title
 * @param {string} subtitle
 * @param {string} color
 * @param {string} icon
 * @returns {string}
 */
World.prototype.getOverlayHtml = function (title, subtitle, color, icon) {
    const style = color ? `background-color:${color};` : "";
    const prefix = icon ? icon + " " : "";
    return `
        <div class="box" style="${style}">
        <div class="overlay-title">${prefix}${title}</div>
        <div class="overlay-subtitle">${subtitle}</div>
        </div>
    `;
};

/**
 * Appends an overlay to the stage (fallback: body).
 *
 * @param {HTMLDivElement} overlay
 */
World.prototype.appendOverlay = function (overlay) {
    const stage = document.getElementById("stage") || document.body;
    stage.appendChild(overlay);
};

/**
 * Builds the subtitle string for the win screen.
 *
 * @returns {string}
 * @this {World}
 */
World.prototype.getWinSubtitle = function () {
    const coinsTotal = this.maxCoinsInLevel || 0;
    const bottlesTotal = this.maxBottlesInLevel || 0;
    const coinsCollected = this.character.coinsCollected || 0;
    const bottlesCollected = this.character.bottlesCollected || 0;
    return `Coins: ${coinsCollected} / ${coinsTotal} · Bottles: ${bottlesCollected} / ${bottlesTotal}`;
};

/**
 * Shows the win overlay and optionally offers "Next Level".
 *
 * @this {World}
 */
World.prototype.showWinScreen = function () {
    this.gameOver = true;

    const overlay = this.createGameOverlay(
        "YOU WIN!",
        this.getWinSubtitle(),
        "rgba(0,0,0,0.8)",
        "🏆"
    );

    if (this.currentLevel === 1) {
        this.addNextLevelButton(overlay);
    }
};

/**
 * Adds a "Next Level" button to the win overlay.
 *
 * @param {HTMLDivElement} overlay
 * @this {World}
 */
World.prototype.addNextLevelButton = function (overlay) {
    const box = overlay.querySelector(".box");
    if (!box) return;

    const btn = document.createElement("button");
    btn.textContent = "Next Level";
    btn.classList.add("overlay-button");

    btn.addEventListener("click", () => {
        overlay.remove();
        this.switchToLevel(2);
        this.gameOver = false;
        this.draw();
    });

    box.appendChild(btn);
};

/**
 * Builds the subtitle string for the lose screen.
 *
 * @returns {string}
 * @this {World}
 */
World.prototype.getLoseSubtitle = function () {
    const coinsTotal = this.maxCoinsInLevel || 0;
    const bottlesTotal = this.maxBottlesInLevel || 0;
    const coinsCollected = this.character.coinsCollected || 0;
    const bottlesCollected = this.character.bottlesCollected || 0;
    return `Try again<br>Coins: ${coinsCollected} / ${coinsTotal} · Bottles: ${bottlesCollected} / ${bottlesTotal}`;
};

/**
 * Shows the lose overlay and plays game-over audio.
 *
 * @this {World}
 */
World.prototype.showLoseScreen = function () {
    this.gameOver = true;

    this.soundManager?.stopEndbossSounds?.();
    this.soundManager?.backgroundMusic?.pause();
    this.soundManager?.playGameOver?.();

    this.createGameOverlay(
        "YOU LOSE",
        this.getLoseSubtitle(),
        "rgba(0,0,0,0.8)",
        "❌"
    );
};