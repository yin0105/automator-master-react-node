const FileDB = require('../lib/file-db');

jest.setTimeout(1e5);

describe('FileDB module test', () => {
  const db = new FileDB('test');

  afterAll(async () => {
    await db.destroy();
  });

  it('should save data corretly', async () => {
    const key = 'test-data';
    const testMessage = 'hello world';
    await db.write({
      key,
      value: {
        message: testMessage,
      },
    });

    const { message } = await db.read(key);
    expect(message).toBe(testMessage);
  });

  it('should save whole lot of data safely', async () => {
    const dataList = Array.from({ length: 999 }).map((_, i) => i);

    await Promise.all(
      dataList.map((e, i) => {
        return db.write({
          key: i,
          value: i,
        });
      }),
    );

    const readDatas = await Promise.all(
      dataList.map(async (e, i) => {
        const value = await db.read(i);
        const isSame = +i === +value;

        if (!isSame) {
          console.log('not same!', { value, i });
        }

        return isSame;
      }),
    );

    const result = readDatas.every((b) => b);

    expect(result).toBe(true);
  });
});
