var MoveController = function(numberOfSlicesVertical, numberOfSlicesHorizontal) {
    var self = this;
    self.numberOfSlicesVertical = numberOfSlicesVertical;
    self.numberOfSlicesHorizontal = numberOfSlicesHorizontal;

    self.moveIfPossible = function(squares, clickedSquareIndex) {
        var possibleMove = self.possibleMove(squares, clickedSquareIndex);

        if (possibleMove != null) {
            var blankSquareIndex = self.getBlankSquareIndex(squares);
            var blankSquare = squares[blankSquareIndex];
            var tmpClip = squares[clickedSquareIndex].clip;
            var tmpClipIndex = squares[clickedSquareIndex].clipIndex;

            squares[clickedSquareIndex].clip = blankSquare.clip;
            squares[clickedSquareIndex].clipIndex = blankSquare.clipIndex;
            squares[clickedSquareIndex].hidden = true;
            blankSquare.clip = tmpClip;
            blankSquare.clipIndex = tmpClipIndex;
            blankSquare.hidden = false;

            squares[clickedSquareIndex].draw();
            blankSquare.draw();
        }
    };

    self.possibleMove = function(squares, index) {
        var surroundingSquares = self.getSurroundingSquares(squares, index);

        for (var i=0; i < surroundingSquares.length; i++) {
            if (surroundingSquares[i].hidden) {
                return self.getMoveDirection(squares, index);
            }
        }

        return null;
    };

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
    
    self.getMoveDirection = function(squares, clickedSquareIndex) {
        var blankSquareIndex = self.getBlankSquareIndex(squares);
        var x = Math.floor(clickedSquareIndex / self.numberOfSlicesVertical);
        var y = clickedSquareIndex % self.numberOfSlicesVertical;
        var xblank = Math.floor(blankSquareIndex / self.numberOfSlicesVertical);
        var yblank = blankSquareIndex % self.numberOfSlicesVertical;

        if (x != xblank) {
            if (x < xblank) {
                return Directions.DOWN;
            } else {
                return Directions.UP;
            }
        } else {
            if (y < yblank) {
                return Directions.RIGHT;
            } else {
                return Directions.LEFT;
            }
        }
    };

    self.getBlankSquareIndex = function(squares) {
        var blankSquareIndex = -1;

        for (var i=0; i < squares.length; i++) {
            if (squares[i].hidden) {
                blankSquareIndex = i;
                break;
            }
        }

        return blankSquareIndex;
    };

};
