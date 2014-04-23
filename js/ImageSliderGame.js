var ImageSliderGame = function(imgSrc, numberOfSlicesVertical, numberOfSlicesHorizontal) {
    var self = this;
    self.imgSrc = imgSrc;
    self.numberOfSlicesVertical = numberOfSlicesVertical;
    self.numberOfSlicesHorizontal = numberOfSlicesHorizontal;
    self.tiles = [];
    self.canvas = document.querySelector('canvas');
    self.ctx = self.canvas.getContext('2d');
    self.img = new Image();
    self.tilesDimensions = null;
    self.moveController = new MoveController(numberOfSlicesVertical, numberOfSlicesHorizontal);
    self.menu = new Menu();
    self.maxWidth = parseInt(window.getComputedStyle(document.querySelector('body')).maxWidth);

    self.setUp = function() {
        self.resizeCanvas();
        self.loadImage();
    };

    self.resize = function() {
        self.resizeCanvas();
        self.updateTiles();
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
        self.setUpTiles();
        self.shuffleTiles();
        self.updateTiles();
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
        self.tiles = [];
        self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);
        self.moveController = new MoveController(self.numberOfSlicesVertical, self.numberOfSlicesHorizontal);
        self.setUpTiles();
        self.shuffleTiles();
        self.updateTiles();
    };

    self.setUpTiles = function() {
        var nbOfTiles = self.numberOfSlicesVertical * self.numberOfSlicesHorizontal;
        var randomTile = parseInt(Math.random() * nbOfTiles);

        for (var i=0; i < nbOfTiles; i++) {
            var tile = new Tile(self.ctx, self.img, i);

            if (i == randomTile) {
                tile.setHidden(true);
            }

            self.tiles.push(tile);
        }
    };

    self.shuffleTiles = function(a) {
        for (var j, x, i = self.tiles.length;
                i;
                j = parseInt(Math.random() * i),
                x = self.tiles[--i],
                self.tiles[i] = self.tiles[j],
                self.tiles[j] = x
        );
    };

    self.updateTiles = function() {
        for (var i=0; i < self.tiles.length; i++) {
            var clipIndex = self.tiles[i].clipIndex;

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
            self.tilesDimensions = newDimensions;
            self.tiles[i].setPos(newPos);
            self.tiles[i].setDimensions(newDimensions);
            self.tiles[i].setClip(new Clip(newClipPos, newClipDimensions));
            self.tiles[i].draw();
        }
    };

    self.onCanvasClick = function(event) {
        var mousePos = new Position(event.clientX - self.canvas.offsetLeft, event.clientY - self.canvas.offsetTop);
        var clickedTileIndex = self.getTileIndex(mousePos);
        self.moveController.moveIfPossible(self.tiles, clickedTileIndex, self.endAnimation);
    };

    self.endAnimation = function() {
        self.updateTiles();
    };

    self.getTileIndex = function(pos) {
        var x = Math.floor(pos.x / self.tilesDimensions.width);
        var y = Math.floor(pos.y / self.tilesDimensions.height);
        return x + y * self.numberOfSlicesVertical;
    };

};
