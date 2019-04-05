#!/usr/bin/env node

const meta = require('../package.json');

const program = require('commander');
const { glue } = require('../lib');

program
  .version(meta.version)
  .description('Joins Sublime Text snippets into completions')
  .arguments('<files>')
  .usage('<files> [options]')
  .option('-i, --indent [level]', 'specify indentation level')
  .option('-s, --scope [scope]', 'override default syntax scope')
  .parse(process.argv);

const options = {
  indent: parseInt(program.indent) || 4,
  scope: program.scope ? program.scope : null
};

glue(program.args, options);
