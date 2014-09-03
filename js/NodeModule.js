/* Exports image-slider-game API as a node.js module. */

;(function() {
	var fs = require('fs');
    var file_list = [ 'Directions.js', 'Size.js', 'Position.js',
	    'Clip.js', 'Solver.js', 'MoveController.js', 'Shuffler.js',
	    'Tile.js', 'Menu.js', 'ImageSliderGame.js'];

    for (var i = 0; i < file_list.length; i++)
        eval(fs.readFileSync(__dirname + '/' + file_list[i],
            'utf8'));

    var NodeModule = {
        'Directions': Directions,
        'Size': Size,
        'Position': Position,
        'Clip': Clip,
        'Solver': Solver,
        'MoveController': MoveController,
        'Shuffler': Shuffler,
        'Tile': Tile,
        'Menu': Menu,
        'ImageSliderGame': ImageSliderGame
    };

    module.exports = NodeModule;
}.call(this));
