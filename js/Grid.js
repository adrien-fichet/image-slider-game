var Grid = function(imgSrc, numberOfSlices) {
    var self = this;
    self.imgSrc = imgSrc;
    self.numberOfSlices = numberOfSlices;
    self.utils = new Utils();
    self.previousWidth = -1;
    self.element = document.querySelector('div#grid');
    self.images = [];

    self.resize = function() {
        var currentWidth = self.getWidth();

        if (currentWidth != self.previousWidth) {
            self.previousWidth = currentWidth;
            self.redraw();
        }
    };

    self.redraw = function() {
        // TODO
    };

    self.getWidth = function() {
        return Math.min(window.innerWidth, window.innerHeight);
    };

    self.setUp = function() {
        var width = self.getWidth();
        self.element.style.width = width + 'px';
        self.element.style.height = width + 'px';
        self.removePreviousGridIfExists();
        self.createSlices(width);
    };

    self.setViewportOnImages = function(clipImages, numberOfSlices, positions) {
        var gridDimensions = self.utils.dimensions(self.element);
        var clipWidth = Math.floor(gridDimensions.width / numberOfSlices);
        var clipHeight = Math.floor(gridDimensions.height / numberOfSlices);

        for (var i=0; i < clipImages.length; i++) {
            new ClipImage().setViewport(clipImages[i],
                    Math.floor(positions[i] / numberOfSlices) * clipHeight,
                    (positions[i] % numberOfSlices) * clipWidth,
                    clipWidth,
                    clipHeight);
        }
    };

    self.createSlices = function(width) {
        var positions = [];

        for (var i=0; i < Math.pow(self.numberOfSlices, 2); i++) {
            positions[i] = i;
        }

        self.utils.shuffle(positions);

        for (var i=0; i < positions.length; i++) {
            var img = new ClipImage(self.imgSrc, width);
            self.images.push(img);
            self.element.appendChild(img.createViewport());
        }

        var clipImages = document.querySelectorAll('img.clip');
        self.setViewportOnImages(clipImages, numberOfSlices, positions);

        var randomPosition = parseInt(Math.random() * positions.length);
        document.querySelectorAll('img.clip')[randomPosition].style.display = 'none';
    };

    self.removePreviousGridIfExists = function() {
        var viewports = document.querySelectorAll('div.viewport');

        for (var i=0; i < viewports.length; i++) {
            self.element.removeChild(viewports[i]);
        }
    };
};
