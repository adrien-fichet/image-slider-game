var Tile = function(ctx, img, clipIndex) {
    var self = this;
    self.ctx = ctx;
    self.img = img;
    self.img.onClick = self.onclick;
    self.clipIndex = clipIndex;
    self.clip = null;
    self.size = null;
    self.pos = null;
    self.hidden = false;
    self.velocity = 1.5;
    self.acceleration = 0.001;
    self.exitAnimation = null;
    self.padding = 5;
    self.startPos = null;

    self.setClip = function(clip) {
        self.clip = clip;
    };

    self.setSize = function(size) {
        self.size = size;
    };

    self.setPos = function(pos) {
        self.pos = pos;
        self.startPos = new Position(pos.x, pos.y);
    };

    self.setHidden = function(value) {
        self.hidden = value;
    };

    self.draw = function() {
        self.ctx.clearRect(self.pos.x, self.pos.y, self.size.width, self.size.height);

        if (!self.hidden) {
            self.ctx.drawImage(
                    self.img,
                    self.clip.pos.x,
                    self.clip.pos.y,
                    self.clip.size.width,
                    self.clip.size.height,
                    self.pos.x + self.padding,
                    self.pos.y + self.padding,
                    self.size.width - self.padding * 2,
                    self.size.height - self.padding * 2
            );
        }
    };

    self.animateMove = function(direction, switchImagesCallback) {
        var startTime = (new Date()).getTime();
        var originalPos = new Position(self.pos.x, self.pos.y);
        self.requestMoveAnimationFrame(startTime, originalPos, direction, switchImagesCallback);
    };

    self.requestMoveAnimationFrame = function(startTime, originalPos, direction, switchImagesCallback) {
        var time = (new Date()).getTime() - startTime;
        self.updatePos(time, direction, originalPos);
        self.draw();

        if (self.exitAnimation) {
            switchImagesCallback();
        } else {
            window.requestAnimationFrame(function() {
                self.requestMoveAnimationFrame(startTime, originalPos, direction, switchImagesCallback);
            });
        }
    };

    self.updatePos = function(time, direction, originalPos) {
        if (direction == Directions.RIGHT) {
            self.updatePosRight(time, originalPos);
        } else if (direction == Directions.LEFT) {
            self.updatePosLeft(time, originalPos);
        } else if (direction == Directions.UP) {
            self.updatePosUp(time, originalPos);
        } else if (direction == Directions.DOWN) {
            self.updatePosDown(time, originalPos);
        }
    };

    self.updatePosRight = function(time, originalPos) {
        var newValue = originalPos.x + (time * (self.velocity + self.acceleration * time / 2));
        self.exitAnimation = (newValue > self.startPos.x + self.size.width);

        if (self.exitAnimation) {
            self.pos.x = self.startPos.x + self.size.width;
        } else {
            self.pos.x = newValue;
        }

        self.ctx.clearRect(originalPos.x, self.pos.y, self.size.width, self.size.height);
    };

    self.updatePosLeft = function(time, originalPos) {
        var newValue = originalPos.x - (time * (self.velocity + self.acceleration * time / 2));
        self.exitAnimation = (newValue < self.startPos.x - self.size.width);

        if (self.exitAnimation) {
            self.pos.x = self.startPos.x - self.size.width;
        } else {
            self.pos.x = newValue;
        }

        self.ctx.clearRect(originalPos.x, self.pos.y, self.size.width, self.size.height);
    };

    self.updatePosUp = function(time, originalPos) {
        var newValue = originalPos.y - (time * (self.velocity + self.acceleration * time / 2));
        self.exitAnimation = newValue < (self.startPos.y - self.size.height);

        if (self.exitAnimation) {
            self.pos.y = self.startPos.y - self.size.height;
        } else {
            self.pos.y = newValue;
        }

        self.ctx.clearRect(self.pos.x, originalPos.y, self.size.width, self.size.height);
    };

    self.updatePosDown = function(time, originalPos) {
        var newValue = originalPos.y + (time * (self.velocity + self.acceleration * time / 2));
        self.exitAnimation = newValue > (self.startPos.y + self.size.height);

        if (self.exitAnimation) {
            self.pos.y = self.startPos.y + self.size.height;
        } else {
            self.pos.y = newValue;
        }

        self.ctx.clearRect(self.pos.x, originalPos.y, self.size.width, self.size.height);
    };

    self.clear = function() {
        self.ctx.clearRect(
                self.pos.x + self.padding,
                self.pos.y + self.padding,
                self.size.width - self.padding * 2,
                self.size.height - self.padding * 2
        );
    };

    self.move = function(originalPos, mousePos, originalMousePos, direction) {
        if (direction == Directions.RIGHT) {
            self.moveRight(originalPos, mousePos, originalMousePos);
        } else if (direction == Directions.LEFT) {
            self.moveLeft(originalPos, mousePos, originalMousePos);
        } else if (direction == Directions.UP) {
            self.moveUp(originalPos, mousePos, originalMousePos);
        } else if (direction == Directions.DOWN) {
            self.moveDown(originalPos, mousePos, originalMousePos);
        }
    };

    self.moveRight = function(originalPos, mousePos, originalMousePos) {
        var newX = originalPos.x + mousePos.x - originalMousePos.x;

        if (newX < self.startPos.x) {
            self.pos = new Position(self.startPos.x, originalPos.y);
        } else if (newX > self.startPos.x + self.size.width) {
            self.pos = new Position(self.startPos.x + self.size.width, originalPos.y);
        } else {
            self.pos = new Position(newX, originalPos.y);
        }

        self.ctx.clearRect(originalPos.x, self.pos.y, self.size.width * 2, self.size.height);
    };

    self.moveLeft = function(originalPos, mousePos, originalMousePos) {
        var newX = originalPos.x - (originalMousePos.x - mousePos.x);

        if (newX > self.startPos.x) {
            self.pos = new Position(self.startPos.x, originalPos.y);
        } else if (newX < self.startPos.x - self.size.width) {
            self.pos = new Position(self.startPos.x - self.size.width, originalPos.y);
        } else {
            self.pos = new Position(newX, originalPos.y);
        }

        self.ctx.clearRect(originalPos.x - self.size.width, self.pos.y, self.size.width * 2, self.size.height);
    };

    self.moveUp = function(originalPos, mousePos, originalMousePos) {
        var newY = originalPos.y - (originalMousePos.y - mousePos.y);

        if (newY > self.startPos.y) {
            self.pos = new Position(originalPos.x, self.startPos.y);
        } else if (newY < self.startPos.y - self.size.height) {
            self.pos = new Position(originalPos.x, self.startPos.y - self.size.height);
        } else {
            self.pos = new Position(originalPos.x, newY);
        }

        self.ctx.clearRect(self.pos.x, originalPos.y - self.size.height, self.size.width, self.size.height * 2);
    };

    self.moveDown = function(originalPos, mousePos, originalMousePos) {
        var newY = originalPos.y + mousePos.y - originalMousePos.y;

        if (newY < self.startPos.y) {
            self.pos = new Position(originalPos.x, self.startPos.y);
        } else if (newY > self.startPos.y + self.size.height) {
            self.pos = new Position(originalPos.x, self.startPos.y + self.size.height);
        } else {
            self.pos = new Position(originalPos.x, newY);
        }

        self.ctx.clearRect(self.pos.x, originalPos.y, self.size.width, self.size.height * 2);
    };

};
