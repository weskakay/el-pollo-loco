/**
 * Handles collision logic between the character and enemies,
 * including stomp kills, damage handling and enemy removal.
 */

/**
 * Checks collisions between the character and all enemies
 * and applies the corresponding collision handling.
 *
 * @this {World}
 */
World.prototype.checkCollisions = function () {
    this.level.enemies.forEach((enemy) => {
        if (this.shouldSkipEnemyCollision(enemy)) return;
        if (!this.character.isColliding(enemy)) return;
        this.handleEnemyCollision(enemy);
    });
};

/**
 * Determines whether an enemy should be ignored for collision handling.
 * (e.g. already defeated enemies)
 *
 * @param {*} enemy
 * @returns {boolean}
 */
World.prototype.shouldSkipEnemyCollision = function (enemy) {
    if (this.isDeadChicken(enemy)) return true;
    if (this.isDeadEndboss(enemy)) return true;
    return false;
};

/**
 * Checks if an enemy is a defeated chicken (non-endboss).
 *
 * @param {*} enemy
 * @returns {boolean}
 */
World.prototype.isDeadChicken = function (enemy) {
    return !(enemy instanceof Endboss) && enemy.chickenIsDead;
};

/**
 * Checks if an enemy is an endboss that is already dead.
 *
 * @param {*} enemy
 * @returns {boolean}
 */
World.prototype.isDeadEndboss = function (enemy) {
    if (!(enemy instanceof Endboss)) return false;
    const isDeadFn = enemy.isDeadEndBoss?.bind(enemy);
    return typeof isDeadFn === 'function' ? isDeadFn() : false;
};

/**
 * Applies collision effects depending on the enemy type.
 *
 * @param {*} enemy
 * @this {World}
 */
World.prototype.handleEnemyCollision = function (enemy) {
    if (enemy instanceof Endboss) return this.applyEndbossCollision();
    this.applyChickenCollision(enemy);
};

/**
 * Applies endboss collision damage to the character.
 *
 * @this {World}
 */
World.prototype.applyEndbossCollision = function () {
    if (this.character.isHurt()) return;
    this.character.hitByEndboss();
    this.statusBar.setPercentage(this.character.energy);
};

/**
 * Applies collision logic for chicken-type enemies.
 * Damages the character if they are not currently hurt.
 * No damage is applied when falling from above or shortly after a stomp kill.
 *
 * @param {*} enemy
 * @this {World}
 */
World.prototype.applyChickenCollision = function (enemy) {
    // No damage when character is falling from above
    const isFalling = this.character.speedY < 0;
    const isAbove = this.character.isAboveGround();
    if (isFalling && isAbove) return;

    // No damage shortly after stomping an enemy
    if (this.character.isStompInvulnerable?.()) return;

    if (!this.character.isHurt()) {
        this.character.hit();
        this.statusBar.setPercentage(this.character.energy);
    }
};

/**
 * Checks if the character stomped on any alive chicken
 * and triggers the kill logic.
 * Dead characters cannot stomp enemies.
 *
 * @this {World}
 */
World.prototype.checkChickenKills = function () {
    if (this.character.isDead()) return;

    this.level.enemies.forEach((enemy) => {
        if (!this.isChickenAlive(enemy)) return;
        if (!this.isStompKill(enemy)) return;
        this.resolveChickenKill(enemy);
    });
};

/**
 * Checks whether an enemy is a living chicken (big or small).
 *
 * @param {*} enemy
 * @returns {boolean}
 */
World.prototype.isChickenAlive = function (enemy) {
    const isChicken = enemy instanceof Chicken || enemy instanceof SmallChicken;
    return isChicken && !enemy.chickenIsDead;
};

/**
 * Checks whether the current collision counts as a stomp kill.
 * Requires the character to be airborne, moving downward,
 * and landing on the enemy from above.
 *
 * @param {*} enemy
 * @returns {boolean}
 * @this {World}
 */
World.prototype.isStompKill = function (enemy) {
    const isAbove = this.character.isAboveGround();
    const isFalling = this.character.speedY < 0;

    // Use feet-based collision for stomp detection (no 130px offset)
    const char = this.character;
    const charLeft = char.x + 60;
    const charRight = char.x + char.width - 45;
    const charFeet = char.y + char.height;

    const enemyLeft = enemy.x;
    const enemyRight = enemy.x + enemy.width;
    const enemyTop = enemy.y;
    const enemyStompZone = enemy.y + enemy.height * 0.5;

    // Check horizontal overlap
    const horizontalOverlap = charRight > enemyLeft && charLeft < enemyRight;

    // Check if character feet are in the stomp zone (above enemy center)
    const feetInStompZone = charFeet >= enemyTop && charFeet <= enemyStompZone;

    if (!isAbove) return false;
    if (!isFalling) return false;
    if (!horizontalOverlap) return false;
    if (!feetInStompZone) return false;

    return true;
};

/**
 * Resolves a stomp kill: bounces the character,
 * plays the enemy death animation and removes the enemy after a short delay.
 *
 * @param {*} enemy
 * @this {World}
 */
World.prototype.resolveChickenKill = function (enemy) {
    this.character.bounceOnEnemy?.();
    enemy.playAnimationChickenDead();

    setTimeout(() => {
        this.level.enemies = this.level.enemies.filter(e => e !== enemy);
    }, 300);
};
