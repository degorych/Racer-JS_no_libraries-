import Config from '../config/config.js';

export default class Car {
    constructor(position, imagePath) {
        this.carHalfHeight = Math.ceil(Config.carOptions().size.height / 2);
        this.carHalfWidth = Math.ceil(Config.carOptions().size.width / 2);
        this.imagePath = imagePath;
        this.carImage = this.createCarImage();
        this.carCenterPoint = this.carCenterPoint(position);
        this.vector = false;
    }

    createCarImage() {
        if (this.imagePath) {
            const image = new Image();
            image.src = this.imagePath;
            return image;
        }
        return false;
    }

    carCenterPoint(point) {
        return {
            x: point.x + this.carHalfWidth,
            y: point.y + this.carHalfHeight
        }
    }

    checkLeftRoadBorder(leftBorder) {
        return (leftBorder <= this.carCenterPoint.x - Config.displayStep());
    }

    checkRightRoadBorder(rightBorder) {
        return (rightBorder >= this.carCenterPoint.x + Config.displayStep() + this.carHalfHeight);
    }

    checkCarsContact(point) {
        return (Math.abs(point.y - this.carCenterPoint.y) - 2 * this.carHalfHeight <= 0) && (Math.abs(point.x - this.carCenterPoint.x) - 2 * this.carHalfWidth <= 0);
    }
};
