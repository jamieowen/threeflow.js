path    = require 'path'
clc     = require 'cli-color'

#console.log __dirname

# check for existence of threeflow options file.
# output: renders
# saving: true if output is set, false otherwise
# multiple:

threeflow = require( path.join(__dirname,"../lib/server") ).create()
threeflow.options
  saving:false
  multiple:false
  output:null

threeflow.startup()
