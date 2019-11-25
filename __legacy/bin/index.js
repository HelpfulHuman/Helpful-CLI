#!/usr/bin/env node
var pkg = require("../package.json");
var program = require("commander");
var helpful = require("../dist");

program.version(pkg.version);

program
  .command("install <template_url> [target_dir]")
  .description("create a new project from a template source")
  .action(function (template_url, target_dir) {
    helpful.install(template_url, target_dir || process.cwd());
  });

program
  .command("validate [target_dir]")
  .description("test a local project template configuration")
  .action(function (target_dir) {
    helpful.validate(target_dir || process.cwd());
  });

program.parse(process.argv);
