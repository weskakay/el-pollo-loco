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
     * The status bar UI element.
     * @type {StatusBar}
     */
    statusBar = new StatusBar();
    /**
     * Array of throwable objects (e.g., bottles).
     * @type {ThrowableObject[]}
     */
    throwableObjects = [];
    /**
     * Creates a new World instance.
     * @param {HTMLCanvasElement} canvas - The game's canvas element.
     * @param {Keyboard} keyboard - The keyboard input handler.
     */
    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
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
            this.checkCollisions();
            this.checkThrowObjects();
        }, 200);
    }
    /**
     * Checks if the player pressed throw and creates a throwable object.
     */
    checkThrowObjects() {
        if (this.keyboard.D) {
            let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100);
            this.throwableObjects.push(bottle);
        }
    }
    /**
     * Checks for collisions between the character and enemies.
     */
    checkCollisions() {
        this.level.enemies.forEach((enemy) => {
            if (this.character.isColliding(enemy)) {
                this.character.hit();
                this.statusBar.setPercentage(this.character.energy);
            }
        });
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
}