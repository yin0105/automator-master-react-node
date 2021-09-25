const fs = require('fs').promises;
const inquirer = require('inquirer');
const CRIDB = require('../../lib/cri/db');
const prettierJSONStringify = require('../../lib/prettier-json');
const { getFileList } = require('../../lib/util/file');
const { importRecords } = require('./import-records');

async function main() {
  const { filePath } = await inquirer.prompt([
    {
      type: 'input',
      name: 'filePath',
      message: 'Please enter file path of result.json :',
    },
  ]);
  const cridb = await CRIDB.createConnection();
  const resultFileList = await getFileList(filePath);
  const resultList = await Promise.all(
    resultFileList.map((filePath) => fs.readFile(filePath, 'utf8')),
  );

  for (let index = 0; index < resultList.length; index++) {
    const result = JSON.parse(resultList[index]);
    for (const recordType in result) {
      let updated = false;
      const records = result[recordType] || [];
      const promises = records.map(async (record) => {
        const { request = {}, response = {} } = record;
        const { error } = response;
        record.retry = record.retry || [];

        if (error && record.retry.every(({ error }) => !!error)) {
          const {
            [recordType]: [reImportRecord = {}],
          } = await importRecords({
            cridb,
            data: {
              [recordType]: [request],
            },
          });

          const { response: newResponse = {} } = reImportRecord;
          const { error: newError } = newResponse;

          if (newError) {
            record.retry.push({ error: newError });
          } else {
            record.retry.push({ response: newResponse });
          }
        }

        updated = updated || !!record.retry.length;
      });

      await Promise.all(promises);

      if (updated) {
        const resultPath = resultFileList[index];
        const jsonContent = prettierJSONStringify(result);
        await fs.writeFile(resultPath, jsonContent);
      }
    }

    const workProgress = (100 * index) / (resultList.length - 1);
    console.log(
      `re-import work in process... ${workProgress.toFixed(2)}% done.`,
    );
  }
}

module.exports = main;
