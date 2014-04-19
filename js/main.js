var NUMBER_OF_SLICES = 4;
var IMG_SRC = 'im/firefox.png';
var GAME = new ImageSliderGame(IMG_SRC, NUMBER_OF_SLICES);

var moveImage = function(pos) {
    GAME.moveImage(pos);
};

window.onload = function() {
    GAME.start();
};

window.onresize = function() {
    GAME.resize();
};


