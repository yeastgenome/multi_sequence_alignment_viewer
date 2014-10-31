fs = require 'fs'
util = require 'util'

module.exports = (grunt) ->
  # register external tasks
  grunt.loadNpmTasks 'grunt-browserify'
  grunt.loadNpmTasks 'grunt-contrib-connect'
  grunt.loadNpmTasks 'grunt-express'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-copy'
  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-contrib-uglify'

  BUILD_PATH = "server/dev_client/"
  APP_PATH = "client"
  
  grunt.initConfig
    browserify:
      public:
        dest: BUILD_PATH + "/js/public_application.js"
        src: "#{APP_PATH}/jsx/public_bundle.jsx"
        options:
          debug: true

    connect:
      server:
        options:
          port: 3000
          base: 'example'

    # express server
    express:
      # TODO start test server
      # test:
      #   options:
      #     server: './app'
      #     port: 5000
      dev:
        options:
          server: './server/server'
          port: 3000
        
    clean:
      development: [BUILD_PATH]
        
    watch:
      dev:
        files: ["#{APP_PATH}/jsx/**/*.jsx", "#{APP_PATH}/scss/**/*.scss"] 
        tasks: 'compileClient' 
        options:
          livereload: true

    uglify:
      production:
         files:
            "server/dev_client/js/public_application.min.js": ["server/dev_client/js/public_application.js"]
      
  grunt.registerTask 'test', [
    'env:test'
    'development'
    'express:test'
    'mochaTest:controllers'
    'mochaTest:unit'
  ]
  
  grunt.registerTask 'test:controllers', [
    'env:test'
    'express:test'
    'mochaTest:controllers'
  ]
  
  grunt.registerTask 'test:unit', [
    'env:test'
    'express:test'
    'mochaTest:unit'
  ]

  grunt.registerTask 'compileClient', [
    'browserify'
  ]
  
  # builds all assets in production dir, uploads them to AWS bucket for assets
  grunt.registerTask 'productionBuild', [
    'clean:development'
    'compileClient'
    'uglify:production'
  ]

  grunt.registerTask 'default', [
    'clean:development'
    'env:development'
    'connect'
    'compileClient'
    'watch'
  ]
