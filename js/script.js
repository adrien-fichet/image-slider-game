function setViewport(img, x, y, width, height) {
    img.style.top = '-' + x + 'px';
    img.style.left = '-' + y + 'px';
    img.parentNode.style.width = width + 'px';
    img.parentNode.style.height = height + 'px';
}

function createClipImage(imgSrc, gridWidth, gridHeight) {
    var img = document.createElement('img');
    img.setAttribute('src', imgSrc);
    img.setAttribute('alt', '');
    img.setAttribute('class', 'clip');
    img.setAttribute('width', gridWidth + 'px'); // Original img size == #grid size
    img.setAttribute('height', gridHeight + 'px');
    return img;
}

function createImgViewport(img) {
    var div = document.createElement('div');
    div.setAttribute('class', 'viewport');
    div.appendChild(img);
    return div;
}

function setViewportOnImages(clipImages, numberOfSlices, positions) {
    var gridDimensions = dimensions(document.querySelector('div#grid'));
    var clipWidth = Math.floor(gridDimensions.width / numberOfSlices);
    var clipHeight = Math.floor(gridDimensions.height / numberOfSlices);

    for (var i=0; i < clipImages.length; i++) {
        setViewport(clipImages[i],
                Math.floor(positions[i] / numberOfSlices) * clipHeight,
                (positions[i] % numberOfSlices) * clipWidth,
                clipWidth,
                clipHeight);
    }
}

function dimensions(element) {
    return {width: parseInt(window.getComputedStyle(element).width),
            height: parseInt(window.getComputedStyle(element).height)
    };
}

function shuffle(a){
    for (var j, x, i = a.length; i; j = parseInt(Math.random() * i), x = a[--i], a[i] = a[j], a[j] = x);
}

function createSlices(imgSrc, numberOfSlices, gridWidth, gridHeight) {
    var positions = [];

    for (var i=0; i < Math.pow(numberOfSlices, 2); i++) {
        positions[i] = i;
    }

    shuffle(positions);

    for (var i=0; i < positions.length; i++) {
        var img = createClipImage(imgSrc, gridWidth, gridHeight);
        var imgViewport = createImgViewport(img);
        document.querySelector('div#grid').appendChild(imgViewport);
    }

    var clipImages = document.querySelectorAll('img.clip');
    setViewportOnImages(clipImages, numberOfSlices, positions);

    var randomPosition = parseInt(Math.random() * positions.length);
    document.querySelectorAll('img.clip')[randomPosition].style.display = 'none';
}

function getGridDimension() {
    return Math.min(window.innerWidth, window.innerHeight);
}

function removePreviousGridIfExists() {
    var viewports = document.querySelectorAll('div.viewport');

    for (var i=0; i < viewports.length; i++) {
        document.querySelector('div#grid').removeChild(viewports[i]);
    }
}

function main(gridWidth) {
    var imgSrc = 'im/jquery-summit.png';
    var numberOfSlices = 3;
    document.querySelector('div#grid').style.width = gridWidth + 'px';
    document.querySelector('div#grid').style.height = gridWidth + 'px';
    removePreviousGridIfExists();
    createSlices(imgSrc, numberOfSlices, gridWidth, gridWidth);
    document.querySelector('div#grid').style.width = (gridWidth + 10) + 'px';
    document.querySelector('div#grid').style.height = (gridWidth + 10) + 'px';
}

var previousGridDimension = getGridDimension();
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
