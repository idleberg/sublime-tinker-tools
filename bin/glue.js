#!/usr/bin/env node

const pkg = require('../package.json');

const program = require('commander');
const updateNotifier = require('update-notifier');
const { glue } = require('../lib');

program
  .version(pkg.version)
  .description('Joins Sublime Text snippets into completions')
  .arguments('<files>')
  .usage('<files> [options]')
  .option('-i, --indent [level]', 'specify indentation level')
  .option('-s, --scope [scope]', 'override default syntax scope')
  .parse(process.argv);

if (program.args.length === 0) {
  return program.help();
}

const options = {
  indent: parseInt(program.indent) || 4,
  scope: program.scope ? program.scope : null
};

glue(program.args, options);
updateNotifier({pkg}).notify();
