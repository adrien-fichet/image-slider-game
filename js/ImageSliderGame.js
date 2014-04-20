var ImageSliderGame = function(imgSrc, numberOfSlicesVertical, numberOfSlicesHorizontal) {
    var self = this;
    self.imgSrc = imgSrc;
    self.numberOfSlicesVertical = numberOfSlicesVertical;
    self.numberOfSlicesHorizontal = numberOfSlicesHorizontal;
    self.squares = [];
    self.canvas = document.querySelector('canvas');
    self.ctx = self.canvas.getContext('2d');
    self.img = new Image();
    self.squareDimensions = null;
    self.moveController = new MoveController(numberOfSlicesVertical, numberOfSlicesHorizontal);

    self.setUp = function() {
        self.resizeCanvas();
        self.loadImage();
    };

    self.resize = function() {
        self.resizeCanvas();
        self.updateSquares();
    };

    self.resizeCanvas = function() {
        self.canvas.width = window.innerWidth;
        self.canvas.height = window.innerHeight;
    };

    self.loadImage = function() {
        self.img.src = self.imgSrc;
        self.img.onload = self.startGame;
    };

    self.startGame = function() {
        self.setUpSquares();
        self.shuffleSquares();
        self.updateSquares();
        self.canvas.addEventListener("click", self.onCanvasClick);
    }

    self.setUpSquares = function() {
        var numberOfSquares = self.numberOfSlicesVertical * self.numberOfSlicesHorizontal;
        var randomSquare = parseInt(Math.random() * numberOfSquares);

        for (var i=0; i < numberOfSquares; i++) {
            var square = new Square(self.ctx, self.img, i);

            if (i == randomSquare) {
                square.setHidden(true);
            }

            self.squares.push(square);
        }
    };

    self.shuffleSquares = function(a) {
        for (var j, x, i = self.squares.length;
                i;
                j = parseInt(Math.random() * i),
                x = self.squares[--i],
                self.squares[i] = self.squares[j],
                self.squares[j] = x
        );
    };

    self.updateSquares = function() {
        for (var i=0; i < self.squares.length; i++) {
            var clipIndex = self.squares[i].clipIndex;

            var newDimensions = new Dimensions(
                    Math.floor(self.canvas.width / self.numberOfSlicesVertical),
                    Math.floor(self.canvas.height / self.numberOfSlicesHorizontal)
            );
            var newPos = new Position(
                    (i % self.numberOfSlicesVertical) * newDimensions.width,
                    Math.floor(i / self.numberOfSlicesVertical) * newDimensions.height
            );
            var newClipDimensions = new Dimensions(
                    Math.floor(self.img.width / self.numberOfSlicesVertical),
                    Math.floor(self.img.height / self.numberOfSlicesHorizontal)
            );
            var newClipPos = new Position(
                    (clipIndex % self.numberOfSlicesVertical) * newClipDimensions.width,
                    Math.floor(clipIndex / self.numberOfSlicesVertical) * newClipDimensions.height
            );
            self.squareDimensions = newDimensions;
            self.squares[i].setPos(newPos);
            self.squares[i].setDimensions(newDimensions);
            self.squares[i].setClip(new Clip(newClipPos, newClipDimensions));
            self.squares[i].draw();
        }
    };

    self.onCanvasClick = function(event) {
        var mousePos = new Position(event.x, event.y);
        var clickedSquareIndex = self.getSquareIndex(mousePos);
        self.moveController.moveIfPossible(self.squares, clickedSquareIndex);
    };

    self.getSquareIndex = function(pos) {
        var x = Math.floor(pos.x / self.squareDimensions.width);
        var y = Math.floor(pos.y / self.squareDimensions.height);
        return x + y * self.numberOfSlicesVertical;
    };

};
