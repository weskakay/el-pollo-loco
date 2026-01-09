/**
 * Handles HUD-related logic such as status bars and level indicators.
 */

/**
 * Updates cached limits for bottles and coins
 * based on the current level configuration.
 *
 * @this {World}
 */
World.prototype.updateLevelLimits = function () {
    const level = this.level || {};
    this.maxBottlesInLevel = Array.isArray(level.bottles) ? level.bottles.length : 0;
    this.maxCoinsInLevel = Array.isArray(level.coins) ? level.coins.length : 0;
};

/**
 * Initializes the level indicator element inside the stage.
 * Creates it if it does not yet exist.
 *
 * @this {World}
 */
World.prototype.initLevelLabel = function () {
    const stage = document.getElementById('stage');
    if (!stage) return;
    this.levelLabelEl = this.getOrCreateLevelLabel(stage);
    this.updateLevelLabel();
};

/**
 * Returns an existing level label element or creates a new one.
 *
 * @param {HTMLElement} stage
 * @returns {HTMLDivElement}
 */
World.prototype.getOrCreateLevelLabel = function (stage) {
    let label = stage.querySelector('.level-indicator');
    if (label) return label;

    label = document.createElement('div');
    label.classList.add('level-indicator');
    stage.appendChild(label);
    return label;
};

/**
 * Updates the displayed level number in the HUD.
 *
 * @this {World}
 */
World.prototype.updateLevelLabel = function () {
    if (!this.levelLabelEl) return;
    this.levelLabelEl.textContent = `LVL ${this.currentLevel}`;
};

/**
 * Updates the coin status bar based on collected coins.
 *
 * @this {World}
 */
World.prototype.updateCoinBar = function () {
    if (!this.canSetPercentage(this.statusBarCoin)) return;
    this.statusBarCoin.setPercentage(
        this.computeProgressPercent(
            this.character.coinsCollected,
            this.maxCoinsInLevel
        )
    );
};

/**
 * Updates the bottle status bar based on remaining ammo.
 *
 * @this {World}
 */
World.prototype.updateBottleBar = function () {
    if (!this.canSetPercentage(this.statusBarBottle)) return;
    this.statusBarBottle.setPercentage(
        this.computeProgressPercent(
            this.bottlesAmmo,
            this.maxBottlesInLevel
        )
    );
};

/**
 * Checks whether a status bar supports percentage updates.
 *
 * @param {*} bar
 * @returns {boolean}
 */
World.prototype.canSetPercentage = function (bar) {
    return !!(bar && typeof bar.setPercentage === 'function');
};

/**
 * Calculates a percentage value (0–100) based on current and max values.
 * The result is safely clamped to avoid invalid percentages.
 *
 * @param {number} value
 * @param {number} max
 * @returns {number}
 */
World.prototype.computeProgressPercent = function (value, max) {
    if (max <= 0) return 0;
    const clamped = Math.max(0, Math.min(value || 0, max));
    return (clamped / max) * 100;
};