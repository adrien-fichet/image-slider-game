describe('Surrounding tiles', function() {
    var moveController;
    var tiles;

    beforeEach(function() {
        moveController = new MoveController(3, 3);
        tiles = [
                '(0,0)', '(0,1)', '(0,2)',
                '(1,0)', '(1,1)', '(1,2)',
                '(2,0)', '(2,1)', '(2,2)'
        ];
    });

    it('should be (0,1) and (1,0) for index 0', function() {
        expect(moveController.getSurroundingTiles(tiles, 0)).toEqual(['(0,1)', '(1,0)']);
    });

    it('should be (0,0), (0,2) and (1,1) for index 1', function() {
        expect(moveController.getSurroundingTiles(tiles, 1)).toEqual(['(0,0)', '(0,2)', '(1,1)']);
    });

    it('should be (0,1) and (1,2) for index 2', function() {
        expect(moveController.getSurroundingTiles(tiles, 2)).toEqual(['(0,1)', '(1,2)']);
    });

    it('should be (0,0), (2,0) and (1,1) for index 3', function() {
        expect(moveController.getSurroundingTiles(tiles, 3)).toEqual(['(0,0)', '(2,0)', '(1,1)']);
    });

    it('should be (1,2), (1,0), (2,1) and (0,1) for index 4', function() {
        expect(moveController.getSurroundingTiles(tiles, 4)).toEqual(['(1,2)', '(1,0)', '(2,1)', '(0,1)']);
    });

    it('should be (0,2), (2,2) and (1,1) for index 5', function() {
        expect(moveController.getSurroundingTiles(tiles, 5)).toEqual(['(0,2)', '(2,2)', '(1,1)']);
    });

    it('should be (2,1) and (1,0) for index 6', function() {
        expect(moveController.getSurroundingTiles(tiles, 6)).toEqual(['(2,1)', '(1,0)']);
    });

    it('should be (2,2), (2,0) and (1,1) for index 7', function() {
        expect(moveController.getSurroundingTiles(tiles, 7)).toEqual(['(2,2)', '(2,0)', '(1,1)']);
    });

    it('should be (2,1) and (1,2) for index 8', function() {
        expect(moveController.getSurroundingTiles(tiles, 8)).toEqual(['(2,1)', '(1,2)']);
    });
});
