#!/usr/bin/env node
var pkg = require("../package.json");
var program = require("commander");
var helpful = require("../dist");

program.version(pkg.version);

program
  .command("install <template_url>")
  .description("create a new project from a template source")
  .action(function (template_url) {
    helpful.install(template_url, process.cwd());
  });

program
  .command("validate")
  .description("test a local project template configuration")
  .action(function () {
    helpful.validate();
  });

program.parse(process.argv);
