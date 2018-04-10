# JSCookbook #

## Lenny's JavaScript Cookbook ##

The purpose of this repository is serve as a collection of example JavaScript sources that can be re-used, and is not, in its current form, intended to represent any officially released frameworks or standards.

## Dev Environment Setup ##

### .NET Core 2.x Framework SDK ###

It is recommended that you install the .NET Framework 2.x SDK, which can be obtained from <https://www.microsoft.com/net/download/visual-studio-sdks>, since some development activities may require this.

### Node.js ###

The node.js runtime is required for builds and other tasks. this can be obtained from <https://nodejs.org>)

### Visual Studio Code ###

This project developed using Visual Studio Code, which can be downloaded from <https://code.visualstudio.com/download>.

#### Extensions ####

The "npm support VS Code" extension is required for maintaining node.js packages.

This extension, as well as others which are recommended for development, are listed in the .vscode/extensions.json file, and
should appear in the Recommended extension listing in Visual Studio Code. Alternatively, you can refer to <https://sites.google.com/erwinefamily.net/vscodedevcheatsheet> for an example script that you can use in the terminal window to install multiple extensions.

### Node.js packages ###

#### Locally Installed ####

The required Node.js packages are not included in the source code repository of this project but they are listed within the package.json file, and can be downloaded using the `npm update` command.

#### Globally Installed ####

Additionally, the following npm packages most likely need to be installed globally:

- uglify-js
- gulp
- mocha