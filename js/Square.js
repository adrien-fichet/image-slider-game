var Square = function(ctx, img, clipIndex) {
    var self = this;
    self.ctx = ctx;
    self.img = img;
    self.img.onClick = self.onclick;
    self.clipIndex = clipIndex;
    self.clip = null;
    self.dimensions = null;
    self.pos = null;
    self.hidden = false;

    self.setClip = function(clip) {
        self.clip = clip;
    };

    self.setDimensions = function(dimensions) {
        self.dimensions = dimensions;
    };

    self.setPos = function(pos) {
        self.pos = pos;
    };

    self.setHidden = function(value) {
        self.hidden = value;
    };

    self.draw = function() {
        self.ctx.clearRect(self.pos.x, self.pos.y, self.dimensions.width, self.dimensions.height);

        if (!self.hidden) {
            self.ctx.drawImage(
                    self.img,
                    self.clip.pos.x,
                    self.clip.pos.y,
                    self.clip.dimensions.width,
                    self.clip.dimensions.height,
                    self.pos.x,
                    self.pos.y,
                    self.dimensions.width,
                    self.dimensions.height
            );
        }
    };

};
