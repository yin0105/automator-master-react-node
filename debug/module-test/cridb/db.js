const CRIDB = require('../../../lib/cri/db');

CRIDB.getSecret()
  .then(async (secret) => {
    const authcode = CRIDB.createAuthcode(secret);
    const cridb = new CRIDB(authcode);
    const record = await cridb.getEvent(56535);
    console.log(record);
  })
  .catch((error) => {
    throw error;
  });
