# sublime-tinker-tools

[![npm](https://img.shields.io/npm/l/sublime-tinker-tools.svg?style=flat-square)](https://www.npmjs.org/package/sublime-tinker-tools)
[![npm](https://img.shields.io/npm/v/sublime-tinker-tools.svg?style=flat-square)](https://www.npmjs.org/package/sublime-tinker-tools)
[![CircleCI](https://flat.badgen.net/circleci/github/idleberg/sublime-tinker-tools)](https://circleci.com/gh/idleberg/sublime-tinker-tools)
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

## Motivation

Both, snippets and completions, have their own pros and cons.

Feature        | Snippets | Completions
---------------|----------|------------------
Format         | `Plist`  | `JSON`
Description    | Yes      | Yes (but kinda hacky)
Many per File  | No       | Yes
Fuzzy Complete | No       | Yes

Snippets are usually less annoying for the user, but can be painful to manage – which exactly is the strong point of completions.  

## License

This work is licensed under [The MIT License](https://opensource.org/licenses/MIT)

## Donate

You are welcome to support this project using [Flattr](https://flattr.com/submit/auto?user_id=idleberg&url=https://github.com/idleberg/sublime-tinker-tools) or Bitcoin `17CXJuPsmhuTzFV2k4RKYwpEHVjskJktRd`
