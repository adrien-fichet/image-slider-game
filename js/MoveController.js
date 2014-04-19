var MoveController = function(clips, numberOfSlices) {
    var self = this;
    self.clips = clips;
    self.numberOfSlices = numberOfSlices;

    self.moveImage = function(pos) {
        var surroundingClips = self.getSurroundingClips(pos);
        console.log(surroundingClips);
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

};
