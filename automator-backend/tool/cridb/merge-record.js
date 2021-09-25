const inquirer = require('inquirer');
const escapeStringRegexp = require('escape-string-regexp');
const CRIDB = require('../../lib/cri/db');

async function autoMerge(
  { records, cridb },
  { type: recordType, name: recordName },
) {
  const isSameName = new RegExp(`^(wkpd-)?${escapeStringRegexp(recordName)}$`);
  let targets = [];
  for (let index = 0; index < records.length; index++) {
    const { id } = records[index];
    const recordOnDB = await cridb.get(recordType, id);
    const isSameRecord = ['name', 'nickname'].some((key) => {
      if (key in recordOnDB) {
        return isSameName.test(recordOnDB[key]);
      } else {
        return false;
      }
    });

    if (isSameRecord) {
      targets.push(recordOnDB);
    }
  }

  if (targets.length < 2) return false;

  targets = targets.sort((aRecord, bRecord) => {
    const [aContainWkpdTag, bContainWkpdTag] = [aRecord, bRecord].map(
      (record) => {
        return ['name', 'nickname', 'notes'].some((key) => {
          return record[key] && /^wkpd-/i.test(record[key]);
        });
      },
    );

    if (aContainWkpdTag) return -1;
    if (bContainWkpdTag) return 1;

    return bRecord.id - aRecord.id;
  });

  const masterRecord = targets.shift();
  console.log('start auto merge...');
  console.log({ masterRecord, targets });
  await cridb.merge(recordType, [
    masterRecord.id,
    ...targets.map(({ id }) => id),
  ]);
  console.log('merge sucess!');
  return true;
}

async function merge(record) {
  const secret = await CRIDB.getSecret();
  const authcode = CRIDB.createAuthcode(secret);
  const cridb = new CRIDB(authcode);
  const records = (await cridb.search(record.type, record.name)).filter(
    (recordOnDB) => recordOnDB.subtype === record.subtype,
  );

  console.log(records);

  if (!records || records.length < 2) {
    return console.log(`Not enough record: ${record.name}`);
  }

  if (await autoMerge({ records, cridb }, record)) {
    return true;
  }

  const { masterRecordID } = await inquirer.prompt([
    {
      type: 'list',
      name: 'masterRecordID',
      message: 'Which is master record? :',
      choices: records.map(({ id }) => id),
    },
  ]);

  const { targets } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'targets',
      message: 'Please select target records :',
      choices: records
        .map(({ id }) => id)
        .filter((id) => id !== masterRecordID),
    },
  ]);

  if (!targets.length) {
    console.log('No targets.');
    return false;
  }

  console.log('start merge...');
  await cridb.merge(record.type, [masterRecordID, ...targets]);
  console.log('merge sucess!');
  return true;
}

async function main() {
  let record = await inquirer.prompt([
    {
      type: 'list',
      name: 'type',
      message: 'Please enter record type :',
      choices: ['thing', 'event', 'medium'],
    },
  ]);

  record = {
    ...record,
    ...(await inquirer.prompt([
      {
        type: 'list',
        name: 'subtype',
        message: 'Please enter record subtype :',
        choices: {
          thing: ['person', 'place', 'artefact'],
          event: ['event', 'birth', 'death', 'start', 'end', 'reign', 'fl'],
          medium: ['article', 'audio', 'map', 'picture', 'subsection', 'video'],
        }[record.type],
      },
      {
        type: 'input',
        name: 'name',
        message: 'Please enter the name of the record :',
      },
    ])),
  };

  await merge(record);
}

module.exports = main;
module.exports.merge = merge;
