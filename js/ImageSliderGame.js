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
    self.menu = new Menu();
    self.maxWidth = parseInt(window.getComputedStyle(document.querySelector('body')).maxWidth);

    self.setUp = function() {
        self.resizeCanvas();
        self.loadImage();
    };

    self.resize = function() {
        self.resizeCanvas();
        self.updateSquares();
    };

    self.resizeCanvas = function() {
        if (window.innerWidth < self.maxWidth) {
            self.canvas.width = window.innerWidth;
        } else {
            self.canvas.width = self.maxWidth;
        }

        self.canvas.height = window.innerHeight - self.menu.height;
    };

    self.loadImage = function() {
        self.img.src = self.imgSrc;
        self.img.onload = self.startGame;
    };

    self.startGame = function() {
        self.setUpSquares();
        self.shuffleSquares();
        self.updateSquares();
        self.canvas.addEventListener('click', self.onCanvasClick);
        self.setUpMenu();
    };

    self.setUpMenu = function() {
        self.menu.setUp();
        self.menu.decreaseNumberOfSlicesVerticalButton.addEventListener('click', self.decreaseNumberOfSlicesVertical);
        self.menu.setNumberOfSlicesVerticalText(self.numberOfSlicesVertical);
        self.menu.increaseNumberOfSlicesVerticalButton.addEventListener('click', self.increaseNumberOfSlicesVertical);
        self.menu.decreaseNumberOfSlicesHorizontalButton.addEventListener('click', self.decreaseNumberOfSlicesHorizontal);
        self.menu.setNumberOfSlicesHorizontalText(self.numberOfSlicesHorizontal);
        self.menu.increaseNumberOfSlicesHorizontalButton.addEventListener('click', self.increaseNumberOfSlicesHorizontal);
    };

    self.decreaseNumberOfSlicesVertical = function() {
        if ((self.numberOfSlicesVertical - 1) > 1) {
            self.numberOfSlicesVertical--;
            self.menu.setNumberOfSlicesVerticalText(self.numberOfSlicesVertical);
            self.restart();
        }
    };

    self.increaseNumberOfSlicesVertical = function() {
        self.numberOfSlicesVertical++;
        self.menu.setNumberOfSlicesVerticalText(self.numberOfSlicesVertical);
        self.restart();
    };

    self.decreaseNumberOfSlicesHorizontal = function() {
        if ((self.numberOfSlicesHorizontal - 1) > 1) {
            self.numberOfSlicesHorizontal--;
            self.menu.setNumberOfSlicesHorizontalText(self.numberOfSlicesHorizontal);
            self.restart();
        }
    };

    self.increaseNumberOfSlicesHorizontal = function() {
        self.numberOfSlicesHorizontal++;
        self.menu.setNumberOfSlicesHorizontalText(self.numberOfSlicesHorizontal);
        self.restart();
    };

    self.restart = function() {
        self.squares = [];
        self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);
        self.moveController = new MoveController(self.numberOfSlicesVertical, self.numberOfSlicesHorizontal);
        self.setUpSquares();
        self.shuffleSquares();
        self.updateSquares();
    };

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
        var mousePos = new Position(event.clientX - self.canvas.offsetLeft, event.clientY - self.canvas.offsetTop);
        var clickedSquareIndex = self.getSquareIndex(mousePos);
        self.moveController.moveIfPossible(self.squares, clickedSquareIndex, self.endAnimation);
    };

    self.endAnimation = function() {
        self.updateSquares();
    };

    self.getSquareIndex = function(pos) {
        var x = Math.floor(pos.x / self.squareDimensions.width);
        var y = Math.floor(pos.y / self.squareDimensions.height);
        return x + y * self.numberOfSlicesVertical;
    };

};
