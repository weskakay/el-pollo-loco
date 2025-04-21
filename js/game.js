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
 * Sound for throwing a bottle.
 * @type {HTMLAudioElement}
 */
let throwSound = new Audio('audio/throw.mp3');
/**
 * Initializes the game by creating the world and linking the canvas and keyboard.
 */
function init() {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
    console.log('My Character is', world.character);
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
    if (e.code == "Space") {
        keyboard.SPACE = true;
    }
    if (e.code == "KeyO") {
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
    if (e.code == "Space") {
        keyboard.SPACE = false;
    }
    if (e.code == "KeyO") {
        keyboard.THROW = false;
    }
});
/**
 * Throws a bottle if enough time has passed since the last throw.
 */
function throwBottle() {
    if (world) {
        let bottle = new ThrowableObject(world.character.x + 100, world.character.y + 100);
        world.throwableObjects.push(bottle);
    }
    throwSound.play();
}