function setViewport(img, x, y, width, height) {
    img.style.top = '-' + x + 'px';
    img.style.left = '-' + y + 'px';
    img.parentNode.style.width = width + 'px';
    img.parentNode.style.height = height + 'px';
}

function createClipImage(imgSrc) {
    var img = document.createElement('img');
    img.setAttribute('src', imgSrc);
    img.setAttribute('alt', '');
    img.setAttribute('class', 'clip');
    return img;
}

function createImgViewport(img) {
    var div = document.createElement('div');
    div.setAttribute('class', 'viewport');
    div.appendChild(img);
    return div;
}

function setViewportOnImages(clipImages, n) {
    var gridWidth = width(document.querySelector('div#grid'));
    var clipWidth = Math.floor(gridWidth / n);

    for (var i=0; i < clipImages.length; i++) {
        setViewport(clipImages[i],
                Math.floor(i / n) * clipWidth,
                (i % n) * clipWidth,
                clipWidth,
                clipWidth);
    }
}

function width(element) {
    return parseInt(window.getComputedStyle(element).width);
}

function createSlices(imgSrc, n) {
    for (var i=0; i < Math.pow(n, 2); i++) {
        var img = createClipImage(imgSrc);
        var imgViewport = createImgViewport(img);
        document.querySelector('#grid').appendChild(imgViewport);
    }

    var clipImages = document.querySelectorAll('.clip');
    setViewportOnImages(clipImages, n);
}

createSlices('im/logo.svg', 3);
