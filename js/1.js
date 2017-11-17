
(function (window) {

    var My = window.My || {};
    window.My = window.My || My;

    MyMathUtil = {};

    //used for radiansToDegrees and degreesToRadians
    MyMathUtil.PI_180 = Math.PI / 180;
    MyMathUtil.ONE80_PI = 180 / Math.PI;

    //precalculations for values of 90, 270 and 360 in radians
    MyMathUtil.PI2 = Math.PI * 2;
    MyMathUtil.HALF_PI = Math.PI / 2;

    //return number between 1 and 0
    MyMathUtil.normalize = function (value, minimum, maximum) {
        return (value - minimum) / (maximum - minimum);
    };

    //map normalized number to values
    MyMathUtil.interpolate = function (normValue, minimum, maximum) {
        return minimum + (maximum - minimum) * normValue;
    };

    //map a value from one set to another
    MyMathUtil.map = function (value, min1, max1, min2, max2) {
        return MyMathUtil.interpolate(MyMathUtil.normalize(value, min1, max1), min2, max2);
    };

    MyMathUtil.getRandomNumberInRange = function (min, max) {
        return min + Math.random() * (max - min);
    };

    MyMathUtil.getRandomIntegerInRange = function (min, max) {
        return Math.round(MyMathUtil.getRandomNumberInRange(min, max));
    };


}(window));

(function (window) {

    var My = window.My || {};
    window.My = window.My || My;

    My.Geom = {};

    //==================================================
    //=====================::POINT::====================
    //==================================================

    MyPoint = function (x, y) {
        this.x = isNaN(x) ? 0 : x;
        this.y = isNaN(y) ? 0 : y;
    };

    MyPoint.prototype.clone = function () {
        return new MyPoint(this.x, this.y);
    };

    MyPoint.prototype.update = function (x, y) {
        this.x = isNaN(x) ? this.x : x;
        this.y = isNaN(y) ? this.y : y;
    };

    MyPoint.prototype.equals = function (point) {
        return this.x == point.x && this.y == point.y;
    };

    MyPoint.prototype.toString = function () {
        return "{x:" + this.x + " , y:" + this.y + "}";
    };

    //==================================================
    //===================::RECTANGLE::==================
    //==================================================
    //default if null one by one
    MyRectangle = function (x, y, width, height) {
        this.update(x, y, width, height);
    };

    MyRectangle.prototype.update = function (x, y, width, height) {
        this.x = isNaN(x) ? 0 : x; // isnaonumber
        this.y = isNaN(y) ? 0 : y;
        this.width = isNaN(width) ? 0 : width;
        this.height = isNaN(height) ? 0 : height;
    };


    MyRectangle.prototype.getRight = function () {
        return this.x + this.width;
    };

    MyRectangle.prototype.getBottom = function () {
        return this.y + this.height;
    };

    MyRectangle.prototype.getCenterX = function () {
        return this.x + this.width / 2;
    };

    MyRectangle.prototype.getCenterY = function () {
        return this.y + this.height / 2;
    };

    MyRectangle.prototype.containsPoint = function (x, y) {  // in rectangle
        return x >= this.x && y >= this.y && x <= this.getRight() && y <= this.getBottom();
    };

    MyRectangle.prototype.clone = function () {
        return new MyRectangle(this.x, this.y, this.width, this.height);
    };

    MyRectangle.prototype.toString = function () {
        return "Rectangle{x:" + this.x + " , y:" + this.y + " , width:" + this.width + " , height:" + this.height + "}";
    };

}(window));


(function (window) {

    var My = window.My || {};
    window.My = window.My || My;

    MyCanvasTextUtil = {};

    //returns the biggest font size that best fits into rect
    MyCanvasTextUtil.getFontSizeForRect = function (string, fontProps, rect, canvas, fillStyle) {
        if (!canvas) {
            var canvas = document.createElement("canvas");
        }
        if (!fillStyle) {
            fillStyle = "#000000";
        }
        var context = canvas.getContext('2d');
        context.font = fontProps.getFontString();
        context.textBaseline = "top";

        var copy = fontProps.clone();
        //console.log("getFontSizeForRect() 1  : ", copy.fontSize);
        context.font = copy.getFontString();
        var width = context.measureText(string).width;
        //console.log(width, rect.width);

        //SOME DISAGREEMENT WHETHER THIS SHOOULD BE WITH && or ||
        if (width < rect.width) {
            while (context.measureText(string).width < rect.width || copy.fontSize * 1.5 < rect.height) {
                copy.fontSize++;
                context.font = copy.getFontString();
            }
        } else if (width > rect.width) {
            while (context.measureText(string).width > rect.width || copy.fontSize * 1.5 > rect.height) {
                copy.fontSize--;
                context.font = copy.getFontString();
            }
        }
        //console.log("getFontSizeForRect() 2  : ", copy.fontSize);
        return copy.fontSize;
    }

    //=========================================================================================
    //==============::CANVAS TEXT PROPERTIES::====================================
    //========================================================

    MyCanvasTextProperties = function (fontWeight, fontStyle, fontSize, fontFace) {
        this.setFontWeight(fontWeight);
        this.setFontStyle(fontStyle);
        this.setFontSize(fontSize);
        this.fontFace = fontFace ? fontFace : "sans-serif";
    };

    MyCanvasTextProperties.NORMAL = "normal";
    MyCanvasTextProperties.BOLD = "bold";
    MyCanvasTextProperties.BOLDER = "bolder";
    MyCanvasTextProperties.LIGHTER = "lighter";

    MyCanvasTextProperties.ITALIC = "italic";
    MyCanvasTextProperties.OBLIQUE = "oblique";


    MyCanvasTextProperties.prototype.setFontWeight = function (fontWeight) {
        switch (fontWeight) {
            case MyCanvasTextProperties.NORMAL:
            case MyCanvasTextProperties.BOLD:
            case MyCanvasTextProperties.BOLDER:
            case MyCanvasTextProperties.LIGHTER:
                this.fontWeight = fontWeight;
                break;
            default:
                this.fontWeight = MyCanvasTextProperties.NORMAL;
        }
    };

    MyCanvasTextProperties.prototype.setFontStyle = function (fontStyle) {
        switch (fontStyle) {
            case MyCanvasTextProperties.NORMAL:
            case MyCanvasTextProperties.ITALIC:
            case MyCanvasTextProperties.OBLIQUE:
                this.fontStyle = fontStyle;
                break;
            default:
                this.fontStyle = MyCanvasTextProperties.NORMAL;
        }
    };

    MyCanvasTextProperties.prototype.setFontSize = function (fontSize) {
        if (fontSize && fontSize.indexOf && fontSize.indexOf("px") > -1) {
            var size = fontSize.split("px")[0];
            fontProperites.fontSize = isNaN(size) ? 24 : size;//24 is just an arbitrary number
            return;
        }
        this.fontSize = isNaN(fontSize) ? 24 : fontSize;//24 is just an arbitrary number
    };

    MyCanvasTextProperties.prototype.clone = function () {
        return new MyCanvasTextProperties(this.fontWeight, this.fontStyle, this.fontSize, this.fontFace);
    };

    MyCanvasTextProperties.prototype.getFontString = function () {
        return this.fontWeight + " " + this.fontStyle + " " + this.fontSize + "px " + this.fontFace;
    };

}(window));


window.requestAnimationFrame =
    window.__requestAnimationFrame ||
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    (function () {
        return function (callback, element) {
            var lastTime = element.__lastTime;
            if (lastTime === undefined) {
                lastTime = 0;
            }
            var currTime = Date.now();
            var timeToCall = Math.max(1, 33 - (currTime - lastTime));
            window.setTimeout(callback, timeToCall);
            element.__lastTime = currTime + timeToCall;
        };
    })();
var readyStateCheckInterval = setInterval(function () {
    if (document.readyState === "complete") {
        clearInterval(readyStateCheckInterval);
        init();
    }
}, 10);
