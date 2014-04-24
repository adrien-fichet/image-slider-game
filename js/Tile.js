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

    self.setClip = function(clip) {
        self.clip = clip;
    };

    self.setSize = function(size) {
        self.size = size;
    };

    self.setPos = function(pos) {
        self.pos = pos;
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
        var coef = self.getCoef(direction);
        var originalPos = new Position(self.pos.x, self.pos.y);
        self.requestMoveAnimationFrame(startTime, originalPos, direction, coef, switchImagesCallback);
    };

    self.getCoef = function(direction) {
        if (direction == Directions.RIGHT || direction == Directions.DOWN) {
            return 1;
        } else if (direction == Directions.LEFT || direction == Directions.UP) {
            return -1;
        }
    };

    self.requestMoveAnimationFrame = function(startTime, originalPos, direction, coef, switchImagesCallback) {
        var time = (new Date()).getTime() - startTime;
        self.updatePos(time, direction, originalPos);
        self.draw();

        if (self.exitAnimation) {
            switchImagesCallback();
        } else {
            window.requestAnimationFrame(function() {
                self.requestMoveAnimationFrame(startTime, originalPos, direction, coef, switchImagesCallback);
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
        self.exitAnimation = (newValue > originalPos.x + self.size.width);

        if (self.exitAnimation) {
            self.pos.x = originalPos.x + self.size.width;
        } else {
            self.pos.x = newValue;
        }

        self.ctx.clearRect(originalPos.x, self.pos.y, self.size.width, self.size.height);
    };

    self.updatePosLeft = function(time, originalPos) {
        var newValue = originalPos.x - (time * (self.velocity + self.acceleration * time / 2));
        self.exitAnimation = (newValue < originalPos.x - self.size.width);

        if (self.exitAnimation) {
            self.pos.x = originalPos.x - self.size.width;
        } else {
            self.pos.x = newValue;
        }

        self.ctx.clearRect(originalPos.x, self.pos.y, self.size.width, self.size.height);
    };

    self.updatePosUp = function(time, originalPos) {
        var newValue = originalPos.y - (time * (self.velocity + self.acceleration * time / 2));
        self.exitAnimation = newValue < (originalPos.y - self.size.height);

        if (self.exitAnimation) {
            self.pos.y = originalPos.y - self.size.height;
        } else {
            self.pos.y = newValue;
        }

        self.ctx.clearRect(self.pos.x, originalPos.y, self.size.width, self.size.height);
    };

    self.updatePosDown = function(time, originalPos) {
        var newValue = originalPos.y + (time * (self.velocity + self.acceleration * time / 2));
        self.exitAnimation = newValue > (originalPos.y + self.size.height);

        if (self.exitAnimation) {
            self.pos.y = originalPos.y + self.size.height;
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

};
