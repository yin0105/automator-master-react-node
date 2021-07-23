const Wikipedia = require('../lib/wikipedia');

jest.setTimeout(1e7);

describe('Wikipedia module test', () => {
  it('should get realname correctly', async () => {
    const realname = await Wikipedia.getRealName('Steve_Jobs');
    expect(realname).toBe('Steve Jobs');
  });

  it('should get media list', async () => {
    const { items } = await Wikipedia.getMedia('Steve_Jobs');
    expect(items).toBeInstanceOf(Array);
    expect(items.length).toBeGreaterThan(0);
  });

  it('should get event date correctly', async () => {
    const date = await Wikipedia.getEventDate('Korean_War');
    expect(date.replace(/\s/g, '')).toEqual('25/6/1950-27/7/1953');
  });
});
