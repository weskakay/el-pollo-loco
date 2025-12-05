/**
 * @fileoverview Defines the second playable level of the game.
 * Similar to Level 1 but with adjusted difficulty,
 * enemy placement and collectibles.
 *
 * @author KW
 * @version 1.0.0
 */

/**
 * Creates a new instance of Level 2.
 *
 * @returns {Level} A new Level 2 instance.
 */
function createLevel2() {
    return new Level(

        /**
         * Enemies appearing in Level 2.
         * Slightly harder: more chickens + two endbosses.
         * @type {Array<Chicken | SmallChicken | Endboss>}
         */
        [
            
            new SmallChicken(),
            new SmallChicken(),
            new SmallChicken(),
            new SmallChicken(),
            new SmallChicken(),
            new SmallChicken(),
            new SmallChicken(),
            new Chicken(),
            new Chicken(),
            new Chicken(),
            new Chicken(),
            new Chicken(),
            new Chicken(),
            new Chicken(),
            new Chicken(),
            new Endboss(719 * 2.5),
            new Endboss(719 * 4.1)
        ],

        /**
         * Cloud objects for background ambience.
         * @type {Cloud[]}
         */
        [
            new Cloud(),
            new Cloud(),
            new Cloud(),
            new Cloud(),
            new Cloud(),
            new Cloud()
        ],

        /**
         * Background layers that create the parallax scrolling effect.
         * Each group of images (air, 3rd, 2nd, 1st layer)
         * forms one full segment of width 719px.
         *
         * @type {BackgroundObject[]}
         */
        [
            // Segment -1 (hidden left)
            new BackgroundObject('img/5_background/layers/air.png', -719),
            new BackgroundObject('img/5_background/layers/3_third_layer/2.png', -719),
            new BackgroundObject('img/5_background/layers/2_second_layer/2.png', -719),
            new BackgroundObject('img/5_background/layers/1_first_layer/2.png', -719),

            // Segment 0
            new BackgroundObject('img/5_background/layers/air.png', 0),
            new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 0),
            new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 0),
            new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 0),

            // Segment 1
            new BackgroundObject('img/5_background/layers/air.png', 719),
            new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 719),
            new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 719),
            new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 719),

            // Segment 2
            new BackgroundObject('img/5_background/layers/air.png', 719 * 2),
            new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 719 * 2),
            new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 719 * 2),
            new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 719 * 2),

            // Segment 3
            new BackgroundObject('img/5_background/layers/air.png', 719 * 3),
            new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 719 * 3),
            new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 719 * 3),
            new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 719 * 3),

            // Segment 4
            new BackgroundObject('img/5_background/layers/air.png', 719 * 4),
            new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 719 * 4),
            new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 719 * 4),
            new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 719 * 4),

            // Segment 5
            new BackgroundObject('img/5_background/layers/air.png', 719 * 5),
            new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 719 * 5),
            new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 719 * 5),
            new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 719 * 5)
        ],

        /**
         * Bottles that the player can collect.
         * @type {Bottle[]}
         */
        [
            new Bottle(), new Bottle(), new Bottle(), new Bottle(), new Bottle(),
            new Bottle(), new Bottle(), new Bottle(), new Bottle(), new Bottle(),
            new Bottle(), new Bottle(), new Bottle(), new Bottle(), new Bottle(),
            new Bottle(), new Bottle(), new Bottle(), new Bottle(), new Bottle(),
            new Bottle(), new Bottle(), new Bottle(), new Bottle(), new Bottle()
        ],

        /**
         * Coins available throughout the level.
         * @type {Coin[]}
         */
        [
            new Coin(), new Coin(), new Coin(), new Coin(), new Coin(),
            new Coin(), new Coin(), new Coin(), new Coin(), new Coin(),
            new Coin(), new Coin(), new Coin()
        ]
    );
}

/**
 * Level 2 – instance of the second stage of the game world.
 *
 * @type {Level}
 */
let level2 = createLevel2();