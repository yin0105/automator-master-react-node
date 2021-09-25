const delay = require('delay');
const globalReady = require('../lib/global-ready');

describe('test globalReady module', () => {
  it('should call step by step', async () => {
    const readyName = 'test-ready';
    const data = [];

    globalReady.add(readyName, async () => {
      data.push(1);
      await delay(150);
    });

    globalReady.add(readyName, async () => {
      await delay(150);
      data.push(2);
    });

    globalReady.add(readyName, async () => {
      await delay(150);
      data.push(3);
      await delay(150);
    });

    await globalReady.add(readyName, async () => {
      data.push(4);
      await delay(150);
    });

    expect(data).toStrictEqual([1, 2, 3, 4]);
  });
});
