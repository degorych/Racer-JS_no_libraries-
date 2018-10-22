export default class Config {
    /**
     * @description Number of pixels for unit transitions
     * @returns {number}
     */
    static displayStep() {
        return 5;
    }

    /**
     * @description Get canvas element
     * @returns {HTMLElement | null}
     */
    static canvas() {
        return document.getElementById('game');
    }

    /**
     * @description Buttons keys array for users game control
     * @returns {number[]}
     */
    static userButtonsKeys() {
        return [
            87, // W key
            83, // S key
            65, // A key
            68, // D key
            13, // Enter key
            27 // Escape key
        ];
    }

    /**
     * @description Car options for car class
     * @returns {{size: {height: number, width: number}, position: {x: number, y: number}}}
     */
    static carOptions() {
        return {
            size: {height: 50, width: 23},
            position: {x: 330, y: 450}
        };
    }

    /**
     * @description Car images paths
     * @returns {{racer: string, police: string}}
     */
    static carImagesPaths() {
        return {
            racer: 'images/racer.png',
            police: 'images/police.png'
        }
    }

    /**
     * @description Ratio of speed to unit transitions
     * @returns {number}
     */
    static stepSpeed() {
        return 1;
    }

    /**
     * @description Start game speed
     * @returns {number}
     */
    static startSpeed() {
        return 0;
    }

    /**
     * @description Car acceleration
     * @returns {number}
     */
    static speedUp() {
        return 0.2
    }

    /**
     * @description Car braking
     * @returns {number}
     */
    static speedDown() {
        return 0.5
    }

    /**
     * @description Max first lap speed
     * @returns {number}
     */
    static maxSpeed() {
        return 10;
    }

    /**
     * @description Max speed increase in next lap
     * @returns {number}
     */
    static maxSpeedUp() {
        return 3;
    }

    /**
     * @description Lap length in pixels
     * @returns {number}
     */
    static lapLength() {
        return 2300;
    }

    /**
     *
     * @description Factor of increasing the lap length depending on the lap number
     * @returns {number}
     */
    static lapLengthIncreaseFactor() {
        return 1.5;
    }

    /**
     * @description Options for levels: cars - number of cars, carSpeed - police cars speed
     * pits - number of pits (not working yet), bonuses - number of bonuses (not working yet)
     * lapTime - time during which the player drove the lap
     * @returns {*[]}
     */
    static gameLevels() {
        return [
            {cars: 5, carsSpeed: 0, pits: 5, bonuses: 5, lapTime: '00:00:00'},
            {cars: 8, carsSpeed: 5, pits: 6, bonuses: 5, lapTime: '00:00:00'},
            {cars: 13, carsSpeed: 10, pits: 7, bonuses: 4, lapTime: '00:00:00'},
            {cars: 20, carsSpeed: 15, pits: 8, bonuses: 4, lapTime: '00:00:00'},
            {cars: 30, carsSpeed: 20, pits: 9, bonuses: 3, lapTime: '00:00:00'}
        ];
    }

    // Game play render constants

    /**
     * @description Right and left road border into canvas
     * @returns {{left: number, right: number}}
     */
    static roadBorder() {
        return {left: 200, right: 500};
    }
};
