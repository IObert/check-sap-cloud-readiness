module.exports = [{
  name: "Cloud Foundry CLI",
  command: "cf -v",
  parser: null,
  minVersion: "6.0.0",
  url: "https://developers.sap.com/tutorials/cp-cf-download-cli.html/"
}, {
  name: "Core Data Services CLI",
  command: "cds -v",
  parser: null,
  minVersion: "3.0.0",
  url: "https://help.sap.com/viewer/65de2977205c403bbc107264b8eccf4b/Cloud/en-US/e7806faa5ea24746a52aeb15da92c02f.html"
}, {
  name: "CF CLI - MultiApps Plugin",
  command: "cf plugins",
  parser: "multiapps",
  minVersion: "2.0.0",
  url: "https://developers.sap.com/tutorials/cp-cf-install-cliplugin-mta.html/"
}, {
  name: "CF CLI - HTML5 Plugin",
  command: "cf plugins",
  parser: "html5",
  minVersion: "0.2.7",
  url: "https://sap.github.io/cf-html5-apps-repo-cli-plugin/"
}, {
  name: "Make",
  command: "make -v",
  parser: null,
  minVersion: "3.4",
  url: "https://sap.github.io/cloud-mta-build-tool/makefile/"
}, {
  name: "SQLite",
  command: "sqlite3 -version",
  parser: null,
  minVersion: "3.24.0",
  url: "https://www.sqlite.org/download.html"
}, {
  name: "Windows Build Tools",
  command: "npm ls -g --depth=0",
  parser: "windows-build-tools",
  minVersion: "4.0.0",
  platform: "win32",
  url: "https://www.npmjs.com/package/windows-build-tools"
}];
