#!/usr/bin/env node

const meta = require('../package.json');

const program = require('commander');
const fs = require('fs');
const glob = require('glob');
const xmlJs = require('xml-js');

program
    .version(meta.version)
    .description('Joins Sublime Text snippets into completions')
    .arguments('<files>')
    .usage('<files> [options]')
    .option('-i, --indent [level]', 'specify indentation level')
    .option('-s, --scope [scope]', 'override default syntax scope')
    .action( pattern => {

        let i = 0;
        let scopes = [];
        let output = {
            'generator': `${meta.name} - ${meta.homepage}`,
            'scope': null,
            'completions': []
        };

        glob(pattern, (error, files) => {

            files.forEach( filePath => {
                let data;
                let obj;


                // Read file
                try {
                    data = fs.readFileSync(filePath);
                } catch (error) {
                    return console.error(`Error: Can't read file "${filePath}"`);
                }


                // Validate XML
                try {
                    obj = xmlJs.xml2js(data, {
                        spaces: 4,
                        compact: true
                    });
                } catch (error) {
                    throw error;
                }

                scopes.push(obj.snippet.scope._text);

                let trigger = obj.snippet.tabTrigger._text;
                let contents = obj.snippet.content._cdata;
                let description = null;

                if (typeof obj.snippet.description !== 'undefined') {
                    description = obj.snippet.description._text || null;
                    if (description !== null) {
                        trigger = `${trigger}\t${description}`;
                    }
                }

                output.completions[i] = {
                    trigger: trigger,
                    contents: contents
                };

                i++;
            });

            if (scopes.unique.length > 1 && typeof program.scope === 'undefined') {
                return console.error('Error: Snippets containing multiple scopes can\'t be joined ' + files);
            }

            if (typeof program.scope !== 'undefined' && program.scope.length > 0) {
                output.scope = program.scope;
            } else {
                output.scope = scopes[0];
            }

            let indent = parseInt(program.indent) || 4;

            console.log(JSON.stringify(output, null, indent));
        });
    })
.parse(process.argv);

if (program.args.length === 0) program.help();

Array.prototype.unique = () => {
  return this.filter( (value, index, self) => {
    return self.indexOf(value) === index;
  });
}
