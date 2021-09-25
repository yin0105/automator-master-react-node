const fs = require('fs').promises;
const inquirer = require('inquirer');
const CRIDB = require('../../lib/cri/db');

const confirmData = {
  async get() {
    const { id } = await inquirer.prompt([
      {
        type: 'number',
        name: 'id',
        message: 'Please type ID of record which you want get : ',
      },
    ]);
    return id;
  },

  async getTags() {
    const { id } = await inquirer.prompt([
      {
        type: 'number',
        name: 'id',
        message: 'Please type ID of tags of record which you want get : ',
      },
    ]);
    return id;
  },

  async delete() {
    const { id } = await inquirer.prompt([
      {
        type: 'number',
        name: 'id',
        message: 'Please type ID of record which you want delete : ',
      },
    ]);
    return id;
  },

  async search() {
    const { keyword } = await inquirer.prompt([
      {
        type: 'input',
        name: 'keyword',
        message: 'Please type keyword of record which you want search : ',
      },
    ]);
    return keyword;
  },

  async save(recordType) {
    let { subtype, status, id = 0, name, datas } = await inquirer.prompt([
      {
        type: 'list',
        name: 'subtype',
        message: 'Please select subtype : ',
        choices: {
          thing: ['person', 'place', 'artefact'],
          event: ['event', 'birth', 'death', 'start', 'end', 'reign', 'fl'],
          medium: ['article', 'audio', 'map', 'picture', 'subsection', 'video'],
        }[recordType],
      },
      {
        type: 'list',
        name: 'status',
        message: 'Please select status : ',
        choices: ['online', 'offline', 'pending'],
      },
      {
        type: 'number',
        name: 'id',
        message:
          "Please type ID of record (If you want create new record, type '0') : ",
      },
      {
        type: 'input',
        name: 'name',
        message: 'Please type name of record : ',
      },
      {
        type: 'editor',
        name: 'datas',
        message: 'Please type rest datas as JSON format : ',
      },
    ]);

    id = id || null;
    return {
      id,
      data: {
        subtype,
        status,
        name,
        ...JSON.parse(datas),
      },
    };
  },

  async merge() {
    const targets = [];
    const { masterRecordID } = await inquirer.prompt([
      {
        type: 'input',
        name: 'masterRecordID',
        message:
          'Please type ID of record which you want merge as master record. : ',
      },
    ]);

    async function askID() {
      const { targetRecordID } = await inquirer.prompt([
        {
          type: 'input',
          name: 'targetRecordID',
          message:
            'Please type ID of record which you want merge as target record. The target records will be deleted. ' +
            'To stop adding target records, press Enter without entering anything. : ',
        },
      ]);

      if (targetRecordID) targets.push(targetRecordID);

      return targetRecordID;
    }

    while (await askID());

    return [masterRecordID, ...targets];
  },
};

async function main() {
  const { command, recordType } = await inquirer.prompt([
    {
      type: 'list',
      name: 'command',
      message: 'Please select command type : ',
      choices: ['get', 'getTags', 'search', 'save', 'delete', 'merge'],
    },
    {
      type: 'list',
      name: 'recordType',
      message: 'Please select record type : ',
      choices: ['thing', 'event', 'medium'],
    },
  ]);
  const requestData = await confirmData[command](recordType);
  const cridb = await CRIDB.createConnection();
  // console.log(cridb);
  // console.log("command =>", command);
  // console.log("recordType =>", recordType);
  // console.log("requestData =>", requestData);
  // console.log("cridb[command] =>", cridb[command]);

  try {
    console.log('Start request...\n\n');
    const result = await cridb[command](recordType, requestData);
    console.log({ result });
  } catch (error) {
    console.log(error);    
  }

  const { wantSave } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'wantSave',
      message: 'Request success! Do you want save result as JSON?',
    },
  ]);

  if (wantSave) {
    const { filePath } = await inquirer.prompt([
      {
        type: 'input',
        name: 'filePath',
        message: 'Please type path of file: ',
      },
    ]);

    console.log('Starting write JSON file...');
    await fs.writeFile(filePath, JSON.stringify(result));
    console.log(`JSON file is successfully saved at ${filePath}`);
  }
}

module.exports = main;
