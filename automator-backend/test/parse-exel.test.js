const path = require('path');
const { parseFile } = require('../lib/xlsx');

const exelPath = path.join(__dirname, 'data/test-data.xlsx');

it('Test Xlsx.parseFile(lib/xlsx)', async () => {
  const parsedExel = await parseFile(exelPath);
  expect(parsedExel).toStrictEqual({
    시트1: [
      ['1', '2', '3', '4', '5'],
      ['6', '7', '8', '9', '10'],
    ],
  });
});
