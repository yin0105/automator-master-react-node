const DBPedia = require('../lib/dbpedia');

jest.setTimeout(1e7);

describe('DBPedia module test', () => {
  it('should get DBPedia record correctly', async () => {
    const dbpediaRecord = await DBPedia.get('Korea');
    expect(dbpediaRecord).toBeInstanceOf(DBPedia);
    expect(dbpediaRecord.find('name')).toBeInstanceOf(Array);
  });
});
