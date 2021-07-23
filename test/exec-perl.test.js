const path = require('path');
const execPerl = require('../lib/exec-perl');

it('should run perl correctly', async () => {
  const perlCodePath = path.join(__dirname, 'data/test.pl');
  const result = await execPerl(perlCodePath, 1, 2); // perl: add all numbers
  expect(parseInt(result)).toBe(3);
});
