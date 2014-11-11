fs = require 'fs'
util = require 'util'

module.exports = (grunt) ->
  # register external tasks
  grunt.loadNpmTasks 'grunt-browserify'
  grunt.loadNpmTasks 'grunt-contrib-connect'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-uglify'

  BUILD_PATH = "server/dev_client/"
  APP_PATH = "client"
  
  grunt.initConfig
    browserify:
      development:
        dest: 'example/main.js'
        src: 'example_src/main.jsx'
        options:
          debug: true

    connect:
      server:
        options:
          port: 3000
          base: 'example'
        
    watch:
      dev:
        files: ['lib/**/*.jsx', 'example_src/**/*.jsx'] 
        tasks: 'browserify' 
        options:
          livereload: true

    uglify:
      production:
         files:
            "server/dev_client/js/public_application.min.js": ["server/dev_client/js/public_application.js"]

  grunt.registerTask 'default', [
    #'clean:development'
    'connect'
    'browserify'
    'watch'
  ]
