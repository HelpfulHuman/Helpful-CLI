#!/usr/bin/env node
const pkg = require('./package.json');
const program = require('commander');

program.version(pkg.version);

program
  .command('init')
  .description('create a new project')
  .action(require('./commands/init'));

program.parse(process.argv);
