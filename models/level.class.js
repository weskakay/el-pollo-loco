/**
 * @fileoverview Defines the {@link Level} class.
 * Represents a single game level containing all world entities,
 * such as enemies, background objects, collectible items, and clouds.
 *
 * The {@link Level} class serves as a container and configuration
 * for everything that is drawn and updated during gameplay.
 *
 * @see World
 * @see MoveableObject
 * @see BackgroundObject
 * 
 * @author KW
 * @version 1.0.0
 */

/**
 * Class representing a level in the game.
 * Holds arrays of all objects that belong to a specific stage,
 * including enemies, clouds, background layers, bottles, and coins.
 *
 * @class Level
 */
class Level {
    /**
     * Array of enemy objects within the level.
     * @type {MoveableObject[]}
     */
    enemies;
    /**
     * Array of cloud objects used as background decoration.
     * @type {Cloud[]}
     */
    clouds;
    /**
     * Array of background objects (multi-layer scenery).
     * @type {BackgroundObject[]}
     */
    backgroundObjects;
    /**
     * Array of collectible bottle objects in the level.
     * @type {Bottle[]}
     */
    bottles;
    /**
     * Array of collectible coin objects in the level.
     * @type {Coin[]}
     */
    coins;
    /**
     * The horizontal coordinate (in pixels) where the level ends.
     * Used to limit camera movement and player progression.
     * @type {number}
     */
    level_end_x = 2500;
    /**
     * Creates a new {@link Level} instance.
     *
     * @constructor
     * @param {MoveableObject[]} enemies - Array of enemy instances.
     * @param {Cloud[]} clouds - Array of cloud instances.
     * @param {BackgroundObject[]} backgroundObjects - Array of background layer instances.
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