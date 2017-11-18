//qjytoggle togglea
var version = 2;
function toggle() {
    var togglea = document.getElementById("togglea");
    //    console.log("togglea.text-->"+togglea.text);
    if (togglea.text == "初阶版") {
        version = 3;
        scrollSpeed = 2.5;

        tubeWidth = 50;

        gravity = 0.35;
        tapBoost = 6.2;

        tubeGapHeight = 170;//230
        togglea.text = "高阶版";
    } else if (togglea.text == "高阶版") {
        version = 2;
        scrollSpeed = 3;

        tubeWidth = 80;

        gravity = 1;
        tapBoost = 12;

        tubeGapHeight = 190;//230
        togglea.text = "初阶版";
    }
    window.cancelAnimationFrame(myreqanim);// myreqanim
    json = [{ "1": "loading..." }];
    //getData();
    xhrflag = false;
    firstInFlag = true;
    //window.cancelAnimationFrame(myreqanim);// myreqanim
    gameState = HOME;
    commitResize();
}

//========================
//general properties for demo set up
//========================
var canvas;
var context;
var canvasContainer;
var htmlBounds;
var bounds;
var minimumStageWidth = 300;
var minimumStageHeight = 300;
var maxStageWidth = 800;
var maxStageHeight = 1100;
var resizeTimeoutId = -1;

function init() {
    canvasContainer = document.getElementById("canvasContainer");
    window.onresize = resizeHandler;
    window.addEventListener("keydown", keyUpEventHandler, false)
    commitResize();
}

function getWidth(element) { return Math.max(element.scrollWidth, element.offsetWidth, element.clientWidth); }
function getHeight(element) { return Math.max(element.scrollHeight, element.offsetHeight, element.clientHeight); }

//avoid running resize scripts repeatedly if a browser window is being resized by dragging
function resizeHandler() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    clearTimeout(resizeTimeoutId);
    clearTimeoutsAndIntervals();
    resizeTimeoutId = setTimeout(commitResize, 300);
}

//qjyresize
function commitResize() {
    if (canvas) {
        canvasContainer.removeChild(canvas);
    }
    canvas = document.createElement('canvas');
    canvas.style.position = "absolute";
    context = canvas.getContext("2d");
    canvasContainer.appendChild(canvas);

    htmlBounds = new MyRectangle(0, 0, getWidth(canvasContainer), getHeight(canvasContainer));
    if (htmlBounds.width >= maxStageWidth) {
        canvas.width = maxStageWidth;
        canvas.style.left = htmlBounds.getCenterX() - (maxStageWidth / 2) + "px";
    } else {
        canvas.width = htmlBounds.width;
        canvas.style.left = "0px";
    }
    if (htmlBounds.height > maxStageHeight) {
        canvas.height = maxStageHeight;
        canvas.style.top = htmlBounds.getCenterY() - (maxStageHeight / 2) + "px";
    } else {
        canvas.height = htmlBounds.height;
        canvas.style.top = "0px";
    }
    bounds = new MyRectangle(0, 0, canvas.width, canvas.height);
    context.clearRect(0, 0, canvas.width, canvas.height);

    var textInputSpan = document.getElementById("textInputSpan");
    var textInputSpanY = (canvas.height - canvas.height * .85) / 2 + 15;//15 is an estimate for half of textInputHeight
    textInputSpan.style.top = htmlBounds.getCenterY() + (bounds.height / 2) - textInputSpanY + "px";
    textInputSpan.style.left = (htmlBounds.getCenterX() - getWidth(textInputSpan) / 2) + "px";

    var span2 = document.getElementById("span2");
    var span2Y = (canvas.height - canvas.height * .85) / 2 - 20;
    span2.style.top = htmlBounds.getCenterY() + (bounds.height / 2) - span2Y + "px";
    span2.style.left = (htmlBounds.getCenterX() - getWidth(span2) / 2) + "px";

    startDemo();
}

//========================
//Demo specific properties
//========================

var HOME = 0;
var GAME = 1;
var GAME_OVER = 2;
var gameState;
//qjyscrollspeed
var scrollSpeed = 3;//3 2
var score;
var fontProperties = new MyCanvasTextProperties(MyCanvasTextProperties.BOLD, null, 100);

function startDemo() {
    canvas.addEventListener('touchstart', handleUserTap, false);
    canvas.addEventListener('mousedown', handleUserTap, false);

    var logoText = "FLAPPY";
    if (!logoCanvas) {
        logoCanvas = document.createElement("canvas");
        logoCanvasBG = document.createElement("canvas");
    }
    createLogo("FLAPPY", logoCanvas, logoCanvasBG);
    if (!gameOverCanvas) {
        gameOverCanvas = document.createElement("canvas");
        gameOverCanvasBG = document.createElement("canvas");
    }
    createLogo("GAME OVER", gameOverCanvas, gameOverCanvasBG);

    createGroundPattern();
    createBird();
    createTubes();
    createCityGraphic();
    score = 0;
    gameState = HOME;
    loop();
}

function loop() {// maybe problem occured here 
    switch (gameState) {
        case HOME:
            renderHome();
            break;
        case GAME:
            renderGame();// maybe problem occured here 
            break;
        case GAME_OVER:
            renderGameOver();
            break;
    }
}

function handleUserTap(event) {
    switch (gameState) {
        case HOME:
            gameState = GAME;
            break;
        case GAME:
            birdYSpeed = -tapBoost;
            break;
        case GAME_OVER:
            commitResize();
            break;
    }
    if (event) {
        event.preventDefault();
    }
}

function keyUpEventHandler(event) {
    //event.keyCode == 32 -> Space
    if (event.keyCode == 38) {
        handleUserTap(event);
    }
}
var xhrflag = false;
var firstInFlag = true;
// qjyreqanim
var myreqanim;
function renderHome() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    renderGroundPattern();
    renderLogo();
    renderInstructions();
    if (!xhrflag) {
        getData();//erased
        //        console.log("renderHome");
        xhrflag = true;
    }
    if (firstInFlag)
        drawRandkingList();
    myreqanim = window.requestAnimationFrame(loop, canvas);
}
//qjyisgameover
var isgameover = false;
// renderGame
function renderGame() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    updateTubes();
    renderTubes();
    updateBird();//in the front , check collision set isgameover
    if (isgameover) { // maybe
        //        console.log("isgameover-->" + isgameover);
        gameOverHandler();
        isgameover = false; // new game again
        return;
    }
    renderBird();
    renderGroundPattern();
    updateScore();
    renderScore();
    window.requestAnimationFrame(loop, canvas);
}
// handle gameover
function gameOverHandler() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    gameState = GAME_OVER;
    renderGameOver();
}
//------------------------------------------ getData -----------------------------------------------------------
// qjygetdata
function getData() {
    var xhr;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        xhr = new window.ActiveXObject();
    } else {
        alert("请升级至最新版本的浏览器");
    }
    if (xhr != null) {
        xhr.open("GET", "http://www.qiaojianyong.top/get" + version + "?" + " & t / " + Math.random(), true); // synchronize false
        xhr.send(null);
        //json = JSON.parse(xhr.responseText);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                json = JSON.parse(xhr.responseText);
                // console.log(json);
            }
        };
    }
    // console.log(json);
}
var json = [{ "1": "loading..." }];
// qjyfakedata
function drawRandkingList() {

    context.fillStyle = "rgba(256,256,256,0.7)";
    context.fillRect(10, canvas.height * 0.1 + gameOverCanvas.height + 12, canvas.width - 20, 12 * 2.7 * json.length);
    var row = "";
    context.font = "bold normal 17px sans-serif";
    context.fillStyle = "#171515";
    for (var i = 0, l = json.length; i < l; i++) {
        for (var key in json[i]) {
            row += json[i][key] + "      ";
        }
        context.fillText(row, bounds.getCenterX() - context.measureText(row).width / 2, canvas.height * 0.1 + gameOverCanvas.height
            + 24 * (1.5 + 1.2 * i));
        row = "";
    }
}
//------------------------------------------ insert -----------------------------------------------------------
// qjyinsertpost
function insert() {
    var xhr;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        xhr = new window.ActiveXObject();
    } else {
        alert("请升级至最新版本的浏览器");
    }
    var textInput = document.getElementById("textInput");
    var username = "username=" + textInput.value + "&";
    var scorestr = "score=" + score;
    if (xhr != null) {
        xhr.open("POST", "http://www.qiaojianyong.top/insert" + version + "?", true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send(username + scorestr + "&t/" + Math.random());
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                //todo
            }
        };
    }
}
// qjyinsert
function renderGameOver() {
    insert();//post score

    //--qjyrenderbirdtube--------
    renderTubes();
    renderBird();
    renderGroundPattern();
    //--------
    //game over logo
    context.drawImage(gameOverCanvas, bounds.getCenterX() - logoCanvas.width / 2, canvas.height * .2);

    var instruction = "Click or tap to flap again.";
    context.font = "bold normal 24px sans-serif";
    context.fillStyle = "#FFFFFF";
    context.fillText(instruction, bounds.getCenterX() - context.measureText(instruction).width / 2, canvas.height * .1 + gameOverCanvas.height);
    renderScore();

    //qjygetData
    firstInFlag = false;
    getData() // synchronize
    drawRandkingList();
}

function renderLogo() {
    logoCurrentY += logoDirection;
    context.drawImage(logoCanvas, bounds.getCenterX() - logoCanvas.width / 2, logoCurrentY);
    if (logoCurrentY <= logoY || logoCurrentY >= logoMaxY) {
        logoDirection *= -1;
    }
}

function renderInstructions() {
    var instruction = "Click or tap to flap :)";
    context.font = "bold normal 24px sans-serif";
    context.fillStyle = "#FFFFFF";
    context.fillText(instruction, bounds.getCenterX() - context.measureText(instruction).width / 2, canvas.height * .2);
}

function renderScore() {

    var fontProperties = new MyCanvasTextProperties(MyCanvasTextProperties.BOLD, null, 50);
    context.font = fontProperties.getFontString();
    context.fillStyle = "#FFFFFF";
    context.strokeStyle = "#000000";
    context.lineWidth = 2;
    var x = bounds.getCenterX() - context.measureText(score).width / 2;
    // qjyscore
    var y = bounds.height * .15;
    context.fillText(score, x, y);
    context.strokeText(score, x, y);
}

//========================================================================
//========================:: LOGO ::======================================
//========================================================================

var logoCanvas;
var logoCanvasBG;

var gameOverCanvas;
var gameOverCanvasBG;

var logoY;
var logoCurrentY;
var logoMaxY;
var logoDirection;

function createLogo(logoText, logoCanvas, logoCanvassBG) {
    logoCanvas.width = logoCanvasBG.width = canvas.width;
    logoCanvas.height = logoCanvasBG.height = canvas.height / 4;
    logoCurrentY = logoY = canvas.height * .25;
    logoMaxY = canvas.height * .35;
    logoDirection = 1;
    var logoContext = logoCanvas.getContext("2d");
    logoContext.textBaseline = "top";
    var textRect = new MyRectangle(0, 0, logoCanvas.width * .8, logoCanvas.height);
    var logoFontProps = fontProperties.clone();
    logoFontProps.fontSize = MyCanvasTextUtil.getFontSizeForRect(logoText, fontProperties, textRect);


    var logoBGContext = logoCanvasBG.getContext("2d");
    logoBGContext.fillStyle = "#f5eea5";
    logoBGContext.fillRect(0, 0, logoCanvasBG.width, logoCanvasBG.height);
    logoBGContext.fillStyle = "#9ce358";
    logoBGContext.fillRect(0, logoFontProps.fontSize / 2, logoCanvasBG.width, logoCanvasBG.height);

    logoContext.font = logoFontProps.getFontString();
    logoContext.fillStyle = logoContext.createPattern(logoCanvasBG, "repeat-x");
    logoContext.strokeStyle = "#000000";
    logoContext.lineWidth = 3;
    var x = logoCanvas.width / 2 - logoContext.measureText(logoText).width / 2;
    var y = logoFontProps.fontSize / 2;
    logoContext.fillText(logoText, x, 0);
    logoContext.strokeText(logoText, x, 0);
}

//========================================================================
//========================:: BIRD ::==================================
//========================================================================

var birdCanvas;
var birdYSpeed = 0;
//qjygravity
var gravity = 1;//1 0.4
var tapBoost = 12;//12 7
// qjy 
var birdSize = 40;

function updateBird() {
    bird.y += birdYSpeed;
    birdYSpeed += gravity;

    //floor
    if (bird.y >= groundGraphicRect.y - birdCanvas.height) {
        bird.y = groundGraphicRect.y - birdCanvas.height;
        birdYSpeed = 0;
    }
    //ceiling
    if (bird.y <= 0) {
        bird.y = 1;
        birdYSpeed = 0;
    }
    //tube collision
    if (checkTubesCollision()) {
        isgameover = true;
        //game over
        gameState = GAME_OVER;
    }
}

var currentTube;
var ffScoreBugFix = 0;// for some reason the score would fire multiple times on firefox
//qjyupdate
function updateScore() {
    if (ffScoreBugFix > 10 && currentTube.topRect.getRight() < bird.x) { // fly over
        score++;
        var index = tubes.indexOf(currentTube) + 1;
        index %= tubes.length; // again and again
        currentTube = tubes[index];
        ffScoreBugFix = 0; // delay 
    }
    ffScoreBugFix++;
}

var bird = {};
//qjybird
var birdImages = [];

//createBird qjy
function createBird() {
    for (var i = 0; i < 8; i++) {
        var birdImage = new Image();
        birdImage.src = "img/" + i + ".png";
        birdImages[i] = birdImage;
    }
    //	 console.log(birdImages);
    if (!birdCanvas) {
        birdCanvas = document.createElement("canvas");
        var myctx = birdCanvas.getContext("2d");
    }
    birdCanvas.width = birdSize;
    birdCanvas.height = birdSize;

    bird.x = canvas.width / 3;// location
    bird.y = groundGraphicRect.y / 2;
    if (birdImages[0].complete) {
        bird.image = birdImages[0];
    } else {
        birdImages[0].onload = function () {
            bird.image = birdImages[0];
        };
    }
}
var index = 0; //
//qjybirdfly
function birdfly() {
    index++;
    //	 console.log(birdImages);
    var birdimageindex = (Math.floor(index / 6)) % 8;
    //	 console.log("birdimageindex-->"+birdimageindex);
    //	 console.log(birdImages[birdimageindex]);	
    if (birdImages[birdimageindex].complete) {
        bird.image = birdImages[birdimageindex];
    } else {
        birdImages[birdimageindex].onload = function () {
            bird.image = birdImages[birdimageindex];
        };
    }
}
//renderBird qjy
function renderBird() {
    birdfly();
    context.drawImage(bird.image, bird.x, bird.y);
}

// checkcollision
function checkTubesCollision() {
    //    console.log(tubes.length);
    for (var i = 0; i < tubes.length; i++) {
        //        console.log("checkTubesCollision tube-->" + i)
        if (checkTubeCollision(tubes[i])) {
            return true;
        }
    }
    return false;
}


var collisionPoint = new MyPoint();
var birdPoints = [];
//qjycollision
function checkTubeCollision(tube) {
    birdPoints[0] = bird.x;
    birdPoints[1] = bird.y; // left top 
    birdPoints[2] = bird.x + birdSize;
    birdPoints[3] = bird.y; // right top
    birdPoints[4] = bird.x + birdSize;
    birdPoints[5] = bird.y + birdSize; // right bottom
    birdPoints[6] = bird.x;
    birdPoints[7] = bird.y + birdSize; // left bottom
    for (var i = 0; i < 8; i += 2) {
        collisionPoint.x = birdPoints[i];
        collisionPoint.y = birdPoints[i + 1];
        if (tube.topRect.containsPoint(collisionPoint.x, collisionPoint.y)
            || tube.bottomRect.containsPoint(collisionPoint.x, collisionPoint.y)) {
            return true;
        }
    }
    return false;
}

//========================================================================
//========================:: TUBES ::==================================
//========================================================================
// qjygap
var tubeGapHeight = 190;//230
var tubesIntervalWidth;
var tubes;
//qjytubewidth
var tubeWidth = 80;//80 60
var minTubeHeight = 50;
var totalTubes = 2;

// qjychange the tubes generating policy
function updateTubes() {
    for (var i = 0; i < tubes.length; i++) {
        //updateTube(tubes[i]);
        if (tubes[i]) {
            tubes[i].topRect.x -= scrollSpeed;
            tubes[i].bottomRect.x = tubes[i].topRect.x;// bottom part
            if (tubes[i].topRect.x < -tubesIntervalWidth) {
                tubes[i].topRect.x = canvas.width;
                tubes[i].bottomRect.x = tubes[i].topRect.x;// bottom part
                renderTube(tubes[i]); //should render a new tube !
            }
        }
    }
}

//renderTubes qjy
function renderTubes() {
    for (var i = 0; i < tubes.length; i++) {
        if (tubes[i])
            context.drawImage(tubes[i].canvas, tubes[i].bottomRect.x, 0);
    }
}

// qjychange the tubes genetating policy
function createTubes() {
    tubes = [];
    //tubesIntervalWidth = Math.floor(canvas.width / totalTubes);//the distance between the tubes
    tubesIntervalWidth = canvas.width / totalTubes;//the distance between the tubes

    //    console.log("canvas.width" + canvas.width);
    //    console.log("tubesIntervalWidth" + tubesIntervalWidth);
    for (var i = 0; i < totalTubes + 1; i++) {
        tubes[i] = {};
        tubes[i].canvas = document.createElement("canvas");
        tubes[i].topRect = new MyRectangle(canvas.width + (i * tubesIntervalWidth)); // give x
        tubes[i].bottomRect = new MyRectangle(canvas.width + (i * tubesIntervalWidth));
        renderTube(tubes[i]);
    }
    currentTube = tubes[0];
}

var tubeOutlineColor = "#534130";
var tubeMainColor = "#75be2f";
var tubeCapHeight = 40;
// qjyrandomtube
function renderTube(tube) {
    tube.canvas.width = tubeWidth;
    tube.canvas.height = groundGraphicRect.y;

    tube.bottomRect.width = tube.topRect.width = tubeWidth;
    //    console.log("tube.topRect.x-->" + tube.topRect.x);
    tube.topRect.y = 0;
    tube.topRect.height = minTubeHeight + Math.round(Math.random() * (groundGraphicRect.y - tubeGapHeight - minTubeHeight * 2));

    tube.bottomRect.y = tube.topRect.getBottom() + tubeGapHeight;
    tube.bottomRect.height = groundGraphicRect.y - tube.bottomRect.y - 1;//minus one for stroke

    var tubeContext = tube.canvas.getContext("2d");
    tubeContext.lineWidth = 2;
    //top tube
    renderTubeElement(tubeContext, 3, 0, tubeWidth - 6, tube.topRect.height);
    renderTubeElement(tubeContext, 1, tube.topRect.getBottom() - tubeCapHeight, tubeWidth - 2, tubeCapHeight);

    //bottom tube
    renderTubeElement(tubeContext, 3, tube.bottomRect.y, tubeWidth - 6, tube.bottomRect.height);
    renderTubeElement(tubeContext, 1, tube.bottomRect.y, tubeWidth - 2, tubeCapHeight);
}

function renderTubeElement(ctx, x, y, width, height) {
    ctx.fillStyle = tubeMainColor;
    ctx.fillRect(x, y, width, height);
    ctx.fillStyle = "#9de85a";
    ctx.fillRect(x, y, width * .25, height);

    ctx.fillStyle = "#d9f881";
    ctx.fillRect(x + width * .05, y, width * .05, height);

    ctx.fillStyle = "#547e25";
    ctx.fillRect(x + width - width * .1, y, width * .1, height);
    ctx.fillRect(x + width - width * .2, y, width * .05, height);

    ctx.strokeRect(x, y, width, height);
}


//========================================================================
//========================:: CITY BG ::==================================
//========================================================================

var cityGraphicCanvas;

function createCityGraphic() {

    if (cityGraphicCanvas) {
        canvasContainer.removeChild(cityGraphicCanvas);
    }
    cityGraphicCanvas = document.createElement("canvas");
    cityGraphicCanvas.style.position = "absolute";
    cityGraphicCanvas.style.left = canvas.style.left;
    cityGraphicCanvas.style.top = canvas.style.top;
    cityGraphicCanvas.width = canvas.width;
    cityGraphicCanvas.height = canvas.height;
    var cgContext = cityGraphicCanvas.getContext("2d");
    var cityGraphicHeight = canvas.height * .25;

    //fill with blue sky
    cgContext.fillStyle = "#71c5cf";
    cgContext.fillRect(0, 0, canvas.width, canvas.height);

    cgContext.fillStyle = "#e9fad8";

    cgContext.save();
    cgContext.translate(0, groundGraphicRect.y - cityGraphicHeight);

    //CLOUDS
    var maxCloudRadius = cityGraphicHeight * .4;
    var minCloudRadius = maxCloudRadius * .5;

    for (iterator = 0; iterator < canvas.width; iterator += minCloudRadius) {
        cgContext.beginPath();
        cgContext.arc(iterator, maxCloudRadius, MyMathUtil.getRandomNumberInRange(minCloudRadius, maxCloudRadius), 0, MyMathUtil.PI2);
        cgContext.closePath();
        cgContext.fill();
    }

    cgContext.fillRect(0, maxCloudRadius, canvas.width, cityGraphicHeight);

    //HOUSES
    var houseWidth;
    var houseHeight;
    cgContext.fillStyle = "#deefcb";
    for (iterator = 0; iterator < canvas.width; iterator += (houseWidth + 8)) {
        houseWidth = 20 + Math.floor(Math.random() * 30);
        houseHeight = MyMathUtil.getRandomNumberInRange(cityGraphicHeight * .5, cityGraphicHeight - maxCloudRadius * .8);
        cgContext.fillRect(iterator, cityGraphicHeight - houseHeight, houseWidth, houseHeight);
    }

    cgContext.fillStyle = "#dff1c4";
    cgContext.strokeStyle = "#9fd5d5";
    cgContext.lineWidth = 3;
    for (iterator = 0; iterator < canvas.width; iterator += (houseWidth + 8)) {
        houseWidth = 20 + Math.floor(Math.random() * 30);
        houseHeight = MyMathUtil.getRandomNumberInRange(cityGraphicHeight * .5, cityGraphicHeight - maxCloudRadius * .8);
        cgContext.fillRect(iterator, cityGraphicHeight - houseHeight, houseWidth, houseHeight);
        cgContext.strokeRect(iterator, cityGraphicHeight - houseHeight, houseWidth, houseHeight);
    }

    //TREES
    var maxTreeRadius = cityGraphicHeight * .3;
    var minTreeRadius = maxTreeRadius * .5;
    var radius;
    var strokeStartRadian = Math.PI + Math.PI / 4;
    var strokeEndRadian = Math.PI + Math.PI / 4;
    cgContext.fillStyle = "#81e18b";
    cgContext.strokeStyle = "#72c887";
    for (iterator = 0; iterator < canvas.width; iterator += minTreeRadius) {
        cgContext.beginPath();
        radius = MyMathUtil.getRandomNumberInRange(minCloudRadius, maxCloudRadius)
        cgContext.arc(iterator, cityGraphicHeight, radius, 0, MyMathUtil.PI2);
        cgContext.closePath();
        cgContext.fill();

        cgContext.beginPath();
        cgContext.arc(iterator, cityGraphicHeight, radius, strokeStartRadian, strokeEndRadian);
        cgContext.closePath();
        cgContext.stroke();
    }

    cgContext.restore();
    //sand
    cgContext.fillStyle = sand;
    cgContext.fillRect(0, groundGraphicRect.y, canvas.width, canvas.height);

    canvasContainer.insertBefore(cityGraphicCanvas, canvasContainer.firstChild);
}


//========================================================================
//========================:: GROUND ::==================================
//========================================================================

var groundX = 0;
function renderGroundPattern() {
    context.drawImage(groundPatternCanvas, groundX, groundGraphicRect.y);
    groundX -= scrollSpeed;
    groundX %= 16;
}


//colors
var groundLightGreen = "#97e556";
var groundDarkGreen = "#73be29";
var groundDarkerGreen = "#4b7e19";
var groundShadow = "#d1a649";
var groundBorder = "#4c3f48";
var sand = "#dcd795";
var groundGraphicRect = new MyRectangle();
var groundPatternCanvas;

function createGroundPattern() {
    groundGraphicRect.y = canvas.height * .85;
    if (!groundPatternCanvas) {
        groundPatternCanvas = document.createElement("canvas");
    }
    groundPatternCanvas.width = 16;
    groundPatternCanvas.height = 16;
    var groundContext = groundPatternCanvas.getContext("2d");
    groundContext.fillStyle = groundLightGreen;
    groundContext.fillRect(0, 0, 16, 16);

    //diagonal graphic
    groundContext.fillStyle = groundDarkGreen;
    groundContext.beginPath();
    groundContext.moveTo(8, 3);
    groundContext.lineTo(16, 3);
    groundContext.lineTo(8, 13);
    groundContext.lineTo(0, 13);
    groundContext.closePath();
    groundContext.fill();

    //top border
    groundContext.fillStyle = groundBorder;
    groundContext.globalAlpha = .2;
    groundContext.fillRect(0, 0, 16, 1);
    groundContext.globalAlpha = 1;
    groundContext.fillRect(0, 1, 16, 1);
    groundContext.globalAlpha = .6;
    groundContext.fillRect(0, 2, 16, 1);

    //hilite
    groundContext.fillStyle = "#FFFFFF";
    groundContext.globalAlpha = .3;
    groundContext.fillRect(0, 3, 16, 2);

    //bottom border
    groundContext.fillStyle = groundDarkerGreen;
    groundContext.globalAlpha = .3;
    groundContext.fillRect(0, 10, 16, 3);
    groundContext.globalAlpha = 1;
    groundContext.fillRect(0, 11, 16, 1);

    //shadow
    groundContext.fillStyle = groundShadow;
    groundContext.fillRect(0, 13, 16, 3);

    var groundPattern = context.createPattern(groundPatternCanvas, "repeat-x");

    groundPatternCanvas.width = canvas.width + 16;
    groundPatternCanvas.height = 16;

    groundContext.fillStyle = groundPattern;
    groundContext.fillRect(0, 0, groundPatternCanvas.width, 16);

}

function clearTimeoutsAndIntervals() {
    gameState = -1;
}