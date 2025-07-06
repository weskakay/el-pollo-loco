/**
 * Class representing a background cloud.
 * Extends MoveableObject and moves slowly to the left.
 */
class Cloud extends MoveableObject {
    /**
     * Cloud vertical position.
     * @type {number}
     */
    y = 20;
    /**
     * Cloud height.
     * @type {number}
     */
    height = 250;
    /**
     * Cloud width.
     * @type {number}
     */
    width = 500;
    /**
     * Creates a new Cloud instance with random horizontal start position.
     */
    constructor(){
        super().loadImage('img/5_background/layers/4_clouds/1.png');
        this.x = 50 + Math.random() * 2500;
        this.animate();
    }
    /**
     * Animates the cloud: makes it move slowly to the left.
     */
    animate() {
        setInterval(() => {
            this.x -= 0.3;
        }, 1000 / 60);
    }
}