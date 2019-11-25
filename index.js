#! /usr/bin/env node

const Table = require('cli-table3');
const Util = require('util');
const Chalk = require('chalk');
const TerminalLink = require('terminal-link');
const CompareVersions = require('compare-versions');
const Fs = require('fs');
const Path = require('path');
const Exec = Util.promisify(require('child_process').exec);

const { VersionStringParser } = require('./helpers');

//TODO add tests, test correct output, test correct detection, test suggestions, eslint for code qualitity
//TODO logic to merge requirements if several options are used + update dependecies if necessary
//TODO add a way to re-use already defined dependencies

const sleep = require('util').promisify(setTimeout)

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
const aMissingTools = [];


//Check input parameters
if (process.argv.length <= 2) {
  console.error(`Please select an option. Possible values are:\n\r`)
  let sample;

  Fs.readdir(Path.join(__dirname, 'options'), function (err, files) {
    if (err) {
      return console.error('Unable to scan directory: ' + err);
    }
    files.forEach(function (file) {
      sample = file.replace(/\.js/, '');
      console.error(sample);
    });

    console.error(`\n\rExample: npx check-sap-cloud-readiness -${sample}`)
  });
  return
}

(async function startCheck() {
  // await sleep(4000); //can be used for debugging
  console.log(Chalk.bgBlackBright.cyan('Performing check now... \n\r\n\r'));

  const aCommandPromises = triggerAllCommands();
  Promise.all(aCommandPromises)
    .then(printSummary);
})();


function getComponentsToCheck() {
  let aTools = [];
  process.argv.slice(2).forEach(function (val) {
    let aNewTools = require('./options/' + val.replace('-', ''));
    aTools = aTools.concat(aNewTools);
  });
  // check if target platform is defined and applies to the current platform
  return aTools.filter((oTool) => {
    return oTool.platform ? oTool.platform === process.platform : true;
  });
}

function triggerAllCommands() {
  return getComponentsToCheck()
    .map((oTool) => {
      const oLine = [oTool.name, "-", oTool.minVersion || "-", Chalk.bold.red('Missing!')];
      oTable.push(oLine)
      return Exec(oTool.command)
        .then(function (oResult) {
          sUnparsed = oTool.parser ? oResult.stdout.grepFirstLine(oTool.parser) : oResult.stdout;
          if (oTool.skipVersion && sUnparsed) {
            oLine[2] = '-';
            oLine[3] = Chalk.bold.green('OK');
          } else if (VersionStringParser.test(sUnparsed)) {
            compareVersion(oLine, oTool);
          } else {
            aMissingTools.push(oTool);
          }
        }).catch((oError) => {
          if (oError.message.indexOf("Command failed:") >= 0) {

            aMissingTools.push(oTool);
            return;
          }
          throw oError;

        });
    })

  function compareVersion(oLine, oTool) {
    let iInstalledVersion = sUnparsed.match(VersionStringParser)[0];
    oLine[1] = iInstalledVersion;
    if (CompareVersions(iInstalledVersion, oTool.minVersion) >= 0) {
      oLine[3] = Chalk.bold.green('OK');
    }
    else {
      oLine[3] = Chalk.bold.yellow('Outdated!');
      aMissingTools.push(oTool);
    }
  }
}

function printSummary() {
  console.log(oTable.toString());
  console.log(); //add line break
  if (aMissingTools.length === 0) {
    console.log(Chalk.bold.green('You are good to go, great!'))
  } else {
    console.log(Chalk.bold.red('Not all required tools are installed and up to date, please fix these issues.'));
    aMissingTools.forEach((oTool) => console.log(TerminalLink(oTool.name, oTool.url)));

    console.log(Chalk.bold('If you think you installed all tools property, please check your PATH variable to make sure the tools are referenced there.'));
  }
}

