/**
 * @fileoverview Defines the {@link World} class.
 * The main game controller responsible for managing and rendering all entities
 * within the game world, including the player, enemies, collectibles, background,
 * and HUD elements. Handles collision detection, camera movement, object updates,
 * and win/lose conditions.
 *
 * @see Character
 * @see Level
 * @see StatusBar
 * @see SoundManager
 * @see Endboss
 * @see ThrowableObject
 * 
 * @author KW
 * @version 1.1.0
 */

/**
 * Class representing the game world.
 * Acts as the central logic hub, handling rendering, physics,
 * input, sound, collisions, and game state updates.
 *
 * @class World
 */
class World {
    /**
     * The main player character instance.
     * @type {Character}
     */
    character = new Character();

    /**
     * The current level instance.
     * @type {Level}
     */
    level = level1;

    /**
     * Tracks the current active level number.
     * 1 = Level 1, 2 = Level 2, ...
     * @type {number}
     */
    currentLevel = 1;

    /**
     * The canvas element used for rendering.
     * @type {HTMLCanvasElement}
     */
    canvas;

    /**
     * The 2D rendering context for the canvas.
     * @type {CanvasRenderingContext2D}
     */
    ctx;

    /**
     * The keyboard input handler.
     * @type {Keyboard}
     */
    keyboard;

    /**
     * The horizontal camera offset for side-scrolling.
     * @type {number}
     */
    camera_x = 0;

    /**
     * Flag indicating if the game is over.
     * @type {boolean}
     */
    gameOver = false;

    /**
     * Player’s health status bar.
     * @type {StatusBar}
     */
    statusBar = new StatusBar();

    /**
     * Endboss health status bar.
     * @type {StatusBarBoss}
     */
    statusBarBoss = new StatusBarBoss();

    /**
     * Player’s bottle status bar.
     * @type {StatusBarBottle}
     */
    statusBarBottle = new StatusBarBottle();

    /**
     * Player’s coin status bar.
     * @type {StatusBarCoin}
     */
    statusBarCoin = new StatusBarCoin();

    /**
     * Maximum number of coins that can be collected in the current level.
     * Used to map coin progress to the HUD percentage dynamically.
     * @type {number}
     */
    maxCoinsInLevel = 0;

    /**
     * Array of throwable objects currently active in the game (e.g., bottles).
     * @type {ThrowableObject[]}
     */
    throwableObjects = [];

    /**
     * Current number of bottles available to throw.
     * @type {number}
     */
    bottlesAmmo = 0;

    /**
     * Timestamp of the last bottle throw in milliseconds.
     * Used to enforce a throw cooldown.
     * @type {number}
     */
    lastThrowAt = 0;

    /**
     * Minimum delay between two throws in milliseconds.
     * @type {number}
     */
    throwCooldownMs = 300;

    /**
     * Tracks the previous pressed state of the throw key.
     * Used to detect a rising edge for THROW input.
     * @type {boolean}
     */
    throwPressedPrev = false;

    /**
     * Maximum number of bottles that can be collected in the current level.
     * Used to map bottle ammo to the HUD percentage dynamically.
     * @type {number}
     */
    maxBottlesInLevel = 0;

    /**
     * DOM element showing the current level (e.g. "LVL 1").
     * @type {HTMLDivElement | null}
     */
    levelLabelEl = null;

    /**
     * Handles all in-game audio playback.
     * @type {SoundManager}
     */
    sound = new SoundManager();

    /**
     * Creates a new {@link World} instance.
     *
     * @constructor
     * @param {HTMLCanvasElement} canvas - The canvas used for rendering.
     * @param {Keyboard} keyboard - The keyboard input controller.
     * @param {SoundManager} [soundManager] - Optional custom sound manager.
     */
    constructor(canvas, keyboard, soundManager) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.soundManager = soundManager || this.sound;
        this.updateLevelLimits();
        this.initLevelLabel();
        this.draw();
        this.setWorld();
        this.run();
    }

    /**
     * Updates max coin and bottle counts for the current level.
     *
     * @returns {void}
     */
    updateLevelLimits() {
        const level = this.level || {};
        this.maxBottlesInLevel = Array.isArray(level.bottles) ? level.bottles.length : 0;
        this.maxCoinsInLevel = Array.isArray(level.coins) ? level.coins.length : 0;
    }

    /**
     * Links the character instance to the current world context.
     *
     * @returns {void}
     */
    setWorld() {
        this.character.world = this;
    }

    /**
     * Creates or finds the small "LVL X" label in the stage.
     *
     * @returns {void}
     */
    initLevelLabel() {
        const stage = document.getElementById('stage');
        if (!stage) return;
        let label = stage.querySelector('.level-indicator');
        if (!label) {
            label = document.createElement('div');
            label.classList.add('level-indicator');
            stage.appendChild(label);
        }
        this.levelLabelEl = label;
        this.updateLevelLabel();
    }

    /**
     * Updates the level label text to match currentLevel.
     *
     * @returns {void}
     */
    updateLevelLabel() {
        if (!this.levelLabelEl) return;
        this.levelLabelEl.textContent = `LVL ${this.currentLevel}`;
    }

    /**
     * Starts the main game loop.
     *
     * @returns {void}
     */
    run() {
        setInterval(() => {
            if (this.gameOver) return;
            this.checkChickenKills();
            this.checkCollisions();
            this.handleThrowInput();
            this.checkCollisionCharacterCoin();
            this.checkCollisionCharacterBottle();
            this.checkEndbossActivation();
            this.checkBottleHitsEndboss();
            this.checkEndbossDead();
            this.checkCharacterDead();
        }, 1000 / 60);
    }

    /**
     * Handles throw input and enforces cooldown.
     *
     * @returns {void}
     */
    handleThrowInput() {
        const now = Date.now();
        const rising = this.keyboard.THROW && !this.throwPressedPrev;
        const cooled = now - this.lastThrowAt >= this.throwCooldownMs;
        if (rising && cooled && this.bottlesAmmo > 0) {
            this.character.isSleeping = false;
            this.character.stopSnoreIfNecessary?.();
            this.character.resetStandingTime?.();
            this.spawnBottle();
            this.bottlesAmmo--;
            this.updateBottleBar();
            this.lastThrowAt = now;
        }
        this.throwPressedPrev = this.keyboard.THROW;
    }

    /**
     * Spawns a new throwable bottle at Pepe's hand position.
     *
     * @returns {void}
     */
    spawnBottle() {
        const facingLeft = this.character.otherDirection === true;
        const handY = this.character.y + this.character.height * 0.45;
        const handX = facingLeft
            ? this.character.x + this.character.width * 0.2
            : this.character.x + this.character.width * 0.8;
        const bottle = new ThrowableObject(handX, handY);
        bottle.otherDirection = facingLeft;
        this.throwableObjects.push(bottle);
        if (this.sound && typeof this.sound.playThrow === 'function') {
            this.sound.playThrow();
        }
    }

    /**
     * Updates the coin status bar based on collected coins.
     *
     * @returns {void}
     */
    updateCoinBar() {
        if (!this.statusBarCoin || typeof this.statusBarCoin.setPercentage !== 'function') {
            return;
        }
        if (this.maxCoinsInLevel <= 0) {
            this.statusBarCoin.setPercentage(0);
            return;
        }
        const collected = Math.max(
            0,
            Math.min(this.character.coinsCollected, this.maxCoinsInLevel)
        );
        const percentage = (collected / this.maxCoinsInLevel) * 100;
        this.statusBarCoin.setPercentage(percentage);
    }

    /**
     * Updates the bottle status bar based on current ammo.
     *
     * @returns {void}
     */
    updateBottleBar() {
        if (!this.statusBarBottle || typeof this.statusBarBottle.setPercentage !== 'function') {
            return;
        }
        if (this.maxBottlesInLevel <= 0) {
            this.statusBarBottle.setPercentage(0);
            return;
        }
        const clampedAmmo = Math.max(
            0,
            Math.min(this.bottlesAmmo, this.maxBottlesInLevel)
        );
        const percentage = (clampedAmmo / this.maxBottlesInLevel) * 100;
        this.statusBarBottle.setPercentage(percentage);
    }

    /**
     * Checks for collisions between the player and enemies.
     *
     * @returns {void}
     */
    checkCollisions() {
        this.level.enemies.forEach((enemy) => {
            if (this.shouldSkipEnemyCollision(enemy)) return;
            if (!this.character.isColliding(enemy)) return;
            this.handleEnemyCollision(enemy);
        });
    }

    /**
     * Determines whether an enemy should be ignored for collision.
     *
     * @param {MoveableObject} enemy
     * @returns {boolean}
     */
    shouldSkipEnemyCollision(enemy) {
        if (!(enemy instanceof Endboss) && enemy.chickenIsDead) {
            return true;
        }
        if (enemy instanceof Endboss) {
            const isDeadFn = enemy.isDeadEndBoss?.bind(enemy);
            if (typeof isDeadFn === 'function' && isDeadFn()) {
                return true;
            }
        }
        return false;
    }

    /**
     * Applies collision logic for a single enemy.
     *
     * @param {MoveableObject} enemy
     * @returns {void}
     */
    handleEnemyCollision(enemy) {
        if (enemy instanceof Endboss) {
            this.applyEndbossCollision();
        } else {
            this.applyChickenCollision(enemy);
        }
    }

    /**
     * Applies collision damage from the endboss.
     *
     * @returns {void}
     */
    applyEndbossCollision() {
        if (this.character.isHurt()) return;
        this.character.hitByEndboss();
        this.statusBar.setPercentage(this.character.energy);
    }

    /**
     * Applies collision logic against chickens.
     *
     * @param {MoveableObject} enemy
     * @returns {void}
     */
    applyChickenCollision(enemy) {
        const stompHit =
            this.character.speedY < 0 &&
            (this.character.y + this.character.height - 20) < (enemy.y + 20);
        if (!stompHit && !this.character.isHurt()) {
            this.character.hit();
            this.statusBar.setPercentage(this.character.energy);
        }
    }

    /**
     * Checks for collisions between the player and coins.
     *
     * @returns {void}
     */
    checkCollisionCharacterCoin() {
        this.level.coins.forEach((coin, index) => {
            if (!this.character.isColliding(coin)) return;
            this.level.coins.splice(index, 1);
            this.character.coinsCollected++;
            this.updateCoinBar();
            if (this.soundManager?.playCoinSound) {
                this.soundManager.playCoinSound();
            }
        });
    }

    /**
     * Checks for collisions between the player and bottles.
     *
     * @returns {void}
     */
    checkCollisionCharacterBottle() {
        this.level.bottles = this.level.bottles.filter((bottle) => {
            if (!this.isBottlePickupCollision(bottle)) return true;
            this.handleBottlePickup();
            return false;
        });
    }

    /**
     * Returns the character's effective collision hitbox.
     *
     * @returns {{left:number,right:number,top:number,bottom:number}}
     */
    getCharacterHitbox() {
        const left = this.character.x + 60;
        const right = this.character.x + 60 + this.character.width - 105;
        const top = this.character.y + 130;
        const bottom = this.character.y + this.character.height;
        return { left, right, top, bottom };
    }

    /**
     * Returns the bottle's effective collision hitbox.
     *
     * @param {Bottle} bottle
     * @returns {{left:number,right:number,top:number,bottom:number}}
     */
    getBottleHitbox(bottle) {
        const offsetX = bottle.collisionOffsetX || 0;
        const offsetY = bottle.collisionOffsetY || 0;
        const width = bottle.collisionWidth || bottle.width;
        const height = bottle.collisionHeight || bottle.height;
        const left = bottle.x + offsetX;
        const top = bottle.y + offsetY;
        const right = left + width;
        const bottom = top + height;
        return { left, right, top, bottom };
    }

    /**
     * Determines whether the character collides with the given bottle.
     *
     * @param {Bottle} bottle
     * @returns {boolean}
     */
    isBottlePickupCollision(bottle) {
        const c = this.getCharacterHitbox();
        const b = this.getBottleHitbox(bottle);
        return (
            c.right > b.left &&
            c.bottom > b.top &&
            c.left < b.right &&
            c.top < b.bottom
        );
    }

    /**
     * Applies game logic when a bottle is picked up.
     *
     * @returns {void}
     */
    handleBottlePickup() {
        this.bottlesAmmo++;
        if (this.maxBottlesInLevel > 0) {
            this.bottlesAmmo = Math.min(this.bottlesAmmo, this.maxBottlesInLevel);
        }
        if (typeof this.character.bottlesCollected === 'number') {
            this.character.bottlesCollected++;
        }
        this.updateBottleBar();
        if (this.sound?.playBottlePickup) {
            this.sound.playBottlePickup();
        }
    }

    /**
     * Handles killing chickens when stomped from above.
     *
     * @returns {void}
     */
    checkChickenKills() {
        this.level.enemies.forEach((enemy) => {
            if (!this.isChickenAlive(enemy)) return;
            if (!this.isStompKill(enemy)) return;
            this.resolveChickenKill(enemy);
        });
    }

    /**
     * Determines whether an enemy is a living chicken.
     *
     * @param {MoveableObject} enemy
     * @returns {boolean}
     */
    isChickenAlive(enemy) {
        const isChicken =
            enemy instanceof Chicken ||
            enemy instanceof SmallChicken;
        return isChicken && !enemy.chickenIsDead;
    }

    /**
     * Determines whether the character stomped on the enemy.
     *
     * @param {MoveableObject} enemy
     * @returns {boolean}
     */
    isStompKill(enemy) {
        return (
            this.character.isAboveGround() &&
            this.character.speedY < 0 &&
            this.character.isColliding(enemy)
        );
    }

    /**
     * Resolves the kill of a chicken enemy.
     *
     * @param {MoveableObject} enemy
     * @returns {void}
     */
    resolveChickenKill(enemy) {
        if (typeof this.character.bounceOnEnemy === 'function') {
            this.character.bounceOnEnemy();
        } else {
            this.character.speedY = 10;
        }
        enemy.playAnimationChickenDead();
        setTimeout(() => {
            this.level.enemies = this.level.enemies.filter(e => e !== enemy);
        }, 300);
    }

    /**
     * Removes a defeated Endboss after a delay.
     *
     * @param {Endboss} endboss
     * @param {number} delayMs
     * @returns {void}
     */
    removeEndbossAfterDelay(endboss, delayMs) {
        setTimeout(() => {
            this.level.enemies = this.level.enemies.filter(e => e !== endboss);
        }, delayMs);
    }

    /**
     * Stops all ongoing game sounds after a win
     * and plays the win jingle once.
     *
     * @returns {void}
     */
    stopAllSoundsOnWin() {
        if (!this.soundManager) return;
        this.soundManager.stopEndbossSounds?.();
        if (this.soundManager.backgroundMusic) {
            this.soundManager.backgroundMusic.pause();
        }
        this.soundManager.playGameWin?.();
    }

    /**
     * Activates endbosses when the player approaches.
     *
     * @returns {void}
     */
    checkEndbossActivation() {
        this.level.enemies.forEach(enemy => {
            if (!(enemy instanceof Endboss)) return;
            const distance = Math.abs(this.character.x - enemy.x);
            if (distance >= 600 || enemy.hadFirstContact) return;
            enemy.hadFirstContact = true;
            if (this.soundManager && !enemy._alertPlayedOnce) {
                this.soundManager.playEndbossAlert();
                enemy._alertPlayedOnce = true;
            }
            enemy.i = 5;
            enemy.endBossAnimation();
            this.soundManager?.playEndbossAttack?.();
        });
    }

    /**
     * Checks if thrown bottles hit any endboss.
     *
     * @returns {void}
     */
    checkBottleHitsEndboss() {
        this.throwableObjects.forEach((bottle) => {
            this.level.enemies.forEach((enemy) => {
                if (!(enemy instanceof Endboss)) return;
                if (enemy.isDeadEndBoss() || !bottle.isColliding(enemy)) return;
                enemy.hitEndBoss();
                this.statusBarBoss.setPercentage(enemy.energyEndBoss);
                this.throwableObjects.splice(this.throwableObjects.indexOf(bottle), 1);
            });
        });
    }

    /**
     * Returns all endboss enemies in the current level.
     *
     * @returns {Endboss[]}
     */
    getAllEndbosses() {
        return this.level.enemies.filter(e => e instanceof Endboss);
    }

    /**
     * Handles death logic for all endboss enemies.
     *
     * @returns {void}
     */
    checkEndbossDead() {
        const endbosses = this.getAllEndbosses();
        if (endbosses.length === 0) return;
        const anyNewlyDead = this.handleDeadEndbosses(endbosses);
        if (!anyNewlyDead) return;
        if (!this.areAllEndbossesDead(endbosses)) return;
        this.stopAllSoundsOnWin();
        setTimeout(() => this.showWinScreen(), 800);
    }

    /**
     * Processes all dead endbosses and schedules removal.
     *
     * @param {Endboss[]} endbosses
     * @returns {boolean}
     */
    handleDeadEndbosses(endbosses) {
        let anyNewlyDead = false;
        endbosses.forEach((endboss) => {
            const isDeadFn = endboss.isDeadEndBoss?.bind(endboss);
            const isDead = typeof isDeadFn === 'function' ? isDeadFn() : false;
            if (!isDead || endboss.deathHandled) return;
            endboss.deathHandled = true;
            endboss.currentImage = 0;
            endboss.deathAnimationStarted = true;
            this.removeEndbossAfterDelay(endboss, 1000);
            anyNewlyDead = true;
            this.soundManager?.stopEndbossSounds?.();
        });
        return anyNewlyDead;
    }

    /**
     * Determines whether all endbosses are dead.
     *
     * @param {Endboss[]} endbosses
     * @returns {boolean}
     */
    areAllEndbossesDead(endbosses) {
        return endbosses.every((endboss) => {
            const isDeadFn = endboss.isDeadEndBoss?.bind(endboss);
            return typeof isDeadFn === 'function' ? isDeadFn() : false;
        });
    }

    /**
     * Checks if the player has died and triggers lose screen.
     *
     * @returns {void}
     */
    checkCharacterDead() {
        if (this.character?.energy <= 0 && !this.gameOver) {
            this.showLoseScreen();
        }
    }

    /**
     * Creates a full-screen overlay (e.g., win or lose screen).
     *
     * @param {string} title
     * @param {string} subtitle
     * @param {string} color
     * @param {string} [icon=""]
     * @returns {HTMLDivElement}
     */
    createGameOverlay(title, subtitle, color, icon = "") {
        const overlay = document.createElement("div");
        overlay.classList.add("overlay");
        overlay.innerHTML = `
            <div class="box" style="${color ? `background-color:${color};` : ""}">
                <div class="overlay-title">${icon ? icon + " " : ""}${title}</div>
                <div class="overlay-subtitle">${subtitle}</div>
            </div>
        `;
        const stage = document.getElementById("stage") || document.body;
        stage.appendChild(overlay);
        return overlay;
    }

    /**
     * Builds the subtitle for the win screen.
     *
     * @returns {string}
     */
    getWinSubtitle() {
        const coinsTotal = this.maxCoinsInLevel || 0;
        const bottlesTotal = this.maxBottlesInLevel || 0;
        const coinsCollected = this.character.coinsCollected || 0;
        const bottlesCollected = this.character.bottlesCollected || 0;
        return `Coins: ${coinsCollected} / ${coinsTotal} · Bottles: ${bottlesCollected} / ${bottlesTotal}`;
    }

    /**
     * Displays the "YOU WIN" screen.
     *
     * @returns {void}
     */
    showWinScreen() {
        this.gameOver = true;
        const subtitle = this.getWinSubtitle();
        const overlay = this.createGameOverlay(
            "YOU WIN!",
            subtitle,
            "rgba(0,0,0,0.8)",
            "🏆"
        );
        if (this.currentLevel === 1) {
            this.addNextLevelButton(overlay);
        }
    }

    /**
     * Adds the "Next Level" button to the win overlay.
     *
     * @param {HTMLDivElement} overlay
     * @returns {void}
     */
    addNextLevelButton(overlay) {
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
    }

    /**
     * Builds the subtitle for the lose screen.
     *
     * @returns {string}
     */
    getLoseSubtitle() {
        const coinsTotal = this.maxCoinsInLevel || 0;
        const bottlesTotal = this.maxBottlesInLevel || 0;
        const coinsCollected = this.character.coinsCollected || 0;
        const bottlesCollected = this.character.bottlesCollected || 0;
        return `Try again<br>Coins: ${coinsCollected} / ${coinsTotal} · Bottles: ${bottlesCollected} / ${bottlesTotal}`;
    }

    /**
     * Displays the "YOU LOSE" screen and plays game-over sound.
     *
     * @returns {void}
     */
    showLoseScreen() {
        this.gameOver = true;
        const subtitle = this.getLoseSubtitle();
        if (this.soundManager) {
            this.soundManager.stopEndbossSounds?.();
            this.soundManager.backgroundMusic?.pause();
            this.soundManager.playGameOver?.();
        }
        this.createGameOverlay(
            "YOU LOSE",
            subtitle,
            "rgba(0,0,0,0.8)",
            "❌"
        );
    }

    /**
     * Draws all visible game objects on the canvas.
     *
     * @returns {void}
     */
    draw() {
        this.clearCanvas();
        this.drawWorldLayer();
        this.drawHudLayer();
        if (!this.gameOver) {
            requestAnimationFrame(() => this.draw());
        }
    }

    /**
     * Clears the canvas for the next frame.
     *
     * @returns {void}
     */
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Draws all world objects with camera offset.
     *
     * @returns {void}
     */
    drawWorldLayer() {
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.level.enemies);
        this.addToMap(this.character);
        this.addObjectsToMap(this.throwableObjects);
        this.ctx.translate(-this.camera_x, 0);
    }

    /**
     * Draws all HUD elements on top.
     *
     * @returns {void}
     */
    drawHudLayer() {
        this.addToMap(this.statusBar);
        this.addToMap(this.statusBarBoss);
        this.addToMap(this.statusBarBottle);
        this.addToMap(this.statusBarCoin);
    }

    /**
     * Draws an array of drawable objects to the map.
     *
     * @param {DrawableObject[]} objects
     * @returns {void}
     */
    addObjectsToMap(objects) {
        objects.forEach((o) => this.addToMap(o));
    }

    /**
     * Draws a single object with respect to its mirroring direction.
     *
     * @param {DrawableObject} mo
     * @returns {void}
     */
    addToMap(mo) {
        if (mo.otherDirection) this.flipImage(mo);
        mo.draw(this.ctx);
        if (mo.otherDirection) this.flipImageBack(mo);
    }

    /**
     * Flips an object horizontally for rendering.
     *
     * @param {DrawableObject} mo
     * @returns {void}
     */
    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    /**
     * Restores the original rendering orientation.
     *
     * @param {DrawableObject} mo
     * @returns {void}
     */
    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }

    /**
     * Reduces the Endboss’s health and updates the boss bar.
     *
     * @returns {void}
     */
    hitBoss() {
        this.endboss.energy -= 20;
        this.statusBarBoss.setPercentage(this.endboss.energy);
    }

    /**
     * Selects the new level instance and updates currentLevel.
     *
     * @param {number} levelNumber
     * @returns {void}
     */
    selectLevel(levelNumber) {
        if (levelNumber === 2) {
            level2 = createLevel2();
            this.level = level2;
            this.currentLevel = 2;
        } else {
            level1 = createLevel1();
            this.level = level1;
            this.currentLevel = 1;
        }
    }

    /**
     * Resets camera and projectile-related runtime state.
     *
     * @returns {void}
     */
    resetCameraAndProjectiles() {
        this.camera_x = 0;
        this.throwableObjects = [];
        this.bottlesAmmo = 0;
        this.lastThrowAt = 0;
    }

    /**
     * Resets the character’s runtime state.
     *
     * @returns {void}
     */
    resetCharacterState() {
        this.character.x = 100;
        this.character.y = 100;
        this.character.energy = 100;
        this.character.isSleeping = false;
        this.character.isDeadFlag = false;
        this.character.coinsCollected = 0;
        this.character.bottlesCollected = 0;
    }

    /**
     * Resets all HUD status bars to initial values.
     *
     * @returns {void}
     */
    resetStatusBars() {
        this.statusBar.setPercentage(this.character.energy);
        this.statusBarBottle.setPercentage(0);
        this.statusBarCoin.setPercentage(0);
        this.statusBarBoss.setPercentage(100);
    }

    /**
     * Restarts background music for the current level.
     *
     * @returns {void}
     */
    restartBackgroundMusic() {
        if (!this.soundManager || !this.soundManager.backgroundMusic) return;
        try {
            this.soundManager.backgroundMusic.currentTime = 0;
            this.soundManager.backgroundMusic.play();
        } catch (e) {}
    }

    /**
     * Switches to the given level number and resets state.
     *
     * @param {number} levelNumber
     * @returns {void}
     */
    switchToLevel(levelNumber) {
        this.selectLevel(levelNumber);
        this.updateLevelLimits();
        this.resetCameraAndProjectiles();
        this.resetCharacterState();
        this.resetStatusBars();
        this.restartBackgroundMusic();
        this.updateLevelLabel();
        this.setWorld();
    }
}