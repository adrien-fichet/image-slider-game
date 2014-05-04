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
                    'build/Size.js',
                    'build/Position.js',
                    'build/Clip.js',
                    'build/Solver.js',
                    'build/MoveController.js',
                    'build/Shuffler.js',
                    'build/Tile.js',
                    'build/Menu.js',
                    'build/ImageSliderGame.js',
                    'build/main.js'
                ],
                dest: 'build/grunt-concat-all.js'
            }
        },
        karma: {
            options: {
                files: [
                    'js/MoveController.js',
                    'test/*.js',
                ],
                frameworks: ['jasmine'],
            },
            dev: {
                browsers: ['Chrome']
            },
            continuous: {
                singleRun: true,
                browsers: ['PhantomJS']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-karma');
};
