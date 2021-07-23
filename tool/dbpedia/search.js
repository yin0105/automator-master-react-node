const DBPedia = require('../../lib/dbpedia');
const inquirer = require('inquirer');

(async () => {
  const { keyword } = await inquirer.prompt([
    {
      type: 'input',
      name: 'keyword',
      message: 'Please type name of DBPedia record :',
    },
  ]);

  console.log('Get data from DBPedia server...');

  let data;
  try {
    ({ data } = await DBPedia.get(keyword));
  } catch (error) {
    console.log('Request fail!');
    console.error(error);
    return;
  }

  while (typeof data === 'object') {
    let key;
    const promptProps = {
      type: 'list',
      name: 'key',
    };

    if (Array.isArray(data)) {
      ({ key } = await inquirer.prompt([
        {
          ...promptProps,
          message: 'Select element of array :',
          choices: data.map(
            (element, index) => `${index} : ${JSON.stringify(element)}`,
          ),
        },
      ]));
      key = key.split(':')[0].trim();
    } else {
      ({ key } = await inquirer.prompt([
        {
          ...promptProps,
          message: 'Select key :',
          choices: Object.keys(data),
        },
      ]));
    }

    data = data[key];
  }

  console.log('\n', data, '\n');
})().catch(function(error) {
  throw error;
});
