import Config from "../config/config.js";

export const GameStats = class {
    constructor(game) {
        this.game = game;
        this.fullTime = this.getFullTimeDuration();
    }

    getFullTimeDuration() {
        const date = new Date(2000, 0);
        const fullTimeMillisecond = this.game.levels.reduce((accum, options) => accum + Date.parse(`2000, 1 1 ${options.lapTime}`) - Date.parse(`2000, 1`), 0);
        date.setMilliseconds(fullTimeMillisecond);
        return date.toLocaleTimeString('en-GB');
    }

    update(dt) {
        if (this.game.currentLevel === this.game.levels.length - 1 && this.game.keys[Config.userButtonsKeys()[4]]) {
            this.game.setScene(this.game.scenes['gameOver'])
        } else if (this.game.keys[Config.userButtonsKeys()[4]]) {
            this.game.currentLevel++;
            this.game.maxSpeed += Config.maxSpeedUp();
            this.game.setScene(this.game.scenes['gamePlay'])
        }
    }

    render(ctx, canvas) {
        const marginTopTitle = 80;
        const marginTopLap = 180;
        const marginTopStep = 30;

        // fill menu background
        ctx.fillStyle = '#201f20';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // draw stat title
        ctx.font = '60px pixel';
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#ff006d';
        ctx.fillText('Result', canvas.width / 2, marginTopTitle);

        // draw full stat
        ctx.font = '20px pixelSmall';
        ctx.fillStyle = '#fff';
        ctx.fillText(`Full time: ${this.fullTime}`, canvas.width / 2, marginTopLap);

        // draw last lap stat
        for (let levelNum in this.game.levels) {
            ctx.fillText(`${+levelNum + 1} lap time: ${this.game.levels[levelNum].lapTime}`, canvas.width / 2, marginTopLap + marginTopStep * (+levelNum + 1));
        }
    }
};
