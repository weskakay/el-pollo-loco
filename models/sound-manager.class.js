/**
 * @fileoverview Defines the {@link SoundManager} class.
 * Centralized manager for all in-game audio, including background music,
 * sound effects, and event-triggered sounds. Handles volume levels,
 * playback control, and mute-state checks via the global `isMuted` flag.
 *
 * The {@link SoundManager} ensures all audio resources are preloaded,
 * normalized in volume, and reused efficiently across the game.
 *
 * @see World
 * @see Character
 * @see Endboss
 * 
 * @author KW
 * @version 1.0.0
 */

/**
 * Class responsible for managing all audio playback in the game.
 * Handles sound effects for actions (jumping, throwing, collisions),
 * environmental sounds, background music, and victory/defeat cues.
 *
 * @class SoundManager
 */
class SoundManager {
    /**
     * Background music for continuous playback during gameplay.
     * @type {HTMLAudioElement}
     */
    backgroundMusic = new Audio('audio/music.mp3');
    /**
     * Sound played when the player is hurt.
     * @type {HTMLAudioElement}
     */
    hurtSound = new Audio('audio/ouch.mp3');
    /**
     * Sound played when the player jumps.
     * @type {HTMLAudioElement}
     */
    jumpSound = new Audio('audio/jump.mp3');
    /**
     * Sound played when the player throws a bottle.
     * @type {HTMLAudioElement}
     */
    throwSound = new Audio('audio/throw.mp3');
    /**
     * Looping sound for player walking/running movement.
     * @type {HTMLAudioElement}
     */
    walkingSound = new Audio('audio/running.mp3');

    /**
     * Alert sound when the Endboss becomes active.
     * @type {HTMLAudioElement}
     */
    endbossAlertSound = new Audio('audio/endboss_alert.mp3');

    /**
     * Attack sound triggered when the Endboss attacks.
     * @type {HTMLAudioElement}
     */
    endbossAttackSound = new Audio('audio/endboss_attack.mp3');

    /**
     * Sound played when the player loses the game.
     * @type {HTMLAudioElement}
     */
    gameOverSound = new Audio('audio/gameover.mp3');

    /**
     * Sound played when the player wins the game.
     * @type {HTMLAudioElement}
     */
    gameWinSound = new Audio('audio/gamewin.mp3');

    /**
     * Sound played when a chicken enemy dies.
     * @type {HTMLAudioElement}
     */
    chickenDeadSound = new Audio('audio/chicken.mp3');

    /**
     * Sound effect for collecting a coin.
     * @type {HTMLAudioElement}
     */
    coinSound = new Audio('audio/coin.wav');

    /**
     * Sound effect for picking up a bottle.
     * @type {HTMLAudioElement}
     */
    bottlePickupSound = new Audio('audio/bottle.mp3');

    /**
     * Initializes a new {@link SoundManager} instance.
     * Configures volume levels and enables looping for background music.
     *
     * @constructor
     */
    constructor() {
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = 0.2;
        this.walkingSound.volume = 0.3;
        this.jumpSound.volume = 0.07;
        this.hurtSound.volume = 0.5;
        this.throwSound.volume = 0.5;
        this.endbossAlertSound.volume = 0.6;
        this.endbossAttackSound.volume = 0.6;
        this.gameOverSound.volume = 0.5;
        this.gameWinSound.volume = 0.5;
        this.coinSound.volume = 0.5;
        this.chickenDeadSound.volume = 0.5;
        this.bottlePickupSound.volume = 0.5;
    }
    /**
     * Starts background music playback if not muted.
     * @returns {void}
     */
    playBackground() {
        if (!isMuted) this.backgroundMusic.play();
    }
    /**
     * Pauses the background music playback.
     * @returns {void}
     */
    stopBackground() {
        this.backgroundMusic.pause();
    }
    /**
     * Plays the hurt sound effect.
     * @returns {void}
     */
    playHurt() {
        if (!isMuted) {
            this.hurtSound.currentTime = 0;
            this.hurtSound.play();
        }
    }
    /**
     * Plays the jump sound effect.
     * @returns {void}
     */
    playJump() {
        if (!isMuted) {
            this.jumpSound.currentTime = 0;
            this.jumpSound.play();
        }
    }
    /**
     * Plays the bottle throw sound effect.
     * @returns {void}
     */
    playThrow() {
        if (!isMuted) {
            this.throwSound.currentTime = 0;
            this.throwSound.play();
        }
    }
    /**
     * Plays the walking/running sound effect.
     * @returns {void}
     */
    playWalking() {
        if (!isMuted) {
            this.walkingSound.currentTime = 0;
            this.walkingSound.play();
        }
    }
    /**
     * Plays the game-over sound effect.
     * @returns {void}
     */
    playGameOver() {
        if (!isMuted) {
            this.gameOverSound.currentTime = 0;
            this.gameOverSound.play();
        }
    }
    /**
     * Plays the victory sound when the player wins.
     * @returns {void}
     */
    playGameWin() {
        if (!isMuted) {
            this.gameWinSound.currentTime = 0;
            this.gameWinSound.play();
        }
    }
    /**
     * Plays the Endboss alert sound (when the boss becomes active).
     * @returns {void}
     */
    playEndbossAlert() {
        if (!isMuted) {
            this.endbossAlertSound.currentTime = 0;
            this.endbossAlertSound.play();
        }
    }
    /**
     * Plays the Endboss attack sound.
     * @returns {void}
     */
    playEndbossAttack() {
        if (!isMuted) {
            this.endbossAttackSound.currentTime = 0;
            this.endbossAttackSound.play();
        }
    }
    /**
     * Plays the coin collection sound.
     * @returns {void}
     */
    playCoinSound() {
        if (!isMuted) {
            this.coinSound.currentTime = 0;
            this.coinSound.play();
        }
    }
    /**
     * Plays the bottle pickup sound.
     * @returns {void}
     */
    playBottlePickup() {
        if (!isMuted) {
            this.bottlePickupSound.currentTime = 0;
            this.bottlePickupSound.play();
        }
    }
    /**
     * Plays the chicken death sound effect.
     * @returns {void}
     */
    playChickenDead() {
        if (!isMuted) {
            this.chickenDeadSound.currentTime = 0;
            this.chickenDeadSound.play();
        }
    }
}