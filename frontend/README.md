# Form-Fueled Frontend

This project is a Angular front-end for Form-fueled application.

## Table of Contents
  - [Installation](#installation)
    - [Prerequisites](#prerequisites)
    - [Clone repo](#clone-repo)
  - [VS Code setup](#vs-code-setup)
  - [Usage](#usage)
  - [Updating Packages](#updating-packages)
  - [Build](#build)
  - [Pre Checks](#pre-checks)
  - [Contributing](#contributing)

## Installation

### Prerequisites
- Install node v16 or higher
- Install npm v7 or higher (will be preinstalled with node)
- Install [Angular CLI](https://github.com/angular/angular-cli) version 11.2.13 or higher

### Clone repo

``` bash
# clone the repo
$ git clone <github-repo-path>

# move into project frontend directory
$ cd form-fueled/frontend

# install app's dependencies
$ npm install -d
# -d for dev dependencies
```

## VS Code setup
VS Code ships wih pre-configured js/ts language support by default
- Extension to support linting (this helps to avoid `ng lint` errors later on)
  - [TS Lint](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-tslint-plugin)
  - [SCSS Formatter](https://marketplace.visualstudio.com/items?itemName=sibiraj-s.vscode-scss-formatter)
  - [Angular Snippets](https://marketplace.visualstudio.com/items?itemName=johnpapa.Angular2&wt.mc_id=angularessentials-github-jopapa) `Optional`
  - [Angular Language Service](https://marketplace.visualstudio.com/items?itemName=Angular.ng-template) `Optional`
  - [Document This](https://github.com/joelday/vscode-docthis) `Optional`
- To format the code `Alt+Shift+f`

## Usage

``` bash
# serve with hot reload at localhost:4200.
$ ng serve -o
```

## Updating Packages

- To update the packages for minor versions
```bash
$ npm update
# Optionally can pass package names
```
- To sync / update the packages based on `package-lock.json` (or before a release)
```bash
$ npm ci
# This will only sync your local npm_modules folder based on package-lock.json. 
# It will not update / upgrade any packages directly.
```

## Build

There are 2 environments set up

- Local
``` bash
# build for local env
$ ng build
```
- Prod
``` bash
# build for prod env
$ ng build --prod
```

## Pre Checks
- Before making a commit or PR, please lint your code changes via `ng lint` command and `resolve errors` if any
- Remove `comments` if unnecessary
- Avoid `console.log` in your code commits
- Try to format the file before making a commit

## Contributing

- Please read through Angular's [style guidelines](https://angular.io/guide/styleguide)
