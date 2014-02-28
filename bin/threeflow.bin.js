#!/usr/bin/env node
var arg, args, log, path, threeflow, _i, _len, _ref;

path = require('path');

log = require('../lib/log');

args = {
  start: true
};

_ref = process.argv;
for (_i = 0, _len = _ref.length; _i < _len; _i++) {
  arg = _ref[_i];
  args[arg] = arg;
}

if (args.init) {
  console.log("init--");
} else if (args.update) {
  console.log("update--");
} else {
  threeflow = require(path.join(__dirname, "../lib/server")).create();
  threeflow.javaDetect(function(success) {
    if (success) {
      threeflow.forceSave(args["--force-save"]);
      threeflow.optionsJSON(process.cwd());
      return threeflow.startup();
    } else {
      return log.info("Exiting... :(");
    }
  });
}
