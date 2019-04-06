#!/usr/bin/env node

const pkg = require('../package.json');

const program = require('commander');
const updateNotifier = require('update-notifier');
const { scissors } = require('../lib');

program
    .version(pkg.version)
    .description('Splits Sublime Text completions into snippets')
    .arguments('<file>')
    .usage('<file> [options]')
    .option('-s, --scope [scope]', 'override default syntax scope')
    .option('-o, --output [directory]', 'specify default output directory')
    .option('-i, --indent [level]', 'specify indentation level')
    .parse(process.argv);

if (program.args.length === 0) {
  return program.help();
}

const options = {
  indent: parseInt(program.indent) || 4,
  output: program.output ? program.output : null,
  scope: program.scope ? program.scope : null
};

scissors(program.args[0], options);
updateNotifier({pkg}).notify();
