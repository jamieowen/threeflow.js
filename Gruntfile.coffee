child_process = require "child_process"

module.exports = (grunt)->
  grunt.initConfig
    pkg: grunt.file.readJSON "package.json"

    # coffee
    coffee:
      client:
        options:
          join:true
        files:
          "bin/threeflow.js":"src/client/**/*.coffee"
      examples:
        options:
          join:true
          bare:true
        files:
          "examples/js/threeflow_examples.js":"src/examples/**/*.coffee"
      extras:
        files:
          "bin/threeflow_datgui.js":"src/extras/DatGui.coffee"

    uglify:
      main:
        files:
          "bin/threeflow.min.js":"bin/threeflow.js"
          "bin/threeflow_datgui.min.js":"bin/threeflow_datgui.js"

    copy:
      examples:
        expand:true
        flatten:true
        src:"bin/*.*"
        dest: "examples/js/"

    watch:
      main:
        files:[ "src/client/**/*.coffee","src/server/**/*.coffee", "src/examples/**/*.coffee" ]
        tasks:["coffee","copy"]


  grunt.loadNpmTasks "grunt-contrib-coffee"
  grunt.loadNpmTasks "grunt-contrib-copy"
  grunt.loadNpmTasks "grunt-contrib-uglify"
  grunt.loadNpmTasks "grunt-contrib-watch"

  grunt.registerTask "default",["deploy"]
  grunt.registerTask "deploy",["coffee","uglify","copy"]
  grunt.registerTask "dev",["watch"]

  grunt.registerTask "server",()->
    done = @async()
    child_process.exec "coffee src/server/server.coffee",done

