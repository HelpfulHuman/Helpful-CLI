#!/usr/bin/env node
var pkg = require("../package.json");
var program = require("commander");
var helpful = require("../dist");

program.version(pkg.version);

program
  .command("add")
  .description("create a new project from a template source")
  .action(function  () {
    helpful();
  });

program
  .command("test")
  .description("test a local project template configuration")
  .action(function () {

  });

program.parse(process.argv);
