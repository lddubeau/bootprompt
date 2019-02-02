module.exports = function (grunt) {
    grunt.initConfig({
        uglify: {
            options: {
                mangle: false,
                banner: grunt.file.read('header.txt')
            },
            my_target: {
                files: {
                    'dist/bootshine.min.js': ['src/bootshine.js'],
                    'dist/bootshine.locales.min.js': ['src/bootshine.locales.js'],
                    'dist/bootshine.all.min.js': ['src/bootshine.js', 'src/bootshine.locales.js']
                }
            }
        },

        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: ['src/bootshine.js']
        },

        karma: {
            unit: {
                configFile: 'karma.conf.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-karma');

    grunt.registerTask('default', ['jshint', 'karma']);
};
