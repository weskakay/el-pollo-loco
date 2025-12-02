/**
 * @fileoverview Defines the first playable level of the game.
 * Contains all entities such as enemies, clouds, background layers,
 * bottles, and coins that appear within Level 1.
 *
 * The level is constructed by instantiating the {@link Level} class
 * with five arrays of game objects representing:
 *   1) Enemies (e.g., Chickens, Endboss)
 *   2) Clouds (decorative background elements)
 *   3) Background layers (air and parallax tiles)
 *   4) Bottles (collectible ammunition)
 *   5) Coins (collectible items)
 *
 * @author KW
 * @version 1.0.0
 */

/**
 * Creates a new instance of Level 1.
 *
 * This function encapsulates all entities that belong to Level 1 and returns
 * a fresh {@link Level} object. It is used both on initial load and when
 * resetting the game without reloading the page.
 *
 * @returns {Level} A new Level 1 instance.
 */
function createLevel1() {
  return new Level(
    /** @type {(Chicken | Endboss)[]} */
    ([
      new Chicken(),
      new Chicken(),
      new Chicken(),
      new Chicken(),
      new Chicken(),
      new Chicken(),
      new Chicken(),
      new Endboss()
    ]),

    /** @type {Cloud[]} */
    ([
      new Cloud(),
      new Cloud(),
      new Cloud(),
      new Cloud()
    ]),

    /**
     * Background layers that create the parallax scrolling effect.
     * Each group of four images (air, third, second, first layer)
     * forms one full segment of width 719px.
     * @type {BackgroundObject[]}
     */
    ([
      new BackgroundObject('img/5_background/layers/air.png', -719),
      new BackgroundObject('img/5_background/layers/3_third_layer/2.png', -719),
      new BackgroundObject('img/5_background/layers/2_second_layer/2.png', -719),
      new BackgroundObject('img/5_background/layers/1_first_layer/2.png', -719),

      new BackgroundObject('img/5_background/layers/air.png', 0),
      new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 0),
      new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 0),
      new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 0),

      new BackgroundObject('img/5_background/layers/air.png', 719),
      new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 719),
      new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 719),
      new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 719),

      new BackgroundObject('img/5_background/layers/air.png', 719 * 2),
      new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 719 * 2),
      new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 719 * 2),
      new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 719 * 2),

      new BackgroundObject('img/5_background/layers/air.png', 719 * 3),
      new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 719 * 3),
      new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 719 * 3),
      new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 719 * 3)
    ]),

    /** @type {Bottle[]} */
    ([
      new Bottle(),
      new Bottle(),
      new Bottle(),
      new Bottle(),
      new Bottle(),
      new Bottle(),
      new Bottle(),
      new Bottle(),
      new Bottle(),
      new Bottle(),
      new Bottle()
    ]),

    /** @type {Coin[]} */
    ([
      new Coin(),
      new Coin(),
      new Coin(),
      new Coin(),
      new Coin()
    ])
  );
}

/**
 * Level 1 – current instance of the first stage of the game world.
 *
 * This variable holds the active instance of Level 1 used by the {@link World}
 * class. On game reset, this reference is reassigned to a fresh instance
 * created by {@link createLevel1}, so all enemies, bottles, coins,
 * and background objects are restored to their initial state.
 *
 * @type {Level}
 */
let level1 = createLevel1();
