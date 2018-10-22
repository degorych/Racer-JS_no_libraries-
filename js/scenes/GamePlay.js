import Config from "../config/config.js";
import Car from "../game_elements/Car.js";

export const GamePlay = class {
    constructor(game) {
        this.game = game;
        this.gameStatsScene = this.game.scenes.gameStats;
        this.gameLevel = this.game.levels[this.game.currentLevel];
        this.racer = new Car(Config.carOptions().position, this.carSelector());
        this.speed = Config.startSpeed();
        this.startLapTime = performance.now();
        this.currentTime = 0;
        this.lapLength = this.game.lapLength;
        this.police = this.createPolice();
        this.pause = false;
        this.pauseTime = 0;
    }

    carSelector() {
        return Config.carImagesPaths()['racer'].replace('racer', 'racer' + this.game.currentLevel)
    }

    lapDuration(startTime) {
        const time = new Date(2000, 0);
        time.setMilliseconds(performance.now() - startTime);
        this.currentTime = time.toLocaleTimeString('en-GB');
    }

    changeLapLength(speed) {
        this.lapLength = this.lapLength - Math.round(speed * Config.stepSpeed());
    }

    getPointProgress(currentPath) {
        return this.game.canvas.width - 200 - (this.game.canvas.width - 200) * currentPath / this.game.lapLength;
    }

    random(min, max) {
        return Math.floor(min + Math.random() * (max + 1 - min));
    }

    randomSpeedVector() {
        return this.random(1, 2) === 1 ? 1 : -1;
    }

    createPolice() {
        const police = [];
        const carPixelInterval = (this.lapLength - this.game.canvas.height) / this.gameLevel.cars;
        for (let i = 0; i < this.gameLevel.cars; i++) {
            police.push(new Car(
                {
                    x: this.random(Config.roadBorder()['left'] + Config.carOptions().size.width, Config.roadBorder()['right'] - Config.carOptions().size.width * 2),
                    y: -this.random(this.game.canvas.height / 2 + carPixelInterval * i / Config.stepSpeed(), carPixelInterval * (i + 1) / Config.stepSpeed())
                },
                Config.carImagesPaths()['police']));
            police[i].vector = this.randomSpeedVector();
        }
        return police;
    }

    update(dt) {
        if (this.lapLength <= 0) {
            this.game.levels[this.game.currentLevel].lapTime = this.currentTime;
            this.game.lapLength *= Config.lapLengthIncreaseFactor();
            this.game.setScene(this.gameStatsScene);
        }

        for (let police of this.police) {
            if (this.racer.checkCarsContact(police.carCenterPoint)) { // Check crash
                this.speed = 0;
            }

            if (this.gameLevel.carsSpeed) { // If police can drive right ot left
                let vectorSign = police.vector > 0 ? 1 : -1;

                if (police.vector * (police.vector - dt * vectorSign) <= 0) {
                    police.vector = this.randomSpeedVector();
                    vectorSign = police.vector > 0 ? 1 : -1;
                }

                police.vector -= dt * vectorSign;

                let policeSpeed = this.gameLevel.carsSpeed * Config.displayStep() * dt * vectorSign;
                const newPositionX = police.carCenterPoint.x + policeSpeed;
                if (newPositionX <= Config.roadBorder()['left'] + police.carHalfWidth || newPositionX >= Config.roadBorder()['right'] - police.carHalfWidth * 2) {
                    police.vector = -vectorSign;
                    policeSpeed = -policeSpeed;
                }
                police.carCenterPoint.x += policeSpeed;
            }
        }

        if (this.pause) { // If pause
            if (this.game.checkKeyPress(Config.userButtonsKeys()[5])) {
                this.pause = false;
                this.startLapTime += performance.now() - this.pauseTime;
            }
            return;
        }

        if (this.game.checkKeyPress(Config.userButtonsKeys()[5])) { // Create pause
            this.pause = true;
            this.pauseTime = performance.now();
            return;
        }

        this.lapDuration(this.startLapTime);
        this.changeLapLength(this.speed);

        for (let police of this.police) { // Move police cars ih height
            police.carCenterPoint.y += this.speed * Config.stepSpeed();
        }

        if (this.game.keys[Config.userButtonsKeys()[0]] && this.speed < this.game.maxSpeed) { // Press W
            this.speed += Config.speedUp();
        }

        if (this.speed > 0 && (!this.game.keys[Config.userButtonsKeys()[0]] || this.game.keys[Config.userButtonsKeys()[1]])) { // Press S or not press W
            this.speed -= Config.speedDown();
        }

        if (this.game.keys[Config.userButtonsKeys()[2]] && this.racer.checkLeftRoadBorder(Config.roadBorder()['left'])) { // Press A
            this.racer.carCenterPoint.x = this.racer.carCenterPoint.x - Config.displayStep();
        }

        if (this.game.keys[Config.userButtonsKeys()[3]] && this.racer.checkRightRoadBorder(Config.roadBorder()['right'])) { // Press D
            this.racer.carCenterPoint.x = this.racer.carCenterPoint.x + Config.displayStep();
        }
    }

    render(ctx, canvas) {
        // Main view
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#69b725';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#727272';
        ctx.fillRect(Config.roadBorder()['left'], 0, Config.roadBorder()['right'], canvas.height);
        ctx.fillStyle = '#000';
        ctx.fillRect(500, 0, canvas.width - 500, canvas.height);

        // Start
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.font = '18px pixelSmall';
        ctx.fillStyle = '#fff';
        ctx.fillText('START', 50, 30);

        // Finish
        ctx.fillText('FINISH', 50, canvas.height - 30);

        // Progress line
        ctx.beginPath();
        ctx.moveTo(50, 50);
        ctx.lineTo(50, canvas.height - 50);
        ctx.lineWidth = 5;
        ctx.strokeStyle = '#fff';
        ctx.stroke();

        // Progress pointer
        ctx.beginPath();
        ctx.moveTo(55, 50 + this.getPointProgress(this.lapLength));
        ctx.lineTo(75, 60 + this.getPointProgress(this.lapLength));
        ctx.lineTo(75, 40 + this.getPointProgress(this.lapLength));
        ctx.fillStyle = '#e12400';
        ctx.fill();

        // Speed text
        const gameOverText = `Speed: ${Math.round(this.speed)}km/h`;
        ctx.fillStyle = '#fff';
        ctx.fillText(gameOverText, 500 + (canvas.width - 500) / 2, 50);

        // Duration text
        const timeLap = `Duration: ${this.currentTime}`;
        ctx.fillText(timeLap, 500 + (canvas.width - 500) / 2, 80);

        //Add main car
        ctx.drawImage(this.racer.carImage, this.racer.carCenterPoint.x, this.racer.carCenterPoint.y);

        //Police
        for (let police of this.police) {
            ctx.drawImage(police.carImage, police.carCenterPoint.x, police.carCenterPoint.y);
        }

        if (this.pause) {
            ctx.fillStyle = 'rgb(0, 0, 0, 0.6)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#fff';
            ctx.font = '60px pixel';
            ctx.fillText('Pause', canvas.width / 2, canvas.height / 2);
        }
    }
};
