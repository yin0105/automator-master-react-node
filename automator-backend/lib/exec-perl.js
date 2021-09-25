const { exec } = require('shelljs');

function execPerl(filePath, ...params) {
  if (!/\.pl$/.test(filePath)) {
    filePath = filePath + '.pl';
  }
  console.log("params => ", params);
  console.log("filePath => ", filePath);
  console.log(`perl '${filePath}' ${params.join(' ')}`);
  return new Promise((resolve, reject) => {
    exec(
      `perl "${filePath}" ${params.join(' ')}`,
      { silent: true },
      (code, stdout, stderr) => {
        console.log("code => ", stderr);
        if (stdout != null) {console.log("stdout => ", stdout); resolve(stdout)};
        if (stderr != null) reject(stderr);
      },
    );
  });
}

module.exports = execPerl;
