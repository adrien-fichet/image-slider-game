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
    self.bgImg = new Image();
    self.bgImgSrc = 'im/bg.jpg';
    self.video = document.querySelector('video');
    self.localMediaStream = null;
    self.drawCameraImageInterval = null;
    self.showingCamera = false;
    self.cameraCanvas = null;

    self.setUp = function() {
        self.resizeCanvas();
        self.loadGameImages();
        self.setUpNavigator();
    };

    self.setUpNavigator = function() {
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
                navigator.mozGetUserMedia || navigator.msGetUserMedia;
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

        if (self.cameraCanvas) {
            self.cameraCanvas.width = self.canvas.width;
            self.cameraCanvas.height = self.canvas.height;
        }
    };

    self.loadGameImages = function() {
        self.img.src = self.imgSrc;
        self.img.onload = function() {
            self.imgLoaded(self.img);
        };
        self.bgImg.src = self.bgImgSrc;
        self.bgImg.onload = function() {
            document.querySelector('body').style.backgroundImage = 'url(' + self.bgImgSrc + ')';
            self.imgLoaded(self.bgImg);
        };
    };

    self.imgLoaded = function(img) {
        img.loaded = true;
        self.startGame();
    };

    self.startGame = function() {
        if (self.img.loaded && self.bgImg.loaded) {
            self.setUpTiles();
            self.shuffleTiles();
            self.updateTiles();
            self.canvas.addEventListener('click', self.onCanvasClick);
            self.setUpMenu();
        }
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
        self.menu.photoButton.addEventListener('click', self.showCamera);
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

    self.showCamera = function() {
        self.menu.photoButton.removeEventListener('click', self.showCamera);
        self.menu.showText('Loading camera...');

        navigator.getUserMedia({video: true}, function(stream) {
            self.video.src = window.URL.createObjectURL(stream);
            self.localMediaStream = stream;
            self.video.addEventListener('playing', self.drawCameraImage);
        }, function() {
            self.menu.hideText();
            self.menu.removePhotoButton();
        });
    };

    self.drawCameraImage = function() {
        self.video.removeEventListener('playing', self.drawCameraImage);
        self.menu.showText('Click anywhere to take picture!');
        self.cameraCanvas = document.createElement('canvas');
        self.cameraCanvas.setAttribute('id', 'cameraCanvas');
        self.canvas.addEventListener('click', self.takePicture);
        document.querySelector('body').appendChild(self.cameraCanvas);
        var cameraCtx = self.cameraCanvas.getContext('2d');
        self.cameraCanvas.width = self.canvas.width;
        self.cameraCanvas.height = self.canvas.height;
        self.showingCamera = true;

        self.ctx.fillStyle = self.ctx.createPattern(self.bgImg, 'repeat');
        self.ctx.fillRect(0, 0, self.canvas.width, self.canvas.height);

        for (var i=0; i < self.tiles.length; i++) {
            self.tiles[i].clear();
        }

        self.drawCameraImageInterval = setInterval(function() {
            cameraCtx.drawImage(self.video, 0, 0, self.cameraCanvas.width, self.cameraCanvas.height);
        }, 100);
    };

    self.takePicture = function() {
        self.menu.hideText();
        self.canvas.removeEventListener('click', self.takePicture);
        self.menu.photoButton.addEventListener('click', self.showCamera);
        self.video.pause();
        self.video.src = null;
        self.localMediaStream.stop();
        self.localMediaStream = null;
        clearInterval(self.drawCameraImageInterval);
        self.img = new Image();
        self.img.src = self.cameraCanvas.toDataURL('image/png');
        document.querySelector('body').removeChild(self.cameraCanvas);
        self.cameraCanvas = null;
        self.showingCamera = false;
        self.restart();
    };

    self.restart = function() {
        self.menu.hideText();
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
        if (self.showingCamera) {
            self.ctx.fillStyle = self.ctx.createPattern(self.bgImg, 'repeat');
            self.ctx.fillRect(0, 0, self.canvas.width, self.canvas.height);
        }

        var gameIsOver = true;

        for (var i=0; i < self.tiles.length; i++) {
            var clipIndex = self.tiles[i].clipIndex;

            if (clipIndex != i) {
                gameIsOver = false;
            }

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

            if (self.showingCamera) {
                self.tiles[i].clear();
            } else {
                self.tiles[i].draw();
            }
        }

        if (gameIsOver) {
            self.menu.showText('Well done!');

            for (var i=0; i < self.tiles.length; i++) {
                if (self.tiles[i].hidden) {
                    self.tiles[i].hidden = false;
                    self.tiles[i].draw();
                }
            }
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
