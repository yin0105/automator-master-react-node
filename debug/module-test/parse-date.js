const parseDate = require('../../lib/date-parser');

[
  '2020-05-20',
  '538 BC',
  '538 - 273 BC',
  '900-1 BC',
  'ca. 100 - ',
  'ca. 100 BC - 870 AD',
  '100;2000',
  '1555-1859/1874/1895',
  'ca. before 1828',
  '1960/1963',
  '24 June 1821 - October 26, 1998',
  '40,000 BC',
  'until 1972',
].forEach((date) => {
  console.log(parseDate(date));
});
