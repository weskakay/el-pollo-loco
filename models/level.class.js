/**
 * Class representing a level in the game.
 * Contains enemies, clouds, and background objects.
 */
class Level {
    /**
     * Array of enemy objects.
     * @type {MoveableObject[]}
     */
    enemies;
    /**
     * Array of cloud objects.
     * @type {Cloud[]}
     */
    clouds;
    /**
     * Array of background objects.
     * @type {BackgroundObject[]}
     */
    backgroundObjects;
    bottles;
    coins;
    /**
     * X coordinate where the level ends.
     * @type {number}
     */
    level_end_x = 2200;
    /**
     * Creates a new Level instance.
     * @param {MoveableObject[]} enemies - Array of enemy instances.
     * @param {Cloud[]} clouds - Array of cloud instances.
     * @param {BackgroundObject[]} backgroundObjects - Array of background object instances.
     * @param {Bottle[]} bottles - Array of bottle instances.
     * @param {Coin[]} coins - Array of coin instances.
     */
    constructor(enemies, clouds, backgroundObjects, bottles, coins) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.bottles = bottles;
        this.coins = coins;
    }
}