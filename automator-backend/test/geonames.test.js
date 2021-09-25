const GeoNames = require('../lib/geonames');

describe('test GeoNames module', () => {
  it('should get search data correctly', async () => {
    const record = await GeoNames.search('Seoul');
    expect(record).toBeInstanceOf(Array);
    expect(record.length).toBeGreaterThan(0);
  });

  it('should get id of place correctly', async () => {
    const id = await GeoNames.getID('Seoul');
    expect(id).toBeGreaterThan(0);
  });

  it('should get hierarchy list of place correctly', async () => {
    const list = await GeoNames.getHierarchy('Seoul');
    expect(list).toBeInstanceOf(Array);
    expect(list.length).toBeGreaterThan(0);
  });
});
