const inquirer = require('inquirer');
const fs = require('fs').promises;
const prettierJSONStringify = require('../../lib/prettier-json');

const { merge } = require('./merge-record');

async function main() {
  const { filePath } = await inquirer.prompt([
    {
      type: 'input',
      name: 'filePath',
      message: 'Please type path of duplicates.json : ',
    },
  ]);

  const content = await fs.readFile(filePath);
  const duplicates = JSON.parse(content);

  for (let index = 0; index < duplicates.length; index++) {
    const recordDatas = duplicates[index];
    const { recordType, subtype, record } = recordDatas;
    const { name } = record;

    console.log(`\n\nStart merge tool for ${name}...\n\n`);

    recordDatas.merged = await merge({
      subtype,
      name,
      type: recordType,
    });

    const jsonContent = prettierJSONStringify(
      duplicates.filter(({ merged }) => !merged),
    );

    fs.writeFile(filePath, jsonContent);
  }
}

module.exports = main;
