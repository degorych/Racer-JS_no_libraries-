import Config from "../config/config.js";

export const Menu = class {
    constructor(game) {
        this.game = game;
        this.menuIndex = 0;
        this.menuTitle = 'Racer';
        this.menuItems = [
            {scene: this.game.scenes['gamePlay'], title: 'Start game'},
            {scene: this.game.scenes['gameOver'], title: 'Exit'}
        ];
    }

    update(dt) {
        // menu navigation
        const itemNumber = this.menuItems.length;

        if (this.game.checkKeyPress(Config.userButtonsKeys()[1])) { // S
            this.menuIndex++;
            this.menuIndex %= itemNumber;
        }

        if (this.game.checkKeyPress(Config.userButtonsKeys()[0])) { // W
            this.menuIndex--;
            if (this.menuIndex < 0) {
                this.menuIndex = itemNumber - 1;
            }
        }

        if (this.game.checkKeyPress(Config.userButtonsKeys()[4])) { // ENTER
            this.game.setScene(this.menuItems[this.menuIndex]['scene']);
        }
    }

    render(ctx, canvas) {
        // fill menu background
        ctx.fillStyle = '#201f20';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // draw menu title
        const fontSizeTitle = 60;
        const titleMarginTop = 50;
        const titleFonHeight = 100;
        const titleFonMarginTop = (titleMarginTop * 2 + fontSizeTitle - titleFonHeight) / 2;

        ctx.fillStyle = '#ccc';
        ctx.fillRect(0, titleFonMarginTop, canvas.width, titleFonHeight);

        ctx.font = fontSizeTitle + 'px pixel';
        ctx.textBaseline = 'top';
        ctx.fillStyle = '#ff006d';
        ctx.fillText(this.menuTitle, (canvas.width - ctx.measureText(this.menuTitle).width) / 2, titleMarginTop);

        // draw menu items
        const itemHeight = 60, itemWidth = 250, fontSize = 20;
        ctx.font = fontSize + 'px pixel';
        for (const [index, item] of this.menuItems.entries()) {
            if (index === this.menuIndex) {
                ctx.fillStyle = '#8d0042';
                ctx.fillRect(canvas.width / 2 - itemWidth / 2, canvas.height / 2 + index * itemHeight, itemWidth, itemHeight);
            }

            ctx.fillStyle = '#fff';
            ctx.fillText(item['title'], (canvas.width - ctx.measureText(item['title']).width) / 2, canvas.height / 2 + index * itemHeight + (itemHeight - fontSize) / 2);
        }
    }
};
