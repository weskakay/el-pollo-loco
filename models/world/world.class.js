/**
 * @fileoverview Defines the {@link World} core class.
 * The World acts as the central game state container and coordinator.
 * Rendering, collisions, input handling and gameplay logic are
 * extended via prototype methods in separate world.*.js files.
 *
 * @see Character
 * @see Level
 * @see StatusBar
 * @see SoundManager
 * @see Endboss
 * @see ThrowableObject
 *
 * @author KW
 * @version 2.0.0
 */

/**
 * World core class.
 * Holds shared state, initializes the game and manages level switching.
 * Functional logic is split into feature-based prototype extensions
 * (world.loop.js, world.render.js, world.collisions.js, etc.).
 */
class World {
    character = new Character();
    level = null;
    currentLevel = 1;

    canvas;
    ctx;
    keyboard;

    camera_x = 0;
    gameOver = false;
    runIntervalId = null;

    statusBar = new StatusBar();
    statusBarBoss = new StatusBarBoss();
    statusBarBottle = new StatusBarBottle();
    statusBarCoin = new StatusBarCoin();

    maxCoinsInLevel = 0;
    maxBottlesInLevel = 0;

    throwableObjects = [];
    bottlesAmmo = 0;
    lastThrowAt = 0;
    throwCooldownMs = 300;
    throwPressedPrev = false;

    levelLabelEl = null;

    sound = new SoundManager();

    /**
     * Creates a new game world instance.
     *
     * @param {HTMLCanvasElement} canvas
     * @param {Keyboard} keyboard
     * @param {SoundManager} [soundManager]
     */
    constructor(canvas, keyboard, soundManager) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.soundManager = soundManager || this.sound;

        this.selectLevel(this.currentLevel);

        this.updateLevelLimits?.();
        this.initLevelLabel?.();

        this.setWorld();

        this.run?.();
        this.draw?.();
    }

    /**
     * Injects the world reference into the character instance.
     * Enables bidirectional access between character and world.
     */
    setWorld() {
        this.character.world = this;
    }

    /**
     * Selects and initializes a level based on its number.
     *
     * @param {number} levelNumber
     */
    selectLevel(levelNumber) {
        if (levelNumber === 2) {
            level2 = createLevel2();
            this.level = level2;
            this.currentLevel = 2;
            return;
        }

        level1 = createLevel1();
        this.level = level1;
        this.currentLevel = 1;
    }

    /**
     * Resets camera position and all projectile-related state.
     */
    resetCameraAndProjectiles() {
        this.camera_x = 0;
        this.throwableObjects = [];
        this.bottlesAmmo = 0;
        this.lastThrowAt = 0;
    }

    /**
     * Resets the character to its initial state.
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
     * Resets all HUD status bars to their default values.
     */
    resetStatusBars() {
        this.statusBar.setPercentage(this.character.energy);
        this.statusBarBottle.setPercentage(0);
        this.statusBarCoin.setPercentage(0);
        this.statusBarBoss.setPercentage(100);
    }

    /**
     * Restarts the background music for the current level.
     */
    restartBackgroundMusic() {
        const music = this.soundManager?.backgroundMusic;
        if (!music) return;

        try {
            music.currentTime = 0;
            music.play();
        } catch (error) {
            console.error('Failed to restart background music:', error);
        }
    }

    /**
     * Switches to another level and fully resets runtime state.
     *
     * @param {number} levelNumber
     */
    switchToLevel(levelNumber) {
        this.selectLevel(levelNumber);

        this.updateLevelLimits?.();

        this.resetCameraAndProjectiles();
        this.resetCharacterState();
        this.resetStatusBars();
        this.restartBackgroundMusic();

        this.updateLevelLabel?.();
        this.setWorld();
    }
}