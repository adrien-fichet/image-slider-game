function main(gridWidth) {
    var imgSrc = 'im/jquery-summit.png';
    var numberOfSlices = 3;
    document.querySelector('div#grid').style.width = gridWidth + 'px';
    document.querySelector('div#grid').style.height = gridWidth + 'px';
    grid.removePreviousGridIfExists();
    grid.createSlices(imgSrc, numberOfSlices, gridWidth, gridWidth);
}

var grid = Object.create(Grid);
var previousGridDimension = grid.getGridDimension();
var resizing = false;
window.onload = main(previousGridDimension);

window.onresize = function() {
    if (!resizing) {
        resizing = true;

        setTimeout(function() {
            var currentGridDimension = getGridDimension();

            if (currentGridDimension != previousGridDimension) {
                previousGridDimension = currentGridDimension;
                main(currentGridDimension);
            }

            resizing = false;
        }, 500);
    }
};
