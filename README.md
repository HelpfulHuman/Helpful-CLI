# Helpful CLI

> This tool is currently undergoing a massive rewrite.  You can still use the original version of this tool by installing it via `npm`, or review its source on the `v1` branch.

Command line utility for quickly scaffolding projects from remote templates.  Like a `Makefile` but on steroids.

## Installation

Install via `npm`:

```
npm install -g helpful-cli
```

## Usage

1. Find a repository that contains a `helpful.json` manifest file.
1. Change to the directory that you would like to unpack the template into.
1. Run `helpme add <template_url>` to start the installer.

## Creating Custom Templates