const DBPedia = require('../../lib/dbpedia');

DBPedia.get('Steve_Jobs').then((record) => {
  const realname = record.find(
    ['name', 'label'],
    (o) => o.lang === 'en',
    'value',
  );
  console.log(realname);
});
