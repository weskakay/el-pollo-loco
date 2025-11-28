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
    document.getElementById('help-btn').classList.remove('d-none'); 
    setTimeout(() => {
        document.getElementById('loading-screen').classList.add('d-none');
        document.getElementById('canvas').classList.remove('d-none');
        init();
    }, 1000);
}

/**
 * Resets the game state without reloading the page.
 * - Closes overlays & help.
 * - Stops all relevant sounds.
 * - Marks the current world as finished.
 * - Creates a fresh World instance.
 *
 * @returns {void}
 */
function resetGame() {
    const helpScreen = document.getElementById('help-screen');
    if (helpScreen) {
        helpScreen.classList.add('d-none');
    }

    document.querySelectorAll('.overlay').forEach((overlay) => overlay.remove());

    if (world) {
        world.gameOver = true;

        if (world.sound) {
            if (typeof world.sound.stopBackground === 'function') {
                world.sound.stopBackground();
            }
            if (typeof world.sound.stopWalking === 'function') {
                world.sound.stopWalking();
            }
        }

        if (world.soundManager && typeof world.soundManager.stopEndbossSounds === 'function') {
            world.soundManager.stopEndbossSounds();
        }
    }

    if (typeof createLevel1 === 'function') {
        level1 = createLevel1();
    }

    init();
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
    if (!isMuted && world.sound && typeof world.sound.playBackground === 'function') {
        world.sound.playBackground();
    }
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