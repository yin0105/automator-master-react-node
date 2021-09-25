const fs = require('fs').promises;
const path = require('path');
const inquirer = require('inquirer');
const mkdirp = require('mkdirp');
const { exelParser } = require('../../lib/cri/db');
const { getFileList, isExelFile } = require('../../lib/util/file');

async function main() {
  const { filePath, noDeleteOriginal } = await inquirer.prompt([
    {
      type: 'input',
      name: 'filePath',
      message: 'Please enter path :',
    },
    {
      type: 'confirm',
      name: 'noDeleteOriginal',
      message: 'Do you want to keep the original file without deleting it? :',
    },
  ]);

  const startTime = Date.now();
  const files = await getFileList(filePath);
  const originalDirPath = `${filePath}/original`.replace(/\/{2,}/, '/');

  if (noDeleteOriginal) {
    await mkdirp(originalDirPath);
  }

  const promises = files.map(async (fileName) => {
    const { base } = path.parse(fileName);

    if (!isExelFile(fileName)) return;

    const result = await exelParser.parseFile(fileName);

    if (noDeleteOriginal) {
      await fs.rename(fileName, `${originalDirPath}/${base}`);
    } else {
      await fs.unlink(fileName);
    }

    const jsonFilePath = `${fileName}.json`;
    await fs.writeFile(jsonFilePath, JSON.stringify(result));
  });

  await Promise.all(promises);
  const endTime = Date.now();

  console.log(`Work done! (${(endTime - startTime) / 1000}sec)`);
}

module.exports = main;
