var Shuffler = function() {
    var self = this;

    self.mix = function(nbOfTilesV, nbOfTilesH) {
        var result = null;

        while (result == null) {
            result = self.randomMix(nbOfTilesV, nbOfTilesH);
        }

        return result;
    };

    self.randomMix = function(nbOfTilesV, nbOfTilesH) {
        var moveController = new MoveController(nbOfTilesV, nbOfTilesH);
        var nbOfTiles = nbOfTilesV * nbOfTilesH;
        var blankTileIndex = nbOfTiles - 1;
        var tiles = [];
        var result = [];

        for (var i=0; i < nbOfTiles; i++) {
            tiles[i] = i;
            result[i] = i;
        }

        for (var i=0; i < Math.floor(Math.random() * 1000) + 1000; i++) {
            var surroundingTiles = moveController.getSurroundingTiles(tiles, blankTileIndex);
            var randomSurroundingTile = surroundingTiles[Math.floor(Math.random() * surroundingTiles.length)];

            var tmp = result[randomSurroundingTile];
            result[randomSurroundingTile] = result[blankTileIndex];
            result[blankTileIndex] = tmp;
            blankTileIndex = randomSurroundingTile;
        }

        if (self.alreadySolved(result)) {
            return null;
        }

        return result;
    };

    self.alreadySolved = function(result) {
        for (var i=0; i < result.length; i++) {
            if (result[i] != i) {
                return false;
            }
        }
        return true;
    };
};
