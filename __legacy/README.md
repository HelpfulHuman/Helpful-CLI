# Helpful CLI

**tl; dr** "Templatize Anything"

> This tool is currently undergoing a massive rewrite.  You can still use the original version of this tool by installing it via `npm`, or review its source on the `v1` branch.

Helpful CLI is a command line utility for quickly scaffolding new projects, or add files to existing projects, using remote templates.  It's kind of like a `Makefile`, but on steroids. Templates must contain a `helpful` manifest file in JSON, CommonJS or YAML format.

## Installation

Helpful CLI is written using [NodeJS](https://www.nodejs.org/) and is currently only available via `npm`.  Run the following `npm` command to install.  Once installed, you can access Helpful CLI using the `helpme` command in your terminal of choice.

```
npm install -g helpful-cli
```

## Usage

1. Find a repository that contains a `helpful.json`, `helpful.js` or `helpful.yml` manifest file.
1. Change to a local directory that you would like to unpack the template into.
1. Run `helpme install <template_url>` to start the installer.
1. Follow the instructions in the prompt.

**Or...**

```
mkdir Example
cd Example
helpme install helpfulhuman/cli-example
```

## Creating Templates

Helpful CLI can be used with just about any codebase, existing or otherwise.  There are 2 requirements for creating a Helpful CLI compliant package.

1. A properly constructed and formatted [manifest file](#the-helpful-manifest-file).
1. Your template must be hosted by a [supported remote type](#supported-remotes).

## The `helpful` Manifest File

The `helpful` manifest file is a JSON, CommonJS or YAML file that provides a list of instructions to the Helpful CLI tool.  The format of this file can be summed up as **"ask, copy, run"**.  The basic template for a manifest file looks like this...

#### JSON

```json
{
  "ask": [],
  "copy": [],
  "run": []
}
```

#### CommonJS

> This format allows you to use all the NodeJS runtime has to offer and can be useful for greater control when handling conditionals based on user input.

```js
module.exports = {
  ask: [],
  copy: [],
  run: []
};
```

#### YAML

```yml
ask:
copy:
run:
```

### Ask

The `ask` portion of your manifest file contains a list of "question" objects.  These objects are used to create terminal prompts that will collect configuration choices from your template's user.  This input will allow you to alter Helpful CLI's behaviour when copying files and running scripts.

Helpful CLI currently uses [inquirer](https://github.com/SBoudrias/Inquirer.js/) under the hood and fully supports its question object API.  We're only covering the basics here, so feel free to look at their documentation for more info.

#### Question Object (Basics)

Name | Type | Description
-----|------|------------
**type** | `String` | Defaults to `input`. The type of question prompt presented to the user.  Possible options include `input`, `confirm`, `list`, and `checkbox`.
**name** | `String` | Required.  The variable name that will store the captured user input.
**message** | `String` | Required.  The message that will be displayed to the user.
**default** | `Mixed` | Default value(s) to use if nothing is entered.
**choices** | `Array` | Required with `list` and `checkbox`.  Values can be simple strings, or objects containing a `name` (to display in list), a `value` (to save in the answers hash) and a `short` (to display after selection) properties.

#### Example

```json
{
  "ask": [
    {
      "name": "projectName",
      "message": "What is the name of your project?"
    },
    {
      "type": "list",
      "name": "deployTarget",
      "message": "What is your project's target deployment environment?",
      "choices": [ "AWS", "Docker", "Heroku" ]
    }
  ]
}
```

### Copy

The `copy` property is an array containing "copy operation" objects.  This tells Helpful CLI what to copy from the template to the target directory.  All file locations are relative to where the manifest file is.

It's worth noting that every file that is copied is also run through the [Nunjucks](https://mozilla.github.io/nunjucks/) templating engine.  This allows you to customize templates with the user input you collected in the `ask` step.  For more information, check out the [Nunjucks templating docs](https://mozilla.github.io/nunjucks/templating.html).

#### Copy Operation Object

Name | Type | Description
-----|------|------------
**path** | `String` | Required. Can be a path to a file, folder or a [glob](https://github.com/isaacs/node-glob).
**exclude** | `String|Array` | An optional pattern or an array of glob patterns to exclude matches.
**overwrite** | `Boolean` | Defaults to `false`.  When true, the copy operation will replace any existing folders at the file's destination with the new one.  _Use this wisely!_
**renameFile** | `String` | Allows you to rename a file to the set string.  Useful for copying over files like `_gitignore` as `.gitgnore`.  _Do not use with glob patterns or directories!_
**renameDir** | `String` | Optionally change the directory that the file(s) will be copied to, relative to the target directory's root.
**when** | `String|Function` | Will only copy the file(s) when the result is `true`.  See [Using `when` Strings](#using-when-strings) for more information on `String` usage.

#### Example

```json
{
  "copy": [
    {
      "path": "package.json"
    },
    {
      "path": "_gitignore",
      "renameFile": ".gitignore"
    },
    {
      "path": "src/**/*.js",
      "overwrite": true
    }
  ]
}
```

### Run

Finally, the `run` field is an array of "command objects".  These objects represent shell commands that can be run in the target directory.  Like the template files in the `copy` step, each command is run through the [Nunjucks](https://mozilla.github.io/nunjucks/) templating engine.  This allows you to customize your commands with the input collected in the `ask` step.

#### Command Object

Name | Type | Description
-----|------|------------
**cmd** | `String` | Required. The shell command to run.  Will be parsed by Nunjucks.
**when** | `String|Function` | Will only run the command when the result is `true`.  See [Using `when` Strings](#using-when-strings) for more information on `String` usage.

#### Example

```json
{
  "ask": [
    {
      "type": "checkbox",
      "name": "libs",
      "message": "Would you like to install any of these libraries?",
      "choices": ["lodash", "jquery", "rx"]
    }
  ],
  "run": [
    {
      "cmd": "npm install -S {{ libs | join(' ') }}",
      "when": "libs.length > 0"
    }
  ]
}
```

### Final Message on Success

It's not unlikely that you'll want to include a closing message upon successful installation of your template.  You can do this using an object for a `done` property.  The done property contains only a "Done object", which is outlined below.

#### Done Object

Name | Type | Description
-----|------|------------
**message** | `String` | Required. The message will be output as the final statement upon successful installation of a template.  Will be parsed by Nunjucks.
**when** | `String|Function` | Will only run the command when the result is `true`.  See [Using `when` Strings](#using-when-strings) for more information on `String` usage.

#### Example

```json
{
  "done": {
    "message": "Run `npm start` to see your application"
  }
}
```

### Using `when` Strings

Doing any kind of circumstancial or dynamic checking with static files like JSON or YAML is difficult.  To circumvent this limitation, we've implemented the `when` property for `copy` and `run` objects.  This property can take a string as an alternative that will be treated as a JS expression that only has access to user input (from the `ask` step).

Here's a quick sample of how it can be used.

```json
{
  "ask": [
    {
      "type": "confirm",
      "name": "createReadme",
      "message": "Would you like to add a README file?"
    }
  ],
  "copy": [
    {
      "path": "README.md",
      "overwrite": true,
      "when": "createReadme == true"
    }
  ]
}
```

## Supported Remotes

These are the remotes _currently_ supported by Helpful CLI.

#### Public GitHub repositories

GitHub is probably the easiest way to host your template.  You can download a GitHub hosted template using either of of the following methods.

```
helpme install username/repository
helpme install github.com/username/repository
```

#### Publicly accessible `.zip` files

You can host a `.zip` template anywhere you like, but you need to make sure that the full URL (with a `.zip` extensions) is provided in order to download.

```
helpme install http://mydomain.com/files/my-template.zip
```

#### Planned Remote Support

* GitHub (private)
* BitBucket (public and private)
* GitLab (public and private)
* `.zip` files (authenticated)