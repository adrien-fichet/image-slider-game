var ImageSliderGame = function(imgSrc, numberOfSlices) {
    var self = this;
    self.imgSrc = imgSrc;
    self.numberOfSlices = numberOfSlices;
    self.isResizing = false;
    self.grid = new Grid(self.imgSrc, self.numberOfSlices);

    self.start = function() {
        self.grid.setUp();
    };

    self.resize = function() {
        if (!self.isResizing) {
            self.isResizing = true;
            setTimeout(function() {
                self.grid.resize();
                self.isResizing = false;
            }, 500);
        }
    };
};

