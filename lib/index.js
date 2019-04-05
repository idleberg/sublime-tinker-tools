const meta = require('../package.json');

const arrayUniq = require('array-uniq');
const { existsSync, readFile, readFileSync, writeFile } = require('fs');
const globby = require('globby');
const logSymbols = require('log-symbols');
const { basename, extname, join } = require('path');
const sanitize = require('sanitize-filename');
const xmlJs = require('xml-js');

const makeOutDir = async (file, options) => {
  let outputDir;
  let fileBaseName = basename(file, extname(file));

  if (typeof options.output === 'undefined' || options.output === null) {
    outputDir = join(process.cwd(), fileBaseName);
  } else {
    outputDir = options.output;
  }

  if (!existsSync(outputDir)) {
    mkdirSync(outputDir);
  }

  return outputDir;
};

const glue = async (pattern, options) => {
  let scopes = [];
  let output = {
    generator: `${meta.name} - ${meta.homepage}`,
    scope: null,
    completions: []
  };

  const files = await globby(pattern);
  files.forEach(file => {
    let data;
    let obj;

    // Read file
    try {
      data = readFileSync(file);
    } catch (error) {
      console.warn(
        logSymbols.warning,
        `Error: Can't read file "${file}"`
      );
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

    const contents = obj.snippet.content._cdata;
    let trigger = obj.snippet.tabTrigger._text;
    let description = null;

    if (typeof obj.snippet.description !== 'undefined') {
      description = obj.snippet.description._text || null;
      if (description !== null) {
        trigger = `${trigger}\t${description}`;
      }
    }

    output.completions.push({
      trigger: trigger,
      contents: contents
    });

    if (arrayUniq(scopes).length > 1 && !options.scope) {
      console.error(
        logSymbols.error,
        'Error: Snippets need to share a common scope'
      );
      process.exit();
    }

    output.scope = options.scope ? options.scope : scopes[0];
  });

  console.log(JSON.stringify(output, null, options.indent));
};

const scissors = (file, options) => {
  readFile(file, async (err, data) => {
    if (err) throw err;

    let input;
    const outputDir = await makeOutDir(file, options);

    try {
      input = JSON.parse(data.toString());
    } catch (err) {
      console.error(logSymbols.error`Could not read ${file}, invalid JSON?`);
      process.exit();
    }

    if (typeof options.scope !== 'undefined' && options.scope !== null) {
      console.log(
        logSymbols.info,
        `Overriding syntax scope to "${options.scope}"`
      );
    }

    Object.keys(input.completions).forEach(key => {
      const scope = options.scope ? options.scope : input.scope;
      const contents = input.completions[key].contents;
      const trigger = input.completions[key].trigger;
      let description = '';

      if (!contents ||!trigger) {
        return;
      }

      // Split tab-separated description
      if (trigger.indexOf('\t') !== -1) {
        let tabs = trigger.split('\t');
        if (tabs.length > 2) {
          console.warn(
            logSymbols.warning
            `Conversion aborted, trigger "'${trigger}" contains multiple tabs`
          );
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

      const output = xmlJs.js2xml(obj, {
        compact: true,
        spaces: options.indent
      });

      const outputFile = sanitize(trigger) + '.sublime-snippet';
      const outputFullPath = join(outputDir, outputFile);

      writeFile(outputFullPath, output, error => {
        if (error) {
          return console.error(
            logSymbols.error,
            `Error: Failed to write ${outputFile}`
          );
        }
        console.log(logSymbols.success, `Writing "${outputFile}"`);
      });
    });
  });
};

module.exports = {
  glue: glue,
  scissors: scissors
};
