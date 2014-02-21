#!/usr/bin/env node
var clc, path, threeflow;

path = require('path');

clc = require('cli-color');

threeflow = require(path.join(__dirname, "../lib/server")).create();

threeflow.options({
  saving: false,
  multiple: false,
  output: null
});

threeflow.startup();
