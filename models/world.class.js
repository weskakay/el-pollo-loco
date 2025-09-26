/**
 * Class representing the game world.
 * Manages the character, enemies, background, and game logic.
 */
class World {
    /**
     * The main character instance.
     * @type {Character}
     */
    character = new Character();
    /**
     * The current level instance.
     * @type {Level}
     */
    level = level1;
    /**
     * The canvas element.
     * @type {HTMLCanvasElement}
     */
    canvas;
    /**
     * The canvas 2D rendering context.
     * @type {CanvasRenderingContext2D}
     */
    ctx;
    /**
     * The keyboard input handler.
     * @type {Keyboard}
     */
    keyboard;
    /**
     * The current camera offset.
     * @type {number}
     */
    camera_x = 0;
    /**
     * The health status bar UI element.
     * @type {StatusBar}
     */
    statusBar = new StatusBar();
    statusBarBoss = new StatusBarBoss();
    statusBarBottle = new StatusBarBottle();
    statusBarCoin = new StatusBarCoin();
    /**
     * Array of throwable objects (e.g., bottles).
     * @type {ThrowableObject[]}
     */
    
    throwableObjects = [];
    sound = new SoundManager();
    /**
     * Creates a new World instance.
     * @param {HTMLCanvasElement} canvas - The game's canvas element.
     * @param {Keyboard} keyboard - The keyboard input handler.
     */
    constructor(canvas, keyboard, soundManager) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.soundManager = soundManager || this.sound;
        this.draw();
        this.setWorld();
        this.run();
    }
    /**
     * Links the character to the world.
     */
    setWorld() {
        this.character.world = this;
    }
    /**
     * Starts the game loop for collision checks and throwing objects.
     */
    run() {
        setInterval(() => {
            this.checkChickenKills();
            this.checkCollisions();
            this.checkThrowObjects();
            this.checkCollisionCharacterCoin();
            this.checkCollisionCharacterBottle();
            this.checkEndbossActivation();
            this.checkBottleHitsEndboss();
            this.checkEndbossDead();
        }, 1000 / 60);
    }
    /**
     * Checks if the player presses throw key and throws a bottle
     * only if one is available in inventory.
     */
    checkThrowObjects() {
        if (this.keyboard.THROW && !this.character.bottleThrown && this.character.bottlesCollected > 0) {
            let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100);
            this.throwableObjects.push(bottle);
            this.character.bottleThrown = true;
            this.character.bottlesCollected--;
            this.statusBarBottle.setPercentage(this.character.bottlesCollected * 20);
            setTimeout(() => {
                this.character.bottleThrown = false;
            }, 500);
        }
    }
    
    /**
     * Checks for collisions between the character and enemies.
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
     * Checks for collisions between the character and coins.
     */
    checkCollisionCharacterCoin() {
        this.level.coins.forEach((coin, index) => {
            if (this.character.isColliding(coin)) {
                console.log("Coin eingesammelt!");
                this.level.coins.splice(index, 1);
                this.character.coinsCollected++;
                this.statusBarCoin.setPercentage(this.character.coinsCollected * 20);
                    if (this.soundManager) {
                    this.soundManager.coinSound.currentTime = 0;
                    this.soundManager.coinSound.play();
                }
            }
        });
    }
    /**
     * Checks for collisions between the character and bottles.
     */
    checkCollisionCharacterBottle() {
        this.level.bottles.forEach((bottle, index) => {
            if (this.character.isColliding(bottle)) {
                console.log("Bottle eingesammelt!");
                this.level.bottles.splice(index, 1);
                this.character.bottlesCollected++;
                this.statusBarBottle.setPercentage(this.character.bottlesCollected * 20);
                this.sound.playBottlePickup();
            }
        });
    }
    /**
     * Handles killing chickens when stomped from above.
     */
    checkChickenKills() {
        this.level.enemies.forEach((enemy) => {
            if (enemy instanceof Endboss) return;
            if (enemy.chickenIsDead) return; 
            const colliding = this.character.isColliding(enemy);
            const stompHit = colliding && this.character.speedY < 0 && (this.character.y + this.character.height - 20) < (enemy.y + 20);
            if (!stompHit) return;
            if (typeof this.character.jump === 'function') this.character.jump();
            if (typeof enemy.playAnimationChickenDead === 'function') {
                enemy.playAnimationChickenDead();
            }
            if (this.sound?.playChickenDead) {
                this.sound.playChickenDead();
            } else if (this.soundManager?.playChickenDead) {
                this.soundManager.playChickenDead();
            }
            enemy.chickenIsDead = true;
            setTimeout(() => {
                const idx = this.level.enemies.indexOf(enemy);
                if (idx > -1) this.level.enemies.splice(idx, 1);
            }, 500);
        });
    }
    /**
     * Activates the Endboss when the character comes close.
     */
    checkEndbossActivation() {
        this.level.enemies.forEach(enemy => {
            if (enemy instanceof Endboss) {
                let distance = Math.abs(this.character.x - enemy.x);
                if (distance < 400 && !enemy.hadFirstContact) {
                    console.log("Endboss activated!");
                    enemy.hadFirstContact = true;
                    enemy.endBossAnimation();
                }
            }
        });
    }
    /**
     * Checks if thrown bottles hit the Endboss.
     */
    checkBottleHitsEndboss() {
        this.throwableObjects.forEach((bottle) => {
            this.level.enemies.forEach((enemy) => {
                if (enemy instanceof Endboss && bottle.isColliding(enemy)) {
                    console.log("Bottle hits Endboss!");
                    enemy.hitEndBoss(); 
                    this.statusBarBoss.setPercentage(enemy.energyEndBoss);
                    this.throwableObjects.splice(this.throwableObjects.indexOf(bottle), 1);
                }
            });
        });
    }
    /**
     * Checks if the Endboss has been defeated.
     */
    checkEndbossDead() {
        this.level.enemies.forEach((enemy) => {
            if (enemy instanceof Endboss && enemy.isDeadEndBoss()) {
                console.log("Endboss besiegt!");
                this.gameOver = true;
                setTimeout(() => {
                    this.showWinScreen();
                }, 1500);
            }
        });
    }
    /**
     * Displays the "YOU WIN" screen overlay.
     */
    showWinScreen() {
        let winScreen = document.createElement("div");
        winScreen.innerHTML = "🏆 YOU WIN!";
        winScreen.style.position = "absolute";
        winScreen.style.top = "40%";
        winScreen.style.left = "50%";
        winScreen.style.transform = "translate(-50%, -50%)";
        winScreen.style.fontSize = "48px";
        winScreen.style.color = "#fff";
        winScreen.style.backgroundColor = "rgba(0,0,0,0.7)";
        winScreen.style.padding = "40px";
        winScreen.style.borderRadius = "20px";
        winScreen.style.zIndex = "9999";
        document.body.appendChild(winScreen);
    }
    /**
     * Draws all game objects on the canvas.
     */
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.ctx.translate(-this.camera_x, 0);
        this.addToMap(this.statusBar);
        this.addToMap(this.statusBarBoss);
        this.addToMap(this.statusBarBottle);
        this.addToMap(this.statusBarCoin);
        this.ctx.translate(this.camera_x, 0);
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);
        this.ctx.translate(-this.camera_x, 0);
        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
    }
    /**
     * Adds multiple objects to the map.
     * @param {DrawableObject[]} objects - Array of drawable objects.
     */
    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);
        });
    }
    /**
     * Adds a single object to the map with proper transformations.
     * @param {DrawableObject} mo - The drawable object.
     */
    addToMap(mo) {
        if (mo.otherDirection) {
            this.flipImage(mo);
        }

        mo.draw(this.ctx);
        

        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }
    /**
     * Flips the image horizontally for mirrored objects.
     * @param {DrawableObject} mo - The drawable object.
     */
    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }
    /**
     * Reverts the horizontal flip of the image.
     * @param {DrawableObject} mo - The drawable object.
     */
    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }
    hitBoss() {
        this.endboss.energy -= 20;
        this.statusBarBoss.setPercentage(this.endboss.energy); 
    }
}