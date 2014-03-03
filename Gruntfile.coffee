child_process = require "child_process"
eco           = require "eco"
fs            = require "fs"

module.exports = (grunt)->
  grunt.initConfig
    pkg: grunt.file.readJSON "package.json"

    # coffee
    coffee:
      client:
        options:
          join:true
        files:
          "build/threeflow.js":"src/client/**/*.coffee"
      examples:
        options:
          bare:true
        files: grunt.file.expandMapping("src/examples/*.coffee","examples/deploy/js/",
          flatten:true
          rename:(destBase,destPath)->
            destBase + destPath.replace(".coffee",".js")
          )
      server:
        options:
          bare:true
        files: grunt.file.expandMapping("src/server/*.coffee","lib/",
          flatten:true
          rename:(destBase,destPath)->
            filename = destPath.replace ".coffee",".js"
            # only map bin file to bin folder.
            destBase = "bin/" if filename.indexOf("threeflow.bin") is 0
            destBase + filename
        )
    uglify:
      main:
        files:
          "build/threeflow.min.js":"build/threeflow.js"
    copy:

      # prepare examples.
      examples_vendor:
        expand:true
        flatten:true
        src:"src/examples/js/vendor/*.*"
        dest: "examples/deploy/js/vendor"

      examples_models:
        expand:true
        flatten:true
        src:"src/examples/models/*.*"
        dest: "examples/deploy/models"

      examples_build:
        expand:true
        flatten:true
        src:"build/*.*"
        dest: "examples/deploy/js/vendor"

      examples_json:
        src:"src/examples/threeflow.json"
        dest: "examples/threeflow.json"

      templates:
        expand:true
        flatten:true
        src:"build/*.*"
        dest: "templates/default/deploy/js"

    imagemin:
      renders:
        files: [
            pngquant: true
            expand: true                  #Enable dynamic expansion
            cwd: 'examples/renders'      #Src matches are relative to this path
            src: ['**/*.{png,jpg,gif}']   #Actual patterns to match
            dest: 'examples/renders/test'       #Destination path prefix
        ]

    watch:
      main:
        files:[ "src/client/**/*.coffee","src/server/**/*.coffee", "src/examples/*.coffee","src/examples/*.html.eco" ]
        tasks:["coffee","copy","examples-html","bin-shebang"]


  grunt.loadNpmTasks "grunt-contrib-coffee"
  grunt.loadNpmTasks "grunt-contrib-copy"
  grunt.loadNpmTasks "grunt-contrib-uglify"
  grunt.loadNpmTasks "grunt-contrib-watch"
  grunt.loadNpmTasks "grunt-contrib-imagemin"

  grunt.registerTask "default",["deploy"]
  grunt.registerTask "deploy",["version-output","coffee","uglify","copy","examples-html","bin-shebang"]
  grunt.registerTask "dev",["watch"]

  grunt.registerTask "server-default",()->
    done = @async()
    child = child_process.exec "node bin/threeflow.bin.js",done
    child.stdout.pipe process.stdout
    child.stderr.pipe process.stderr
    null

  spawnAndPipe = ( command, args, options, done)->
    sprocess = child_process.spawn command,args,options
    sprocess.on "close",(code)->
      done()
      null
    sprocess.stdout.on "data",(buffer)->
      process.stdout.write buffer
    null

  grunt.registerTask "server",( template )->
    done = @async()
    command = "node"

    if template is "examples"
      cwd = "./examples"
      bin = "../bin/threeflow.bin.js"
    else
      cwd = "./templates/default"
      bin = "../../bin/threeflow.bin.js"

    args = [ bin,"start" ]
    spawnAndPipe( command, args,
      cwd: cwd,
      done )
    null

  grunt.registerTask "clean",()->
    done = @async()
    child_process.exec "rm -rf ./examples/",done
    null

  grunt.registerTask "bin-shebang",()->
    binFile = "bin/threeflow.bin.js"
    binContents = fs.readFileSync binFile
    binContents = "#!/usr/bin/env node" + "\n" + binContents
    fs.writeFileSync binFile, binContents
    null

  grunt.registerTask "examples-html",()->
    examples = grunt.file.expandMapping "src/examples/*.coffee","examples/deploy/",
      flatten:true
      rename:(destBase,destPath)->
        destBase + destPath.replace(".coffee",".html")

    template = grunt.file.read "src/examples/example.html.eco"

    # write example html files.
    for example in examples
      js = example.src[0].split("/").pop().replace(".coffee",".js")
      example.name = js.replace(".js","")
      example.html = example.dest.split("/").pop()

      rendered = eco.render template,
        example_name: example.name
        example_js: js

      console.log "Written ", example.dest
      grunt.file.write example.dest,rendered

    # write index.html
    index = "examples/deploy/index.html"
    template = grunt.file.read "src/examples/index.html.eco"
    grunt.file.write index,eco.render(template,{examples:examples})
    console.log "Written ", index
    null

  grunt.registerTask "readme",(usePath)->
    template = grunt.file.read "src/README.md.eco"
    context = {}
    context.version = grunt.config.get("pkg.version")
    if usePath
      context.rawPath = "https://raw.github.com/jamieowen/threeflow.js/master/"
      context.gitPath = "https://github.com/jamieowen/threeflow.js/tree/master/"
    else
      context.rawPath = ""
      context.gitPath = ""

    rendered = eco.render template,context
    grunt.file.write "README.md",rendered
    null

  ###
  grunt.registerTask "convert-obj",()->
    files = grunt.file.expand "src/models/*.obj"
    done = @async()
    next = ()->
      if files.length
        obj = files.pop()
        inFile = obj
        outFile = "examples/models/" + obj.split("/").pop().replace("obj","json")

        command = "python src/utils/convert_obj_three.py -i " + inFile + " -o " + outFile
        child_process.exec command,next
      else
        done()

    next()
  ###

  grunt.registerTask 'version-output', ()->
    done = @async()
    child_process.exec 'git rev-parse --short HEAD',(error,stdout,stderr)->

      version = grunt.config.get("pkg.version")
      commit = stdout.replace("\n","")

      clientOutput = "# Generated by Grunt task\nTHREEFLOW.VERSION = '" + version + "'\nTHREEFLOW.COMMIT  = '" + commit + "'"
      serverOutput = "# Generated by Grunt task\nmodule.exports = \n  number:'" + version + "'\n  commit:'" + commit + "'"
      fs.writeFileSync "src/client/Version.coffee", clientOutput
      fs.writeFileSync "src/server/version.coffee", serverOutput

      done()
      null
    null



