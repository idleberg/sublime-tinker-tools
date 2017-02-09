#!/usr/bin/env node

const meta = require('../package.json');
const program = require('commander');
const fs = require('fs');
const path = require('path');
const xmlJs = require('xml-js');

program
    .version(meta.version)
    .description('Joins Sublime Text snippets into completions')
    .arguments('<dir>')
    .usage('<dir> [options]')
    .option('-i, --indent [level]', 'specify indentation level')
    .option('-s, --scope [scope]', 'override default syntax scope')
    .action(function(dir) {

        if (fs.lstatSync(dir).isDirectory() === false) {
            console.error('Error: Not a directory');
            return;
        }

        let i = 0;
        let scopes = [];
        let output = {
            'generator': `${meta.name} - ${meta.homepage}`
        };
        output.completions = [];

        let files = fs.readdirSync(dir).sort();

        files.forEach(function(file) {
            let filePath = path.join(dir, file);
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

        if (unique(scopes).length > 1 && typeof program.scope === 'undefined') {
            return console.error('Error: Snippets of multiple scopes can\'t be joined');
        }

        if (typeof program.scope !== 'undefined' && program.scope.length > 0) {
            output.scope = program.scope;
        } else {
            output.scope = scopes[0];
        }
        
        let indent = parseInt(program.indent) || 4;

        console.log(JSON.stringify(output, null, indent));
    })
 .parse(process.argv);

if (program.args.length === 0) program.help();

// Kudos http://codereview.stackexchange.com/a/83718
function unique(xs) {
    var seen = {};
    return xs.filter(function(x) {
        if (seen[x])
            return;
        seen[x] = true;
        return x;
    });
}
