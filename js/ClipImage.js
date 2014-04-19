var ClipImage = {

    setViewport: function(img, x, y, width, height) {
        img.style.top = '-' + x + 'px';
        img.style.left = '-' + y + 'px';
        img.parentNode.style.width = width + 'px';
        img.parentNode.style.height = height + 'px';
    },

    moveImage: function(img) {
        var gridDimensions = dimensions(document.querySelector('div#grid'));
        var numberOfSlices = 3;
        var clipWidth = Math.floor(gridDimensions.width / numberOfSlices);
        var clipHeight = Math.floor(gridDimensions.height / numberOfSlices);
        this.setViewport(img, 0, 0, clipWidth, clipHeight);
    },

    createClipImage: function(imgSrc, gridWidth, gridHeight) {
        var img = document.createElement('img');
        img.setAttribute('src', imgSrc);
        img.setAttribute('alt', '');
        img.setAttribute('class', 'clip');
        img.setAttribute('width', gridWidth + 'px'); // Original img size == #grid size
        img.setAttribute('height', gridHeight + 'px');
        img.setAttribute('onclick', 'ClipImage.moveImage(this)');
        return img;
    },

    createImgViewport: function(img) {
        var div = document.createElement('div');
        div.setAttribute('class', 'viewport');
        div.appendChild(img);
        return div;
    }
};


