/**
 * Handles rendering of the game world and HUD elements
 * using the canvas rendering context.
 */

/**
 * Main render loop.
 * Clears the canvas, renders the world and HUD,
 * and schedules the next frame if the game is still running.
 *
 * @this {World}
 */
World.prototype.draw = function () {
    this.clearCanvas();
    this.drawWorldLayer();
    this.drawHudLayer();
    if (!this.gameOver) requestAnimationFrame(() => this.draw());
};

/**
 * Clears the entire canvas before the next render cycle.
 *
 * @this {World}
 */
World.prototype.clearCanvas = function () {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
};

/**
 * Draws all world-related objects with camera offset applied
 * (backgrounds, enemies, collectibles, character, projectiles).
 *
 * @this {World}
 */
World.prototype.drawWorldLayer = function () {
    this.ctx.translate(this.camera_x, 0);

    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.bottles);
    this.addObjectsToMap(this.level.enemies);

    this.addToMap(this.character);
    this.addObjectsToMap(this.throwableObjects);

    this.ctx.translate(-this.camera_x, 0);
};

/**
 * Draws all HUD elements (status bars) without camera offset.
 *
 * @this {World}
 */
World.prototype.drawHudLayer = function () {
    this.addToMap(this.statusBar);
    this.addToMap(this.statusBarBoss);
    this.addToMap(this.statusBarBottle);
    this.addToMap(this.statusBarCoin);
};

/**
 * Draws an array of drawable objects to the canvas.
 * Safely ignores non-array inputs.
 *
 * @param {Array} objects
 * @this {World}
 */
World.prototype.addObjectsToMap = function (objects) {
    if (!Array.isArray(objects)) return;
    objects.forEach((o) => this.addToMap(o));
};

/**
 * Draws a single drawable object, applying horizontal
 * flipping when required.
 *
 * @param {DrawableObject} mo
 * @this {World}
 */
World.prototype.addToMap = function (mo) {
    if (mo.otherDirection) this.flipImage(mo);
    mo.draw(this.ctx);
    if (mo.otherDirection) this.flipImageBack(mo);
};

/**
 * Applies horizontal flip transformation for rendering.
 *
 * @param {DrawableObject} mo
 * @this {World}
 */
World.prototype.flipImage = function (mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
};

/**
 * Restores the canvas state after a flipped draw operation.
 *
 * @param {DrawableObject} mo
 * @this {World}
 */
World.prototype.flipImageBack = function (mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
};