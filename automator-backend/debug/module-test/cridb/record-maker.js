const CRIDB = require('../../../lib/cri/db');

CRIDB.getSecret()
  .then(async (secret) => {
    const authcode = CRIDB.createAuthcode(secret);
    const cridb = new CRIDB(authcode);
    const start = Date.now();
    const results = await Promise.all([
      cridb.recordMaker.event.general.create('Korean_War'),
      cridb.recordMaker.thing.person.create('Steve_Jobs'),
      cridb.recordMaker.thing.place.create({
        name: 'South_Korea',
        startDate: '1919-3-1',
      }),
    ]);
    const end = Date.now();
    console.log((end - start) / 1000 + ' seconds');
    console.log(results);
  })
  .catch((error) => {
    throw error;
  });
