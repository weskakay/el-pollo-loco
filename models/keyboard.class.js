/**
 * @fileoverview Defines the {@link Keyboard} class.
 * Represents the state of keyboard inputs used for controlling
 * the player character and triggering in-game actions.
 *
 * The keyboard class stores boolean flags for each control key
 * (movement, jump, throw) that are set and unset by global event listeners
 * in the game loop.
 *
 * @see Character
 * @see World
 * 
 * @author KW
 * @version 1.0.0
 */

/**
 * Class representing keyboard input.
 * Captures and tracks the state of pressed keys for character control.
 *
 * @class Keyboard
 */
class Keyboard {
    /**
     * Indicates whether the left arrow key or 'A' is pressed.
     * @type {boolean}
     */
    LEFT = false;
    /**
     * Indicates whether the right arrow key or 'D' is pressed.
     * @type {boolean}
     */
    RIGHT = false;
    /**
     * Indicates whether the up arrow key or 'W' is pressed.
     * @type {boolean}
     */
    UP = false;
    /**
     * Indicates whether the down arrow key or 'S' is pressed.
     * @type {boolean}
     */
    DOWN = false;
    /**
     * Indicates whether the spacebar or 'J' key is pressed for jumping.
     * @type {boolean}
     */
    SPACE = false;
    /**
     * Indicates whether the 'T' key is pressed for throwing a bottle.
     * @type {boolean}
     */
    THROW = false;
}