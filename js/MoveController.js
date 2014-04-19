var MoveController = function(clips, numberOfSlices,blankImagePos) {
    var self = this;
    self.grid = grid;
    self.clips = clips;
    self.numberOfSlices = numberOfSlices;
    self.blankImagePos = blankImagePos;

    self.moveImage = function(pos) {
        if (self.moveIsValid(pos)) {
            self.switchImages(pos);
        }
    };

    self.getSurroundingClips = function(pos) {
        var surroundingClips = [];
        var x = Math.floor(pos / self.numberOfSlices);
        var y = pos % self.numberOfSlices;

        if (x == 0) {
            if (y == 0) {
                surroundingClips.push(self.clips[pos + 1]);
                surroundingClips.push(self.clips[pos + self.numberOfSlices]);
            } else if (y == self.numberOfSlices - 1) {
                surroundingClips.push(self.clips[pos - 1]);
                surroundingClips.push(self.clips[pos + self.numberOfSlices]);
            } else {
                surroundingClips.push(self.clips[pos - 1]);
                surroundingClips.push(self.clips[pos + 1]);
                surroundingClips.push(self.clips[pos + self.numberOfSlices]);
            }
        } else if (x == self.numberOfSlices - 1) {
            if (y == 0) {
                surroundingClips.push(self.clips[pos + 1]);
                surroundingClips.push(self.clips[pos - self.numberOfSlices]);
            } else if (y == self.numberOfSlices - 1) {
                surroundingClips.push(self.clips[pos - 1]);
                surroundingClips.push(self.clips[pos - self.numberOfSlices]);
            } else {
                surroundingClips.push(self.clips[pos + 1]);
                surroundingClips.push(self.clips[pos - 1]);
                surroundingClips.push(self.clips[pos - self.numberOfSlices]);
            }
        } else if (y == 0) {
            surroundingClips.push(self.clips[pos - self.numberOfSlices]);
            surroundingClips.push(self.clips[pos + self.numberOfSlices]);
            surroundingClips.push(self.clips[pos + 1]);
        } else if (y == self.numberOfSlices - 1) {
            surroundingClips.push(self.clips[pos - self.numberOfSlices]);
            surroundingClips.push(self.clips[pos + self.numberOfSlices]);
            surroundingClips.push(self.clips[pos - 1]);
        } else {
            surroundingClips.push(self.clips[pos + 1]);
            surroundingClips.push(self.clips[pos - 1]);
            surroundingClips.push(self.clips[pos + self.numberOfSlices]);
            surroundingClips.push(self.clips[pos - self.numberOfSlices]);
        }

        return surroundingClips;
    };

    self.moveIsValid = function(pos) {
        var surroundingClips = self.getSurroundingClips(pos);

        for (var i=0; i < surroundingClips.length; i++) {
            if (surroundingClips[i].pos == self.blankImagePos) {
                return true;
            }
        }

        return false;
    };

    self.switchImages = function(pos) {
        // TODO
    };

};
