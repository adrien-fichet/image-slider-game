var Grid = function(imgSrc, numberOfSlices) {
    var self = this;
    self.imgSrc = imgSrc;
    self.numberOfSlices = numberOfSlices;
    self.utils = new Utils();
    self.previousWidth = -1;
    self.element = document.querySelector('div#grid');
    self.clips = [];
    self.positions = [];
    self.blankImagePos = null;
    self.moveController = new MoveController(self.clips, self.numberOfSlices);

    self.resize = function() {
        var currentWidth = self.getWidth();

        if (currentWidth != self.previousWidth) {
            self.previousWidth = currentWidth;
            self.redraw();
        }
    };

    self.redraw = function() {
        var width = self.getWidth();
        self.element.style.width = width + 'px';
        self.element.style.height = width + 'px';
        self.setViewportOnClips();
    };

    self.getWidth = function() {
        return Math.min(window.innerWidth, window.innerHeight);
    };

    self.setUp = function() {
        var width = self.getWidth();
        self.element.style.width = width + 'px';
        self.element.style.height = width + 'px';
        self.removePreviousGridIfExists();
        self.randomizePositions();
        self.createSlices(width);
        self.hideOneImage();
    };

    self.removePreviousGridIfExists = function() {
        for (var i=0; i < self.clips.length; i++) {
            self.element.removeChild(self.clips[i].viewport);
        }
    };

    self.randomizePositions = function() {
        for (var i=0; i < Math.pow(self.numberOfSlices, 2); i++) {
            self.positions[i] = i;
        }

        self.utils.shuffle(self.positions);
    };

    self.createSlices = function(width) {
        for (var i=0; i < self.positions.length; i++) {
            img = new ClipImage(self.imgSrc, width, i);
            img.createViewport();
            self.clips.push(img);
            self.element.appendChild(img.viewport);
        }

        self.setViewportOnClips();
    };

    self.hideOneImage = function() {
        self.blankImagePos = parseInt(Math.random() * self.positions.length);
        self.clips[self.blankImagePos].img.style.display = 'none';
    };

    self.setViewportOnClips = function() {
        var gridDimensions = self.utils.dimensions(self.element);
        var clipWidth = Math.floor(gridDimensions.width / numberOfSlices);
        var clipHeight = Math.floor(gridDimensions.height / numberOfSlices);

        for (var i=0; i < self.clips.length; i++) {
            self.clips[i].setViewport(
                    Math.floor(self.positions[i] / self.numberOfSlices) * clipHeight,
                    (self.positions[i] % self.numberOfSlices) * clipWidth,
                    clipWidth,
                    clipHeight);
        }
    };

    self.moveImage = function(pos) {
        self.moveController.moveImage(pos);
    }
};
