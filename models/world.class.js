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
 * @version 1.0.0
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

        if (this.level && Array.isArray(this.level.bottles)) {
        this.maxBottlesInLevel = this.level.bottles.length;
    } else {
        this.maxBottlesInLevel = 0;
    }

    if (this.level && Array.isArray(this.level.coins)) {
        this.maxCoinsInLevel = this.level.coins.length;
    } else {
        this.maxCoinsInLevel = 0;
    }

        this.draw();
        this.setWorld();
        this.run();
    }
    /**
     * Links the character instance to the current world context.
     * Enables the character to access world-level properties and sounds.
     *
     * @returns {void}
     */
    setWorld() {
        this.character.world = this;
    }
    /**
     * Starts the main game loop.
     * Continuously checks for collisions, object interactions,
     * and updates the game state at 60 FPS.
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
     * Handles throw input based on keyboard state.
     * Only allows throwing if:
     * - throw key changed from not pressed to pressed (rising edge),
     * - cooldown has passed since the last throw,
     * - at least one bottle is available.
     *
     * @returns {void}
     */
    handleThrowInput() {
        const now = Date.now();
        const pressed = this.keyboard.THROW === true;
        const risingEdge = pressed && !this.throwPressedPrev;
        const cooledDown = (now - this.lastThrowAt) >= this.throwCooldownMs;

        if (risingEdge && cooledDown && this.bottlesAmmo > 0) {
            this.spawnBottle();
            this.bottlesAmmo--;
            this.updateBottleBar();
            this.lastThrowAt = now;
        }

        this.throwPressedPrev = pressed;
    }

    /**
 * Spawns a new throwable bottle near the character's hand.
 *
 * @returns {void}
 */
spawnBottle() {
    const facingLeft = this.character.otherDirection === true;

    // Horizontal offset in front of the character
    const offsetX = facingLeft ? -40 : 40;
    // Slightly above the feet, roughly hand height
    const offsetY = 40;

    const spawnX = this.character.x + offsetX;
    const spawnY = this.character.y + offsetY;

    const bottle = new ThrowableObject(spawnX, spawnY);
    bottle.otherDirection = facingLeft;

    this.throwableObjects.push(bottle);

    if (this.sound && typeof this.sound.playThrow === 'function') {
        this.sound.playThrow();
    }
}

    /**
 * Updates the coin status bar based on collected coins.
 * Maps collected coins to 0–100% using the maximum coin count
 * defined by the current level.
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

    const collected = Math.max(0, Math.min(this.character.coinsCollected, this.maxCoinsInLevel));
    const percentage = (collected / this.maxCoinsInLevel) * 100;

    this.statusBarCoin.setPercentage(percentage);
}

    
    /**
 * Updates the bottle status bar based on the current ammo value.
 * Maps the current ammo to 0–100% using the maximum bottle count
 * defined by the current level.
 *
 * @returns {void}
 */
updateBottleBar() {
    if (!this.statusBarBottle || typeof this.statusBarBottle.setPercentage !== 'function') {
        return;
    }

    // If the level does not define any bottles, show 0%
    if (this.maxBottlesInLevel <= 0) {
        this.statusBarBottle.setPercentage(0);
        return;
    }

    // Clamp ammo in case of logic glitches
    const clampedAmmo = Math.max(0, Math.min(this.bottlesAmmo, this.maxBottlesInLevel));
    const percentage = (clampedAmmo / this.maxBottlesInLevel) * 100;

    this.statusBarBottle.setPercentage(percentage);
}


    /**
     * Checks for collisions between the player and enemies.
     * Applies damage or stomp logic depending on collision direction.
     *
     * @returns {void}
     */
    checkCollisions() {
        this.level.enemies.forEach((enemy) => {
            if (!(enemy instanceof Endboss) && enemy.chickenIsDead) return;
            if (!this.character.isColliding(enemy)) return;
            if (enemy instanceof Endboss) {
                if (!this.character.isHurt()) {
                    this.character.hit();
                    this.statusBar.setPercentage(this.character.energy);
                }
            } else {
                const stompHit =
                    this.character.speedY < 0 &&
                    (this.character.y + this.character.height - 20) < (enemy.y + 20);
                if (!stompHit && !this.character.isHurt()) {
                    this.character.hit();
                    this.statusBar.setPercentage(this.character.energy);
                }
            }
        });
    }
    /**
     * Checks for collisions between the player and coins.
     * Removes collected coins, plays the coin sound, and updates the HUD.
     *
     * @returns {void}
     */
    checkCollisionCharacterCoin() {
    this.level.coins.forEach((coin, index) => {
        if (this.character.isColliding(coin)) {
            this.level.coins.splice(index, 1);

            this.character.coinsCollected++;

            this.updateCoinBar();

            if (this.soundManager) {
                this.soundManager.coinSound.currentTime = 0;
                this.soundManager.coinSound.play();
            }
        }
    });
}

    /**
 * Checks for collisions between the player and bottles.
 * Increments bottle ammo, updates the HUD and removes picked bottles.
 *
 * @returns {void}
 */
checkCollisionCharacterBottle() {
    this.level.bottles.forEach((bottle, index) => {
        if (this.character.isColliding(bottle)) {
            this.level.bottles.splice(index, 1);

            this.bottlesAmmo++;

            // Ensure ammo does not exceed the maximum defined for this level
            if (this.maxBottlesInLevel > 0) {
                this.bottlesAmmo = Math.min(this.bottlesAmmo, this.maxBottlesInLevel);
            }

            if (typeof this.character.bottlesCollected === 'number') {
                this.character.bottlesCollected++;
            }

            this.updateBottleBar();

            if (this.sound && typeof this.sound.playBottlePickup === 'function') {
                this.sound.playBottlePickup();
            }
        }
    });
}


    /**
     * Handles killing chickens when stomped from above.
     * Plays sounds and removes the defeated enemy after a short delay.
     *
     * @returns {void}
     */
    checkChickenKills() {
        this.level.enemies.forEach((enemy) => {
            if (enemy instanceof Endboss || enemy.chickenIsDead) return;
            const colliding = this.character.isColliding(enemy);
            const stompHit =
                colliding && this.character.speedY < 0 &&
                (this.character.y + this.character.height - 20) < (enemy.y + 20);
            if (!stompHit) return;
            if (typeof this.character.jump === 'function') this.character.jump();
            if (typeof enemy.playAnimationChickenDead === 'function') enemy.playAnimationChickenDead();
            (this.sound?.playChickenDead || this.soundManager?.playChickenDead)?.call(this.soundManager);
            enemy.chickenIsDead = true;
            setTimeout(() => {
                const idx = this.level.enemies.indexOf(enemy);
                if (idx > -1) this.level.enemies.splice(idx, 1);
            }, 500);
        });
    }

    /**
     * Activates the Endboss when the player approaches.
     * Triggers alert and attack animations and plays corresponding sounds.
     *
     * @returns {void}
     */
    checkEndbossActivation() {
        this.level.enemies.forEach(enemy => {
            if (enemy instanceof Endboss) {
                const distance = Math.abs(this.character.x - enemy.x);
                if (distance < 600 && !enemy.hadFirstContact) {
                    enemy.hadFirstContact = true;
                    if (this.soundManager && !enemy._alertPlayedOnce) {
                        this.soundManager.playEndbossAlert();
                        enemy._alertPlayedOnce = true;
                    }
                    enemy.i = 5;
                    enemy.endBossAnimation();
                    this.soundManager.playEndbossAttack();
                }
            }
        });
    }

    /**
     * Checks if thrown bottles hit the Endboss.
     * Reduces Endboss energy and updates the health bar.
     *
     * @returns {void}
     */
    checkBottleHitsEndboss() {
        this.throwableObjects.forEach((bottle) => {
            this.level.enemies.forEach((enemy) => {
                if (enemy instanceof Endboss && bottle.isColliding(enemy)) {
                    enemy.hitEndBoss();
                    this.statusBarBoss.setPercentage(enemy.energyEndBoss);
                    this.throwableObjects.splice(this.throwableObjects.indexOf(bottle), 1);
                }
            });
        });
    }

    /**
     * Checks whether the Endboss has been defeated and triggers the win screen.
     *
     * @returns {void}
     */
    checkEndbossDead() {
        this.level.enemies.forEach((enemy) => {
            if (enemy instanceof Endboss && enemy.isDeadEndBoss()) {
                this.gameOver = true;
                setTimeout(() => this.showWinScreen(), 1500);
            }
        });
    }

    /**
     * Checks if the player has died and triggers the lose screen.
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
     * @param {string} title - The main message title.
     * @param {string} subtitle - The subtitle message (optional).
     * @param {string} color - Background color in RGBA format.
     * @param {string} [icon=""] - Optional emoji or symbol prefix.
     * @returns {void}
     */
    createGameOverlay(title, subtitle, color, icon = "") {
        const overlay = document.createElement("div");
        overlay.classList.add("overlay");
        if (color) overlay.style.backgroundColor = color;
        overlay.innerHTML = `
            <div class="overlay-title">${icon ? icon + " " : ""}${title}</div>
            <div class="overlay-subtitle">${subtitle}</div>
        `;
        document.body.appendChild(overlay);
    }

    /**
     * Displays the "YOU WIN" screen and plays the victory sound.
     *
     * @returns {void}
     */
    showWinScreen() {
    this.gameOver = true;

    const coinsTotal = this.maxCoinsInLevel || 0;
    const bottlesTotal = this.maxBottlesInLevel || 0;
    const coinsCollected = this.character.coinsCollected || 0;
    const bottlesCollected = this.character.bottlesCollected || 0;

    const subtitle = `Coins: ${coinsCollected} / ${coinsTotal} · Bottles: ${bottlesCollected} / ${bottlesTotal}`;

    if (this.soundManager) {
        this.soundManager.backgroundMusic?.pause();
        this.soundManager.playGameWin();
    }

    this.createGameOverlay("YOU WIN!", subtitle, "rgba(0,0,0,0.8)", "🏆");
}


    /**
     * Displays the "YOU LOSE" screen and plays the game-over sound.
     *
     * @returns {void}
     */
    showLoseScreen() {
    this.gameOver = true;

    const coinsTotal = this.maxCoinsInLevel || 0;
    const bottlesTotal = this.maxBottlesInLevel || 0;
    const coinsCollected = this.character.coinsCollected || 0;
    const bottlesCollected = this.character.bottlesCollected || 0;

    const subtitle = `Try again<br>Coins: ${coinsCollected} / ${coinsTotal} · Bottles: ${bottlesCollected} / ${bottlesTotal}`;

    if (this.soundManager) {
        this.soundManager.backgroundMusic?.pause();
        this.soundManager.playGameOver();
    }

    this.createGameOverlay("YOU LOSE", subtitle, "rgba(0,0,0,0.8)", "❌");
}


    /**
     * Draws all visible game objects on the canvas.
     * Handles camera offset and HUD rendering order.
     *
     * @returns {void}
     */
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0);

        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.level.enemies);
        this.addToMap(this.character);
        this.addObjectsToMap(this.throwableObjects);

        this.ctx.translate(-this.camera_x, 0);

        this.addToMap(this.statusBar);
        this.addToMap(this.statusBarBoss);
        this.addToMap(this.statusBarBottle);
        this.addToMap(this.statusBarCoin);

        if (!this.gameOver) {
            requestAnimationFrame(() => this.draw());
        }
    }

    /**
     * Draws an array of drawable objects to the map.
     *
     * @param {DrawableObject[]} objects - The objects to draw.
     * @returns {void}
     */
    addObjectsToMap(objects) {
        objects.forEach((o) => this.addToMap(o));
    }

    /**
     * Draws a single object with respect to its mirroring direction.
     *
     * @param {DrawableObject} mo - The drawable object.
     * @returns {void}
     */
    addToMap(mo) {
        if (mo.otherDirection) this.flipImage(mo);
        mo.draw(this.ctx);
        if (mo.otherDirection) this.flipImageBack(mo);
    }

    /**
     * Flips an object horizontally for rendering in the opposite direction.
     *
     * @param {DrawableObject} mo - The drawable object.
     * @returns {void}
     */
    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    /**
     * Restores the original rendering orientation after flipping.
     *
     * @param {DrawableObject} mo - The drawable object.
     * @returns {void}
     */
    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }
    
    /**
     * Reduces the Endboss’s health and updates the boss status bar.
     * (Legacy helper method, not actively used in main loop.)
     *
     * @returns {void}
     */
    hitBoss() {
        this.endboss.energy -= 20;
        this.statusBarBoss.setPercentage(this.endboss.energy);
    }
}