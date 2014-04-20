var MoveController = function(numberOfSlicesVertical, numberOfSlicesHorizontal) {
    var self = this;
    self.numberOfSlicesVertical = numberOfSlicesVertical;
    self.numberOfSlicesHorizontal = numberOfSlicesHorizontal;
    
    self.getSurroundingSquares = function(squares, index) {
        var surroundingSquares = [];
        var x = Math.floor(index / self.numberOfSlicesVertical);
        var y = index % self.numberOfSlicesVertical;

        if (x == 0) {
            if (y == 0) {
                surroundingSquares.push(squares[index + 1]);
                surroundingSquares.push(squares[index + self.numberOfSlicesVertical]);
            } else if (y == self.numberOfSlicesVertical - 1) {
                surroundingSquares.push(squares[index - 1]);
                surroundingSquares.push(squares[index + self.numberOfSlicesVertical]);
            } else {
                surroundingSquares.push(squares[index - 1]);
                surroundingSquares.push(squares[index + 1]);
                surroundingSquares.push(squares[index + self.numberOfSlicesVertical]);
            }
        } else if (x == self.numberOfSlicesHorizontal - 1) {
            if (y == 0) {
                surroundingSquares.push(squares[index + 1]);
                surroundingSquares.push(squares[index - self.numberOfSlicesVertical]);
            } else if (y == self.numberOfSlicesVertical - 1) {
                surroundingSquares.push(squares[index - 1]);
                surroundingSquares.push(squares[index - self.numberOfSlicesVertical]);
            } else {
                surroundingSquares.push(squares[index + 1]);
                surroundingSquares.push(squares[index - 1]);
                surroundingSquares.push(squares[index - self.numberOfSlicesVertical]);
            }
        } else if (y == 0) {
            surroundingSquares.push(squares[index - self.numberOfSlicesVertical]);
            surroundingSquares.push(squares[index + self.numberOfSlicesVertical]);
            surroundingSquares.push(squares[index + 1]);
        } else if (y == self.numberOfSlicesVertical - 1) {
            surroundingSquares.push(squares[index - self.numberOfSlicesVertical]);
            surroundingSquares.push(squares[index + self.numberOfSlicesVertical]);
            surroundingSquares.push(squares[index - 1]);
        } else {
            surroundingSquares.push(squares[index + 1]);
            surroundingSquares.push(squares[index - 1]);
            surroundingSquares.push(squares[index + self.numberOfSlicesVertical]);
            surroundingSquares.push(squares[index - self.numberOfSlicesVertical]);
        }

        return surroundingSquares;
    };
    
    self.possibleMove = function(squares, index) {
        var surroundingSquares = self.getSurroundingSquares(squares, index);

        for (var i=0; i < surroundingSquares.length; i++) {
            if (surroundingSquares[i].hidden) {
                return self.getMoveDirection(squares, index, surroundingSquares[i]);
            }
        }

        return null;
    };

    self.getBlankSquareIndex = function(squares, blankSquare) {
        var blankSquareIndex = -1;

        for (var i=0; i < squares.length; i++) {
            if (squares[i] == blankSquare) {
                blankSquareIndex = i;
                break;
            }
        }

        return blankSquareIndex;
    };

    self.getMoveDirection = function(squares, clickedSquareIndex, blankSquare) {
        var blankSquareIndex = self.getBlankSquareIndex(squares, blankSquare);
        var x = Math.floor(clickedSquareIndex / self.numberOfSlicesVertical);
        var y = clickedSquareIndex % self.numberOfSlicesVertical;
        var xblank = Math.floor(blankSquareIndex / self.numberOfSlicesVertical);
        var yblank = blankSquareIndex % self.numberOfSlicesVertical;

        if (x != xblank) {
            if (x < xblank) {
                return 'down';
            } else {
                return 'up';
            }
        } else {
            if (y < yblank) {
                return 'right';
            } else {
                return 'left';
            }
        }
    };
    
};
