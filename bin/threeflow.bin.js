#!/usr/bin/env node
var arg, args, fs, log, ncp, path, templatePath, threeflow, version, wrench, _i, _len, _ref;

path = require('path');

fs = require('fs');

log = require('../lib/log');

version = require('../lib/version');

wrench = require('wrench');

ncp = require('ncp');

args = {
  start: true
};

_ref = process.argv;
for (_i = 0, _len = _ref.length; _i < _len; _i++) {
  arg = _ref[_i];
  args[arg] = arg;
}

if (args["--version"]) {
  log.notice("Threeflow " + version.number + " / " + version.commit);
  log.notice();
} else if (args.init) {
  log.notice();
  log.notice("Threeflow " + version.number);
  log.info("Creating project...");
  if (fs.existsSync("threeflow.json")) {
    log.warn("threeflow.json already exists!");
    log.info();
  } else {
    templatePath = path.join(__dirname, "..", "templates", "default");
    if (fs.existsSync(templatePath)) {
      ncp.ncp(templatePath, process.cwd(), function(error) {
        if (error) {
          log.warn(error);
        } else {
          log.info("Done.");
          log.notice("Now type 'threeflow start'");
        }
        return log.info();
      });
    } else {
      log.error("Something went pretty wrong: Couldn't find template path.");
    }
  }
} else if (args.update) {
  console.log("update--");
} else if (args.start) {
  threeflow = require(path.join(__dirname, "../lib/server")).create();
  threeflow.javaDetect(function(success) {
    if (success) {
      threeflow.forceSave(args["--force-save"]);
      success = threeflow.optionsJSON(process.cwd());
      if (success) {
        threeflow.startup();
        return log.info();
      }
    } else {
      return log.info("Exiting... :(");
    }
  });
}
