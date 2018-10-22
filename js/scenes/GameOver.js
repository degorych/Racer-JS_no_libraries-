import Config from "../config/config.js";

export const GameOver = class {
    constructor(game) {
        this.game = game;
    }

    update(dt) {
        if (this.game.checkKeyPress(Config.userButtonsKeys()[4])) { // ENTER
            this.game.currentLevel = 0;
            this.game.maxSpeed = Config.maxSpeed();
            this.game.levels = Config.gameLevels();
            this.game.lapLength = Config.lapLength();
            this.game.setScene(this.game.scenes['menu']);
        }
    }

    render(ctx, canvas) {
        // clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // display "game over" text
        const gameOverText = 'Game Over';
        ctx.textBaseline = 'top';
        ctx.font = '70px pixel';
        ctx.fillStyle = '#ee4024';
        ctx.fillText(gameOverText, (canvas.width - ctx.measureText(gameOverText).width) / 2, canvas.height / 2 - 50);
    }
};
