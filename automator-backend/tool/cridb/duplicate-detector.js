const fs = require('fs').promises;
const inquirer = require('inquirer');
const CRIDB = require('../../lib/cri/db');
const { getFileList } = require('../../lib/util/file');
const { tabWidth } = require('../../.prettierrc');

function getSubtype(type) {
  const map = {
    pictures: 'picture',
    text: 'article',
  };
  if (['person', 'place', 'event', 'map', 'artefact'].includes(type)) {
    return type;
  } else if (map[type]) {
    return map[type];
  }
}

function getRecordType(type) {
  const map = {
    event: ['event'],
    thing: ['person', 'place'],
    medium: ['pictures', 'artefact', 'text'],
  };

  for (const recordType in map) {
    if (map[recordType].includes(type)) {
      return recordType;
    }
  }
}

async function checkDuplicatedFromFile(cridb, filePath) {
  const fileExtension = filePath.split('.').pop();
  const isExel = ['xlsx', 'xls'].includes(fileExtension);
  const isJSON = fileExtension === 'json';
  const duplicateRecords = [];
  let data;

  if (isExel) {
    data = await CRIDB.exelParser.parseFile(filePath);
  } else if (isJSON) {
    data = JSON.parse(await fs.readFile(filePath, 'utf8'));
  } else {
    throw Error('file is not exel or json!');
  }

  console.log(`\nStart checking ${filePath}...`);

  for (const key in data) {
    const records = data[key];
    const recordType = getRecordType(key);
    const subtype = getSubtype(key);
    const promises = records.map(async (record) => {
      let { url, name } = record;

      url = String(url);
      if (!url.includes('http')) return;
      if (!name) {
        name = url.split('/').pop();
        if (!name) return;
      }

      const duplicated = await cridb.duplicateDetector.checkDuplicated({
        name,
        recordType,
        subtype,
      });

      if (duplicated) {
        duplicateRecords.push({
          recordType,
          subtype,
          record: {
            name,
            ...record,
          },
        });
      }
    });

    if (promises.length) {
      console.log(`DONE : ${filePath} => ${key}`);
      await Promise.all(promises);
    }
  }

  if (duplicateRecords.length) {
    console.log(`${duplicateRecords.length} of duplicate detected.`);
  } else {
    console.log('duplicate not detected.');
  }

  return duplicateRecords;
}

async function main() {
  const { filePath, resultPath } = await inquirer.prompt([
    {
      type: 'input',
      name: 'filePath',
      message: 'Please enter file path of Exel or JSON :',
    },
    {
      type: 'input',
      name: 'resultPath',
      message: 'Please enter the file path of the results will be saved :',
    },
  ]);

  const files = await getFileList(filePath);
  const secret = await CRIDB.getSecret();
  const authcode = CRIDB.createAuthcode(secret);
  const cridb = new CRIDB(authcode);

  // test write result file
  await fs.writeFile(
    resultPath,
    JSON.stringify({
      message: 'datas in process...',
    }),
  );

  const results = [];
  for (let index = 0; index < files.length; index++) {
    const filePath = files[index];
    try {
      const duplicateRecords = await checkDuplicatedFromFile(cridb, filePath);
      results.push(...duplicateRecords);
    } catch (error) {
      results.push({
        filePath,
        error: error.toString(),
      });
      console.log(error);
    }
  }

  if (results.length) {
    console.log(`${results.length} of duplicate detected. `);
  } else {
    console.log('there is no duplicate!');
  }

  await fs.writeFile(resultPath, JSON.stringify(results, null, tabWidth));
}

module.exports = main;
