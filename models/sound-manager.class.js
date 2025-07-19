class SoundManager {
    backgroundMusic = new Audio('audio/music.mp3');
    hurtSound = new Audio('audio/ouch.mp3');
    jumpSound = new Audio('audio/jump.mp3');
    throwSound = new Audio('audio/throw.mp3');
    walkingSound = new Audio('audio/running.mp3');
    gameOverSound = new Audio('audio/gameover.mp3');

    constructor() {
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = 0.2;
        this.walkingSound.volume = 0.3;
        this.jumpSound.volume = 0.07;
        this.hurtSound.volume = 0.5;
        this.throwSound.volume = 0.5;
        this.gameOverSound.volume = 0.5;
    }

    playBackground() {
        if (!isMuted) this.backgroundMusic.play();
    }
    stopBackground() {
        this.backgroundMusic.pause();
    }
    playHurt() {
        if (!isMuted) {
            this.hurtSound.currentTime = 0;
            this.hurtSound.play();
        }
    }
    playJump() {
        if (!isMuted) {
            this.jumpSound.currentTime = 0;
            this.jumpSound.play();
        }
    }
    playThrow() {
        if (!isMuted) {
            this.throwSound.currentTime = 0;
            this.throwSound.play();
        }
    }
    playWalking() {
        if (!isMuted) {
            this.walkingSound.currentTime = 0;
            this.walkingSound.play();
        }
    }
    playGameOver() {
        if (!isMuted) {
            this.gameOverSound.currentTime = 0;
            this.gameOverSound.play();
        }
    }
}   