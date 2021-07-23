const fs = require('fs').promises;
const path = require('path');
const inquirer = require('inquirer');
const { chunkPromises } = require('chunk-promises');
const CRIDB = require('../../lib/cri/db');
const DBPedia = require('../../lib/dbpedia');
const { getFileList, isExelFile, isFileExist } = require('../../lib/util/file');

const disciplineMap = {
  history: 1,
  literature: 2,
  art: 3,
  music: 4,
  'performing arts': 5,
  philosophy: 6,
  religion: 7,
  science: 8,
  cookery: 9,
  costume: 10,
  miscellaneous: 11,
  architecture: 12,
  commerce: 13,
};

async function isPersonRecord({ name }) {
  const dbpediaRecord = await DBPedia.get(name);
  let isPerson = dbpediaRecord.find('type', ({ keyword }) => {
    return ['LivingPeople', 'Person'].includes(keyword || '');
  });

  if (!isPerson) {
    const isEthnicGroup = dbpediaRecord.find('type', ({ keyword }) => {
      return keyword === 'EthnicGroup';
    });
    const isPersonLike = dbpediaRecord.find('subject', ({ keyword }) => {
      return /people/i.test(keyword);
    });
    isPerson = isPersonLike && !isEthnicGroup;
  }

  return isPerson;
}

async function saveRecord({
  record,
  recordName,
  cridb,
  params,
  dryrun,
  recordMaker,
  status,
}) {
  let requestParameter = {};
  const { discipline, kingdom, subtype } = record;

  if (discipline) {
    const disciplineKey = recordName === 'person' ? 'articleTags' : 'tags';
    requestParameter = {
      ...requestParameter,
      [disciplineKey]: [
        {
          type: 'discipline',
          id: disciplineMap[discipline.toLowerCase()],
        },
      ],
    };
  }

  if (kingdom) {
    const { tags = [] } = requestParameter;
    const [kingdomRecord] = await cridb.searchThing(kingdom);
    if (kingdomRecord) {
      requestParameter = {
        ...requestParameter,
        tags: [...tags, kingdomRecord],
      };
    }
  }

  params.forEach((key) => {
    requestParameter = {
      ...requestParameter,
      [key]: record[key],
    };
  });

  const { url } = requestParameter;
  if (!(url && url.includes('http'))) {
    return {
      request: record,
      error: 'no url or url not contains "http".',
    };
  }

  if (!requestParameter.name) {
    requestParameter.name = url.split('/').pop();
  }

  if (recordName === 'person') {
    const isPerson = await isPersonRecord(requestParameter);
    if (!isPerson) {
      return {
        request: record,
        error: 'not a person record',
      };
    }
  }

  if (recordName === 'pictures' && subtype === 'map') {
    return {
      request: record,
      error: 'it is map reocord',
    };
  }

  if (dryrun) {
    return {
      status,
      dryrun,
      ...requestParameter,
    };
  } else {
    let response;

    try {
      response = await recordMaker.create({
        status,
        ...requestParameter,
      });
    } catch (error) {
      response = {
        error: error.toString(),
      };
    }

    return {
      request: record,
      response,
    };
  }
}

async function requestSaveData({
  cridb,
  status,
  dryrun,
  recordMaker,
  recordName,
  params,
  records,
}) {
  params = ['url', ...params];
  const promiseGets = records.map((record) => () => {
    let result;

    try {
      result = saveRecord({
        record,
        recordName,
        cridb,
        params,
        dryrun,
        recordMaker,
        status,
      });
    } catch (error) {
      result = {
        error: error.toString(),
      };
    }

    if (result.then) {
      result
        .then((result) => {
          if (result.error) throw Error(result.error);
          if (result.response && result.response.error) {
            throw Error(result.response.error);
          }
          console.log('Import success: ', { record, result }, '\n');
        })
        .catch((error) => {
          console.log(
            'Import fail: ',
            { record, error: error.toString() },
            '\n',
          );
        });
    } else {
      console.log('Import fail: ', { record, result }, '\n');
    }

    return result;
  });

  return await chunkPromises(promiseGets, 3);
}

async function importRecords({ cridb, data, dryrun }) {
  const { recordMaker } = cridb;
  const result = {};
  const map = {
    person: {
      recordMaker: recordMaker.thing.person,
    },
    place: {
      recordMaker: recordMaker.thing.place,
      params: ['startDate'],
    },
    event: {
      recordMaker: recordMaker.event.general,
    },
    text: {
      recordMaker: recordMaker.medium.article,
    },
    pictures: {
      recordMaker: recordMaker.medium.picture,
      params: ['name', 'date', 'content'],
    },
  };

  for (const recordName in data) {
    const { recordMaker, params = [] } = map[recordName];
    result[recordName] = await requestSaveData({
      cridb,
      dryrun,
      recordMaker,
      params,
      records: data[recordName] || [],
    });
  }

  return result;
}

async function main() {
  const { filePath, resultPath, dryrun } = await inquirer.prompt([
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
    {
      type: 'confirm',
      name: 'dryrun',
      message: 'Is it dryrun? :',
    },
  ]);

  const files = await getFileList(filePath);
  const secret = await CRIDB.getSecret();
  const authcode = CRIDB.createAuthcode(secret);
  const cridb = new CRIDB(authcode);

  for (let index = 0; index < files.length; index++) {
    const fileName = files[index];
    const base = path.basename(fileName);
    const resultFileName = `${resultPath}/${base}.result.json`;

    if (/\.DS_Store/i.test(fileName)) continue;

    if (await isFileExist(resultFileName)) {
      console.log(`${resultFileName}\n`);
      continue;
    }

    let data, result;

    if (isExelFile(fileName)) {
      data = await CRIDB.exelParser.parseFile(fileName);
    } else {
      data = await fs.readFile(fileName, 'utf8');
      try {
        data = JSON.parse(data);
      } catch (error) {
        console.log({ fileName, error });
        break;
      }
    }

    try {
      result = await importRecords({ data, cridb, dryrun });
    } catch (error) {
      result = { error: error.toString() };
    }

    fs.writeFile(resultFileName, JSON.stringify(result));
  }
}

module.exports = main;
module.exports.importRecords = importRecords;
