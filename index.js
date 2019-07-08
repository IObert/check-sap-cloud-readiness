#! /usr/bin/env node

const Table = require('cli-table3');
const Util = require('util');
const Chalk = require('chalk');
const TerminalLink = require('terminal-link');
const CompareVersions = require('compare-versions');
const Fs = require('fs');
const Path = require('path');
const Exec = Util.promisify(require('child_process').exec);

//TODO Add fancy header as welcome message
//TODO add tests, test correct output, test correct detection, test suggestions, eslint for code qualitity

//TODO logic to merge requirements if several options are used + update dependecies if necessary
//TODO add a way to re-use already defined dependencies

//Helpers
String.prototype.grepFirstLine = function(sTerm) {
  return this.split(/\n/).find((s) => s.indexOf(sTerm) > -1)
};
const reVersionString = /(\d+\.)?(\d+\.)(\*|\d+)/;
var bClear = true;
var aMissingTools = [];
var aTools = []

//Check input parameters
if (process.argv.length <= 2) {
  console.log(`Please select an option. Possible values are: `)

  Fs.readdir(Path.join(__dirname, 'options'), function(err, files) {
    if (err) {
      return console.log('Unable to scan directory: ' + err);
    }
    files.forEach(function(file) {
      console.log(file.replace(/\.js/, ''));
    });
  });
  return;
}
process.argv.slice(2).forEach(function(val) {
  let aNewTools = require('./options/' + val.replace('--', ''));
  aTools = aTools.concat(aNewTools);
});

//Define output table, spaces needed to center column headings
const oTable = new Table({
  head: [
    Chalk.bold.black('            Tool'),
    Chalk.bold.black(' Installed'),
    Chalk.bold.black('Recommended'),
    Chalk.bold.black('  Status')
  ],
  colWidths: [30, 13, 13, 13]
});

function startCheck() {
  console.log(Chalk.bgBlackBright.cyan('Performing check now... \n\r\n\r'));
  const aPromises = aTools
    .filter((oTool) => {
      return oTool.platform ? oTool.platform === process.platform : true; // pass if platform prooperty isn't defined or equal to the current platform
    }).map((oTool) => {
      const oLine = [oTool.name, "-", oTool.minVersion, Chalk.bold.red('Missing!')];
      oTable.push(oLine)
      return Exec(oTool.command)
        .then((oResult) => {
          sUnparsed = oTool.parser ? oResult.stdout.grepFirstLine(oTool.parser) : oResult.stdout;
          if (reVersionString.test(sUnparsed)) {
            let iInstalledVersion = sUnparsed.match(reVersionString)[0];
            oLine[1] = iInstalledVersion;
            if (CompareVersions(iInstalledVersion, oTool.minVersion) >= 0) {
              oLine[3] = Chalk.bold.green('OK');
            } else {
              bClear = false;
              oLine[3] = Chalk.bold.yellow('Outdated!');
            }
          } else {
            bClear = false;
            aMissingTools.push(oTool);
          }
        }).catch(() => {
          bClear = false;
          aMissingTools.push(oTool);
        });
    })
  

  Promise.all(aPromises).then(function() {
    console.log(oTable.toString());
    console.log(); //add line break
    if (bClear) {
      console.log(Chalk.bold.green('You are good to go, great!'))
    } else {
      console.log(Chalk.bold.red('Not all required tools are installed and up to date, please fix these issues.'));
      aMissingTools.forEach((oTool) => console.log(TerminalLink(oTool.name, oTool.url)));
    }
  });
}

startCheck();