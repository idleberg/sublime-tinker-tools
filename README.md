# sublime-tinker-tools

[![npm](https://img.shields.io/npm/l/sublime-tinker-tools.svg?style=flat-square)](https://www.npmjs.org/package/sublime-tinker-tools)
[![npm](https://img.shields.io/npm/v/sublime-tinker-tools.svg?style=flat-square)](https://www.npmjs.org/package/sublime-tinker-tools)
[![Travis](https://img.shields.io/travis/idleberg/sublime-tinker-tools.svg?style=flat-square)](https://travis-ci.org/idleberg/sublime-tinker-tools)
[![David](https://img.shields.io/david/idleberg/sublime-tinker-tools.svg?style=flat-square)](https://david-dm.org/idleberg/sublime-tinker-tools)
[![David](https://img.shields.io/david/dev/idleberg/sublime-tinker-tools.svg?style=flat-square)](https://david-dm.org/idleberg/sublime-tinker-tools?type=dev)

CLI-tools to split or join Sublime Text snippets and completions

## Installation

`npm install -g sublime-tinker-tools`

## Usage

### CLI

Once installed, two commands are available from the command-line: `glue` and `scissors`.

```bash
# Converts snippets into completions (use quotes with wildcards!)
$ glue "*.sublime-snippets" > result.sublime-completions

# Converts completions into snippets
$ scissors result.sublime-completions --output Snippets
```

For a list of available option, please make use of the `--help` flag.

## License

This work is licensed under [The MIT License](https://opensource.org/licenses/MIT)

## Donate

You are welcome support this project using [Flattr](https://flattr.com/submit/auto?user_id=idleberg&url=https://github.com/idleberg/sublime-tinker-tools) or Bitcoin `17CXJuPsmhuTzFV2k4RKYwpEHVjskJktRd`
