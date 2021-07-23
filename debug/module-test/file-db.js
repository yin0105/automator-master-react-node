const FileDB = require('../../lib/file-db');

(async () => {
  const db = new FileDB('test');
  const key = 'test-data';
  await db.write({
    key,
    value: {
      message: 'hello world',
    },
  });

  const { message } = await db.read(key);
  console.log(message);
})();
