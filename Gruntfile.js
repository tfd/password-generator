module.exports = function (grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: {
      build: ['lib', 'build']
    },

    browserify: {
      standalone: {
        files: {
          'build/<%= pkg.name %>.js': ['src/index.js']
        }
      }
    },

    copy       : {
      standalone: {
        files: [{
                  src : 'build/<%= pkg.name %>.js',
                  dest: 'lib/<%= pkg.name %>.js'
                }]
      }
    },

    // Javascript minification.
    uglify     : {
      compile: {
        options: {
          compress: true,
          verbose : true
        },
        files  : [{
                    src : 'build/<%= pkg.name %>.js',
                    dest: 'lib/<%= pkg.name %>.min.js'
                  }]
      }
    },

    // server tests
    simplemocha: {
      options: {
        globals    : ['expect', 'sinon'],
        timeout    : 3000,
        ignoreLeaks: false,
        ui         : 'bdd',
        reporter   : 'spec'
      },
      src    : ['test/spechelper.js', 'test/**/*.test.js']
    },

    // Check JavaScript correctness
    jshint     : {
      options: {
        plusplus: false,
        node    : true
      },
      files  : {src: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js']}
    }
  });

  grunt.registerTask('test', ['jshint', 'simplemocha']);

  grunt.registerTask('build', ['clean',
                               'test',
                               'browserify:standalone',
                               'copy:standalone',
                               'uglify']);

  grunt.registerTask('default', 'build');
};
