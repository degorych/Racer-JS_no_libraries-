// Config
import Config from './config/config.js';

//Scenes
import {Menu} from './scenes/Menu.js';
import {GamePlay} from './scenes/GamePlay.js';
import {GameStats} from './scenes/GameStats.js';
import {GameOver} from './scenes/GameOver.js';

const scenes = {menu: Menu, gamePlay: GamePlay, gameStats: GameStats, gameOver: GameOver};

// Game class
class Game {
    constructor() {
        this.canvas = Config.canvas();
        this.ctx = this.canvas.getContext('2d');
        this.initializeKeys(Config.userButtonsKeys());
        this.scenes = scenes;
        this.levels = Config.gameLevels();
        this.currentLevel = 0;
        this.maxSpeed = Config.maxSpeed();
        this.lapLength = Config.lapLength();
        this.setScene(this.scenes['menu']);
        this.initializeKeyListeners();
        this.start(this.render());
    }

    initializeKeys(keysObj) {
        this.keys = {};
        for (let key in keysObj) {
            if (keysObj.hasOwnProperty(key)) {
                this.keys[key] = false;
            }
        }
    }

    initializeKeyListeners() {
        document.addEventListener('keydown', e => {
            this.keys[e.keyCode] = true;
        });

        document.addEventListener('keyup', e => {
            this.keys[e.keyCode] = false;
        });
    }

    checkKeyPress(keyCode) {
        let isKeyPressed = !!this.keys[keyCode];
        this.lastKeyState = this.lastKeyState || {};

        if (typeof this.lastKeyState[keyCode] === 'undefined') {
            this.lastKeyState[keyCode] = isKeyPressed;
            return false;
        }

        if (this.lastKeyState[keyCode] !== isKeyPressed) {
            this.lastKeyState[keyCode] = isKeyPressed;
            return isKeyPressed;
        }

        return false;
    }

    setScene(Scene) {
        this.activeScene = new Scene(this);
    }

    update(dt) {
        this.activeScene.update(dt);
    }

    render() {
        this.ctx.save();
        this.activeScene.render(this.ctx, this.canvas);
        this.ctx.restore();
    }

    start() {
        let last = performance.now(),
            step = 1 / 30,
            dt = 0,
            now;

        let frame = () => {
            now = performance.now();
            dt += (now - last) / 1000;
            while (dt > step) {
                dt -= step;
                this.update(step);
            }
            last = now;

            this.render();
            requestAnimationFrame(frame);
        };

        requestAnimationFrame(frame);
    }
}

//Start game
let game = new Game();
