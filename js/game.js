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
 * Initializes and starts the game.
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
 * Reloads the page to reset the game state.
 */
function resetGame() {
    location.reload();
}
/**
 * Initializes the game by creating the world and linking the canvas and keyboard.
 */
function init() {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
    world.sound.playBackground();
    updateMusicButton();
}
/**
 * Toggles background music on or off.
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

function updateMusicButton() {
    const btn = document.getElementById('music-btn');
    btn.textContent = isMuted ? '🔇 MUSIC: OFF' : '🎵 MUSIC: ON';
}
/**
 * Shows or hides the help screen.
 */
function toggleHelp() {
    document.getElementById('help-screen').classList.toggle('d-none');
}
/**
 * Throws a bottle if enough time has passed since the last throw.
 */
function throwBottle() {
    if (world) {
        let bottle = new ThrowableObject(world.character.x + 100, world.character.y + 100);
        world.throwableObjects.push(bottle);
        world.sound.playThrow();
    }
    
}
// Key down event: recognize movement and throwing immediately
window.addEventListener("keydown", (e) => {
    if (e.code == "ArrowRight" || e.code == "KeyD") {
        keyboard.RIGHT = true;
    }
    if (e.code == "ArrowLeft" || e.code == "KeyA") {
        keyboard.LEFT = true;
    }
    if (e.code == "ArrowUp" || e.code == "KeyW") {
        keyboard.UP = true;
    }
    if (e.code == "ArrowDown" || e.code == "KeyS") {
        keyboard.DOWN = true;
    }
    if (e.code == "KeyJ") {
        keyboard.SPACE = true;
    }
    if (e.code == "KeyT") {
        keyboard.THROW = true;
        throwBottle();
    }
});
// Key up event: stop movement and throwing
window.addEventListener("keyup", (e) => {
    if (e.code == "ArrowRight" || e.code == "KeyD") {
        keyboard.RIGHT = false;
    }
    if (e.code == "ArrowLeft" || e.code == "KeyA") {
        keyboard.LEFT = false;
    }
    if (e.code == "ArrowUp" || e.code == "KeyW") {
        keyboard.UP = false;
    }
    if (e.code == "ArrowDown" || e.code == "KeyS") {
        keyboard.DOWN = false;
    }
    if (e.code == "KeyJ") {
        keyboard.SPACE = false;
    }
    if (e.code == "KeyT") {
        keyboard.THROW = false;
    }
});