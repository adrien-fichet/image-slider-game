var Grid = {

    setViewportOnImages: function(clipImages, numberOfSlices, positions) {
        var gridDimensions = dimensions(document.querySelector('div#grid'));
        var clipWidth = Math.floor(gridDimensions.width / numberOfSlices);
        var clipHeight = Math.floor(gridDimensions.height / numberOfSlices);

        for (var i=0; i < clipImages.length; i++) {
            new ClipImage.setViewport(clipImages[i],
                    Math.floor(positions[i] / numberOfSlices) * clipHeight,
                    (positions[i] % numberOfSlices) * clipWidth,
                    clipWidth,
                    clipHeight);
        }
    },

    createSlices: function(imgSrc, numberOfSlices, gridWidth, gridHeight) {
        var positions = [];

        for (var i=0; i < Math.pow(numberOfSlices, 2); i++) {
            positions[i] = i;
        }

        shuffle(positions);

        for (var i=0; i < positions.length; i++) {
            var img = new ClipImage.createClipImage(imgSrc, gridWidth, gridHeight);
            var imgViewport = new ClipImage.createImgViewport(img);
            document.querySelector('div#grid').appendChild(imgViewport);
        }

        var clipImages = document.querySelectorAll('img.clip');
        setViewportOnImages(clipImages, numberOfSlices, positions);

        var randomPosition = parseInt(Math.random() * positions.length);
        document.querySelectorAll('img.clip')[randomPosition].style.display = 'none';
    },

    getGridDimension: function() {
        return Math.min(window.innerWidth, window.innerHeight);
    },

    removePreviousGridIfExists: function() {
        var viewports = document.querySelectorAll('div.viewport');

        for (var i=0; i < viewports.length; i++) {
            document.querySelector('div#grid').removeChild(viewports[i]);
        }
    }

};
