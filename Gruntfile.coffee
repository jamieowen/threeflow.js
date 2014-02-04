
module.exports = (grunt)->
  grunt.initConfig
    pkg: grunt.file.readJSON "package.json"

    # coffee
    coffee:
      bin:
        options:
          join:true
        files:
          "bin/threeflow.js":"src/**/*.coffee"
      examples:
        options:
          join:true
          bare:true
        files:
          "examples/deploy/js/threeflow_examples.js":"examples/src/**/*.coffee"

    uglify:
      main:
        files:
          "bin/threeflow.min.js":"bin/threeflow.js"

    copy:
      main:
        expand:true
        flatten:true
        src:"bin/*.*"
        dest: "examples/deploy/js/"

    watch:
      main:
        files:[ "src/**/*.coffee","server/**/*.coffee", "examples/src/**/*.coffee" ]
        tasks:["dev"]


  grunt.loadNpmTasks "grunt-contrib-coffee"
  grunt.loadNpmTasks "grunt-contrib-copy"
  grunt.loadNpmTasks "grunt-contrib-uglify"
  grunt.loadNpmTasks "grunt-contrib-watch"

  grunt.registerTask "default",["deploy"]
  grunt.registerTask "deploy",["coffee","uglify","copy"]
  grunt.registerTask "dev",["coffee","copy","watch"]







