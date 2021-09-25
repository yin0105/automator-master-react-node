require('axios-debug-log');
const inquirer = require('inquirer');
const modules = {
  'duplicate-detector': require('./duplicate-detector'),
  'exel-to-json': require('./exel-to-json'),
  'import-records': require('./import-records'),
  'merge-record': require('./merge-record'),
  'duplicate-handler': require('./duplicate-handler'),
  'error-re-import': require('./error-re-import'),
  request: require('./request'),
};

inquirer
  .prompt([
    {
      type: 'list',
      name: 'codeName',
      message: 'Which code do you want run? :',
      choices: Object.keys(modules),
    },
  ])
  .then(({ codeName }) => {
    modules[codeName]();
  });
