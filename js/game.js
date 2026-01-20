/**
 * @fileoverview Main game control file.
 * Handles initialization, event listeners, and high-level game flow.
 * This file acts as the entry point for El Pollo Loco.
 *
 * @author KW
 * @version 1.3.0
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
 * Flag to ensure touch controls are only initialized once.
 * @type {boolean}
 */
let touchControlsInitialized = false;

try {
    const storedMute = localStorage.getItem('soundMuted');
    if (storedMute === 'true') {
        isMuted = true;
    } else if (storedMute === 'false') {
        isMuted = false;
    }
} catch (error) {
    console.error('Failed to read soundMuted from localStorage:', error);
}

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
        document.querySelector('.level-indicator')?.classList.remove('d-none');
    }, 1000);
}

/**
 * Resets the game state without reloading the page.
 * - Hides help and removes overlays.
 * - Stops world loop + character loops.
 * - Stops all relevant sounds.
 * - Re-initializes the world.
 *
 * @returns {void}
 */
function resetGame() {
    hideHelpScreen();
    removeOverlays();

    if (world) {
        stopWorld(world);
        stopWorldSounds(world);
        stopEndbossSounds(world);
    }

    init();
}

/**
 * Retries the specified level without going back to level 1.
 *
 * @param {number} level - The level number to retry.
 * @returns {void}
 */
function retryLevel(level) {
    hideHelpScreen();
    removeOverlays();

    if (world) {
        stopWorld(world);
        stopWorldSounds(world);
        stopEndbossSounds(world);
    }

    init();
    if (world && typeof world.switchToLevel === "function" && level > 1) {
        world.switchToLevel(level);
    }
}

function goHome() {
    hideHelpScreen();
    removeOverlays();

    if (world) {
        stopWorld(world);
        stopWorldSounds(world);
        stopEndbossSounds(world);
    }

    document.getElementById('start-screen')?.classList.remove('d-none');

    document.getElementById('canvas')?.classList.add('d-none');
    document.getElementById('canvas')?.classList.add('hidden-placeholder');

    document.getElementById('reset-btn')?.classList.add('d-none');
    document.getElementById('music-btn')?.classList.add('d-none');
    document.getElementById('help-btn')?.classList.add('d-none');
    document.getElementById('loading-screen')?.classList.add('d-none');

    document.querySelector('.level-indicator')?.classList.add('d-none');

    if (typeof showFooter === "function") showFooter();
}


/**
 * Hides the help screen if it exists.
 *
 * @returns {void}
 */
function hideHelpScreen() {
    document.getElementById('help-screen')?.classList.add('d-none');
}

/**
 * Removes all current overlay elements from the DOM.
 *
 * @returns {void}
 */
function removeOverlays() {
    document.querySelectorAll('.overlay').forEach((overlay) => overlay.remove());
}

/**
 * Stops the current world instance safely:
 * - Marks it as game over
 * - Stops the world run loop interval
 * - Stops the character movement/animation loops
 *
 * @param {World} worldInstance - The active world instance.
 * @returns {void}
 */
function stopWorld(worldInstance) {
    worldInstance.gameOver = true;
    worldInstance.stopRunLoop?.();
    worldInstance.character?.stopLoops?.();
}

/**
 * Stops general world sounds (background, walking).
 *
 * @param {World} worldInstance - The active world instance.
 * @returns {void}
 */
function stopWorldSounds(worldInstance) {
    worldInstance.sound?.stopBackground?.();
    worldInstance.sound?.stopWalking?.();
}

/**
 * Stops endboss-related sounds if the sound manager supports it.
 *
 * @param {World} worldInstance - The active world instance.
 * @returns {void}
 */
function stopEndbossSounds(worldInstance) {
    worldInstance.soundManager?.stopEndbossSounds?.();
}

/**
 * Initializes the game world by:
 * - Linking the canvas and keyboard.
 * - Creating a new {@link World} instance.
 * - Applying persisted mute state.
 * - Updating the music button text.
 * - Setting up touch controls (once).
 *
 * @returns {void}
 */
function init() {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);

    if (world && world.sound && typeof world.sound.setMuted === 'function') {
        world.sound.setMuted(isMuted);
    } else if (!isMuted && world && world.sound && typeof world.sound.playBackground === 'function') {
        world.sound.playBackground();
    }

    updateMusicButton();
    initTouchControls();
}

/**
 * Toggles background music and sound effects on or off.
 * Persists the state in localStorage and updates the button label.
 *
 * @returns {void}
 */
function toggleMusic() {
    isMuted = !isMuted;

    try {
        localStorage.setItem('soundMuted', isMuted ? 'true' : 'false');
    } catch (error) {
        console.error('Failed to store soundMuted in localStorage:', error);
    }

    if (world && world.sound && typeof world.sound.setMuted === 'function') {
        world.sound.setMuted(isMuted);
    }

    updateMusicButton();
}

/**
 * Updates the text label of the music button
 * based on the current mute state.
 *
 * @returns {void}
 */
function updateMusicButton() {
    const musicBtn = document.getElementById('music-btn');
    if (!musicBtn) return;

    musicBtn.innerText = isMuted ? '🔇 MUSIC: OFF' : '🎵 MUSIC: ON';
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
 * Initializes touch controls for mobile / touch devices.
 * Binds the on-screen buttons to the same flags used by the keyboard.
 *
 * @returns {void}
 */
function initTouchControls() {
    if (touchControlsInitialized) return;

    const buttons = getTouchButtons();
    if (!buttons) return;

    bindTouchButtons(buttons);
    touchControlsInitialized = true;
}

/**
 * Collects all required touch control elements.
 *
 * @returns {{leftBtn:HTMLElement,rightBtn:HTMLElement,jumpBtn:HTMLElement,throwBtn:HTMLElement}|null}
 */
function getTouchButtons() {
    const mobileControls = document.getElementById('mobile-controls');
    const leftBtn = document.getElementById('btn-left');
    const rightBtn = document.getElementById('btn-right');
    const jumpBtn = document.getElementById('btn-jump');
    const throwBtn = document.getElementById('btn-throw');

    if (!mobileControls || !leftBtn || !rightBtn || !jumpBtn || !throwBtn) return null;
    return { leftBtn, rightBtn, jumpBtn, throwBtn };
}

/**
 * Binds all buttons to keyboard flags.
 *
 * @param {{leftBtn:HTMLElement,rightBtn:HTMLElement,jumpBtn:HTMLElement,throwBtn:HTMLElement}} buttons
 * @returns {void}
 */
function bindTouchButtons(buttons) {
    bindTouchButton(buttons.leftBtn, 'LEFT');
    bindTouchButton(buttons.rightBtn, 'RIGHT');
    bindTouchButton(buttons.jumpBtn, 'JUMP');
    bindTouchButton(buttons.throwBtn, 'THROW');
}

/**
 * Binds one touch button to a keyboard flag.
 * Uses passive:false because preventDefault() is needed to block scrolling.
 *
 * @param {HTMLElement} btn
 * @param {'LEFT'|'RIGHT'|'JUMP'|'THROW'} keyFlag
 * @returns {void}
 */
function bindTouchButton(btn, keyFlag) {
    const setFlag = (value) => (keyboard[keyFlag] = value);

    btn.addEventListener('touchstart', (e) => handleTouchEvent(e, () => setFlag(true)), { passive: false });
    btn.addEventListener('touchend', (e) => handleTouchEvent(e, () => setFlag(false)), { passive: false });
    btn.addEventListener('touchcancel', (e) => handleTouchEvent(e, () => setFlag(false)), { passive: false });
}

/**
 * Normalizes touch events by preventing default scrolling and running an action.
 *
 * @param {TouchEvent} event
 * @param {Function} action
 * @returns {void}
 */
function handleTouchEvent(event, action) {
    event.preventDefault();
    action();
}


/**
 * Handles keydown events for player input.
 * Activates corresponding movement or action flags
 * in the {@link Keyboard} instance.
 *
 * @param {KeyboardEvent} e - The keydown event object.
 * @returns {void}
 */
window.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        keyboard.RIGHT = true;
    }
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        keyboard.LEFT = true;
    }
    if (e.code === 'ArrowUp' || e.code === 'KeyW') {
        keyboard.JUMP = true;
    }
    if (e.code === 'KeyF') {
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
window.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        keyboard.RIGHT = false;
    }
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        keyboard.LEFT = false;
    }
    if (e.code === 'ArrowUp' || e.code === 'KeyW') {
        keyboard.JUMP = false;
    }
    if (e.code === 'KeyF') {
        keyboard.THROW = false;
    }
});