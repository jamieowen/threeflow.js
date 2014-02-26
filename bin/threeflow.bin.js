#!/usr/bin/env node
var arg, args, path, threeflow, _i, _len, _ref;

path = require('path');

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
} else if (args.start) {
  threeflow = require(path.join(__dirname, "../lib/server")).create();
  threeflow.optionsJSON(process.cwd());
  threeflow.forceSave(args["--force-save"]);
  threeflow.startup();
}
