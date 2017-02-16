#!/usr/bin/env node
var pkg = require("../package.json");
var program = require("commander");
var helpful = require("../dist");

program.version(pkg.version);

program
  .command("add <template_url>")
  .description("create a new project from a template source")
  .action(function (template_url) {
    helpful.add(template_url, process.cwd());
  });

program
  .command("test")
  .description("test a local project template configuration")
  .action(function () {
    // TODO
  });

program.parse(process.argv);
