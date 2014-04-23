var ImageSliderGame = function(imgSrc, nbOfTilesV, nbOfTilesH) {
    var self = this;
    self.imgSrc = imgSrc;
    self.nbOfTilesV = nbOfTilesV;
    self.nbOfTilesH = nbOfTilesH;
    self.tiles = [];
    self.canvas = document.querySelector('canvas');
    self.ctx = self.canvas.getContext('2d');
    self.img = new Image();
    self.tilesSize = null;
    self.moveController = new MoveController(self.nbOfTilesV, self.nbOfTilesH);
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
        self.menu.decNbOfTilesVButton.addEventListener('click', self.decNbOfTilesV);
        self.menu.setNbOfTilesVText(self.nbOfTilesV);
        self.menu.incNbOfTilesVButton.addEventListener('click', self.incNbOfTilesV);
        self.menu.decNbOfTilesHButton.addEventListener('click', self.decNbOfTilesH);
        self.menu.setNbOfTilesHText(self.nbOfTilesH);
        self.menu.incNbOfTilesHButton.addEventListener('click', self.incNbOfTilesH);
        self.menu.restartButton.addEventListener('click', self.restart);
    };

    self.decNbOfTilesV = function() {
        if ((self.nbOfTilesV - 1) > 1) {
            self.nbOfTilesV--;
            self.menu.setNbOfTilesVText(self.nbOfTilesV);
            self.restart();
        }
    };

    self.incNbOfTilesV = function() {
        self.nbOfTilesV++;
        self.menu.setNbOfTilesVText(self.nbOfTilesV);
        self.restart();
    };

    self.decNbOfTilesH = function() {
        if ((self.nbOfTilesH - 1) > 1) {
            self.nbOfTilesH--;
            self.menu.setNbOfTilesHText(self.nbOfTilesH);
            self.restart();
        }
    };

    self.incNbOfTilesH = function() {
        self.nbOfTilesH++;
        self.menu.setNbOfTilesHText(self.nbOfTilesH);
        self.restart();
    };

    self.restart = function() {
        self.tiles = [];
        self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);
        self.moveController = new MoveController(self.nbOfTilesV, self.nbOfTilesH);
        self.setUpTiles();
        self.shuffleTiles();
        self.updateTiles();
    };

    self.setUpTiles = function() {
        var nbOfTiles = self.nbOfTilesV * self.nbOfTilesH;
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

            var newSize = new Size(
                    Math.floor(self.canvas.width / self.nbOfTilesV),
                    Math.floor(self.canvas.height / self.nbOfTilesH)
            );
            var newPos = new Position(
                    (i % self.nbOfTilesV) * newSize.width,
                    Math.floor(i / self.nbOfTilesV) * newSize.height
            );
            var newClipSize = new Size(
                    Math.floor(self.img.width / self.nbOfTilesV),
                    Math.floor(self.img.height / self.nbOfTilesH)
            );
            var newClipPos = new Position(
                    (clipIndex % self.nbOfTilesV) * newClipSize.width,
                    Math.floor(clipIndex / self.nbOfTilesV) * newClipSize.height
            );
            self.tilesSize = newSize;
            self.tiles[i].setPos(newPos);
            self.tiles[i].setSize(newSize);
            self.tiles[i].setClip(new Clip(newClipPos, newClipSize));
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
        var x = Math.floor(pos.x / self.tilesSize.width);
        var y = Math.floor(pos.y / self.tilesSize.height);
        return x + y * self.nbOfTilesV;
    };

};
