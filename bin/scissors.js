#!/usr/bin/env node

const meta = require('../package.json');

const fs = require('fs');
const path = require('path');
const program = require('commander');
const process = require('process');
const sanitize = require('sanitize-filename');
const xmlJs = require('xml-js');

program
    .version(meta.version)
    .description('Splits Sublime Text completions into snippets')
    .arguments('<file>')
    .usage('<file> [options]')
    .option('-s, --scope [scope]', 'override default syntax scope')
    .option('-o, --output [directory]', 'specify default output directory')
    .option('-i, --indent [level]', 'specify indentation level')
    .action(function(file) {

        fs.readFile(file, (err, data) => {
            if (err) throw err;

            let input;
            let outputDir = mkOutDir(file);

            try {
                input = JSON.parse(data.toString());
            } catch (err) {
                return console.error(`Could not read ${file}, invalid JSON?`);
            }

            if (typeof program.scope !== 'undefined' && program.scope !== null) {
                console.log(`Overriding syntax scope to "${program.scope}"`);
            }

            Object.keys(input.completions).forEach(function(key) {
                let indent = parseInt(program.indent) || 4;
                let scope = program.scope || input.scope;
                let contents = input.completions[key].contents;
                let trigger = input.completions[key].trigger;
                let description = '';

                if (typeof contents === 'undefined' || contents === null || typeof trigger === 'undefined' || trigger === null) {
                    return;
                }

                // Split tab-separated description
                if (trigger.indexOf('\t') !== -1 ) {
                    let tabs = trigger.split('\t');
                    if (tabs.length > 2) {
                        console.warn('Conversion aborted, trigger "' + trigger + '" contains multiple tabs');
                    }
                    trigger = tabs[0];
                    description = tabs.slice(-1).pop();
                }

                let obj = {
                    _comment: ` ${meta.name} - ${meta.homepage} `,
                    snippet: {
                        content: {
                            _cdata: contents
                        },
                        tabTrigger: {
                            _text: trigger
                        },
                        description: {
                            _text: description
                        },
                        scope: {
                            _text: scope
                        }
                    }
                };

                let output = xmlJs.js2xml(obj, {
                    compact: true,
                    spaces: indent
                });

                let outputFile = sanitize(trigger) + '.sublime-snippet';
                let outputFullPath = path.join(outputDir, outputFile);

                fs.writeFile(outputFullPath, output, function (err) {
                    if (err) {
                        return console.log(err);
                    }
                    console.log(`Writing "${outputFile}"`);
                });
            });
        });
    })

    .parse(process.argv);

if (program.args.length === 0) program.help();

// Functions
function mkOutDir(file) {
    let outputDir;
    let basename = path.basename(file, path.extname(file));

    if (typeof program.output === 'undefined' || program.output === null) {
        outputDir = path.join(process.cwd(), basename);
    } else {
        outputDir = program.output;
    }

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }

    return outputDir;
}
