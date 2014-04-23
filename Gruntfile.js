module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            build: {
                files: [{
                    expand: true,
                    cwd: 'js',
                    src: '**/*.js',
                    dest: 'build'
                }]
            }
        },
        concat: {
            build: {
                src: [
                    'build/Directions.js',
                    'build/Dimensions.js',
                    'build/Position.js',
                    'build/Clip.js',
                    'build/MoveController.js',
                    'build/Tile.js',
                    'build/Menu.js',
                    'build/ImageSliderGame.js',
                    'build/main.js'
                ],
                dest: 'build/grunt-concat-all.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
};
