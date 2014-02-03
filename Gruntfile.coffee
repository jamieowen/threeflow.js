
module.exports = (grunt)->
  grunt.initConfig
    pkg: grunt.file.readJSON "package.json"

    # coffee
    coffee:
      compile:
        files:
          "bin/threeflow.js":"src/**/*.coffee"
          "examples/deploy/js/examples.js":"src/**/*.coffee"

    # copy bin to examples
    copy:
      main:
        files:[
          { "bin/threeflow.js":"examples/deploy/js" }
        ]

    uglify:
      main:
        files:
          "bin/threeflow.min.js":"bin/threeflow.js"


  grunt.loadNpmTasks "grunt-contrib-coffee"
  grunt.loadNpmTasks "grunt-contrib-copy"
  grunt.loadNpmTasks "grunt-contrib-uglify"

  grunt.registerTask "default",["deploy"]
  grunt.registerTask "deploy",["coffee","uglify","copy"]







