/*
 * grunt-fontcustom
 * 
 *
 * Copyright (c) 2015 pigz
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {
  // load all npm grunt tasks
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js'
      ],
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Configuration to be run (and then tested).
    fontcustom: {
      option : {
        name : 'aliyun-console-iconfont',
        selector : '.icon-{{glyph}}',
        input : 'test/svg',
        output : 'test/out',
        css : '_iconfont.css',
        preview : 'iconfont-preview.html',
        debug : 1
      }
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'fontcustom']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
