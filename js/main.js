var NUMBER_OF_SLICES = 3;
var IMG_SRC = 'im/firefox.png';
var GAME = new ImageSliderGame(IMG_SRC, NUMBER_OF_SLICES);

window.onload = function() {
    GAME.start();
};

window.onresize = function() {
    GAME.resize();
};
