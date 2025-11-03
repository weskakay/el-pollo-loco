/**
 * @fileoverview Main game control file.
 * Handles initialization, event listeners, and high-level game flow.
 * This file acts as the entry point for El Pollo Loco.
 * 
 * @author KW
 * @version 1.0.0
 */

/**
 * The game's canvas element.
 * @type {HTMLCanvasElement}
 */
let canvas;

/**
 * The game world instance.
 * @type {World}
 */
let world;

/**
 * The keyboard input instance.
 * @type {Keyboard}
 */
let keyboard = new Keyboard();

/**
 * Global mute flag for all sounds.
 * @type {boolean}
 */
let isMuted = false;

/**
 * Starts the game:
 * - Hides the start screen.
 * - Shows the loading screen for a short period.
 * - Displays the canvas.
 * - Initializes the game world after loading.
 *
 * @returns {void}
 */
function startGame() {
    document.getElementById('start-screen').classList.add('d-none');
    document.getElementById('loading-screen').classList.remove('d-none');
    document.getElementById('canvas').classList.remove('hidden-placeholder');
    document.getElementById('reset-btn').classList.remove('d-none');
    document.getElementById('music-btn').classList.remove('d-none');
    
    setTimeout(() => {
        document.getElementById('loading-screen').classList.add('d-none');
        document.getElementById('canvas').classList.remove('d-none');
        init();
    }, 1000);
}

/**
 * Reloads the entire page to reset the game state.
 *
 * @returns {void}
 */
function resetGame() {
    location.reload();
}

/**
 * Initializes the game world by:
 * - Linking the canvas and keyboard.
 * - Creating a new {@link World} instance.
 * - Starting background music.
 * - Updating the music button text.
 *
 * @returns {void}
 */
function init() {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
    world.sound.playBackground();
    updateMusicButton();
}

/**
 * Toggles background music on or off.
 *
 * @returns {void}
 */
function toggleMusic() {
    isMuted = !isMuted;
    updateMusicButton();

    if (isMuted) {
        world.sound.stopBackground();
    } else {
        world.sound.playBackground();
    }
}

/**
 * Updates the text label of the music button
 * based on the current mute state.
 *
 * @returns {void}
 */
function updateMusicButton() {
    const btn = document.getElementById('music-btn');
    btn.textContent = isMuted ? '🔇 MUSIC: OFF' : '🎵 MUSIC: ON';
}

/**
 * Shows or hides the help screen overlay.
 *
 * @returns {void}
 */
function toggleHelp() {
    document.getElementById('help-screen').classList.toggle('d-none');
}

/**
 * Throws a bottle object from the character's position,
 * if the world instance is initialized.
 * 
 * Creates a new {@link ThrowableObject} and pushes it
 * into the {@link World.throwableObjects} array.
 *
 * @returns {void}
 */
function throwBottle() {
    if (world) {
        let bottle = new ThrowableObject(world.character.x + 100, world.character.y + 100);
        world.throwableObjects.push(bottle);
        world.sound.playThrow();
    }
}

/**
 * Handles keydown events for player input.
 * Activates corresponding movement or action flags
 * in the {@link Keyboard} instance.
 *
 * @param {KeyboardEvent} e - The keydown event object.
 * @returns {void}
 */
window.addEventListener("keydown", (e) => {
    if (e.code == "ArrowRight" || e.code == "KeyD") {
        keyboard.RIGHT = true;
    }
    if (e.code == "ArrowLeft" || e.code == "KeyA") {
        keyboard.LEFT = true;
    }
    if (e.code == "ArrowUp" || e.code == "KeyW") {
        keyboard.JUMP = true;
    }
    if (e.code == "KeyF") {
        keyboard.THROW = true;
        throwBottle();
    }
});

/**
 * Handles keyup events for player input.
 * Deactivates corresponding movement or action flags
 * in the {@link Keyboard} instance.
 *
 * @param {KeyboardEvent} e - The keyup event object.
 * @returns {void}
 */
window.addEventListener("keyup", (e) => {
    if (e.code == "ArrowRight" || e.code == "KeyD") {
        keyboard.RIGHT = false;
    }
    if (e.code == "ArrowLeft" || e.code == "KeyA") {
        keyboard.LEFT = false;
    }
    if (e.code == "ArrowUp" || e.code == "KeyW") {
        keyboard.JUMP = false;
    }
    if (e.code == "KeyF") {
        keyboard.THROW = false;
    }
});
