String.prototype.grepFirstLine = function (sTerm) {
    return this.split(/\n/).find((s) => s.indexOf(sTerm) > -1)
};


module.exports = {
    VersionStringParser: /(\d+\.)?(\d+\.)(\*|\d+)/
}