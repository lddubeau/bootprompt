module.exports = function (grunt) {
    grunt.initConfig({
        uglify: {
            options: {
                mangle: false,
                banner: grunt.file.read('header.txt')
            },
            my_target: {
                files: {
                    'dist/bootprompt.min.js': ['src/bootprompt.js'],
                    'dist/bootprompt.locales.min.js': ['src/bootprompt.locales.js'],
                    'dist/bootprompt.all.min.js': ['src/bootprompt.js', 'src/bootprompt.locales.js']
                }
            }
        },

        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: ['src/bootprompt.js']
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
