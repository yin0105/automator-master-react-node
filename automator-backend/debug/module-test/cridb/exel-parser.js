const CRIDBExelParser = require('../../../lib/cri/exel-parser');
const exelFilePath = __dirname + '/test.xlsx';

CRIDBExelParser.parseFile(exelFilePath).then(console.log);
