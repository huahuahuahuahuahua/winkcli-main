// 判断node版本，应高于14版本
function judgeNodeVersion() {
  const currentNodeVersion = process.versions.node;
  const semver = currentNodeVersion.split(".");
  const major = Number(semver[0]);

  if (major < 14) {
    console.error(
      "You are running Node " +
        currentNodeVersion +
        ".\n" +
        "Create React App requires Node 14 or higher. \n" +
        "Please update your version of Node."
    );
    process.exit(1);
  }
}
module.exports = {
  judgeNodeVersion,
};
