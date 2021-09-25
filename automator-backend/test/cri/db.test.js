const CRIDB = require('../../lib/cri/db');

jest.setTimeout(5 * 60 * 1000); // 5 minutes

const connect = CRIDB.createConnection();

describe('test CRIDB module', () => {
  console.log("describe function");
  it('should search records', async () => {
    const db = await connect;
    const records = await db.searchThing('korea');
    expect(Array.isArray(records)).toBe(true);
    expect(records.length).toBeGreaterThan(0);
  });

  it('should make a unique items of tag list', async () => {
    const db = await connect;
    const thing1 = { type: 'thing', id: 1 };
    const event1 = { type: 'event', id: 1 };
    const event2 = { type: 'event', id: 2 };
    const tags = db.uniqueTags([thing1, thing1, event1, event1, event2]);
    expect(tags).toStrictEqual([thing1, event1, event2]);
  });
});

describe('test CRIDB record maker modules', () => {
  it('should make record correctly', async () => {
    const db = await connect;
    const testPersonName = 'Steve_Jobs';
    const {
      personID,
      pictureRecordIDs,
      ...restIDs
    } = await db.recordMaker.thing.person.create(testPersonName);
    const { notes, subtype, name, status, tags } = await db.getThing(personID);

    // expect data is saved correctly.
    expect(name).toBe('Steve Jobs');
    expect(status).toBe('pending');
    expect(subtype).toBe('person');
    expect(notes).toBe(`wkpd-${testPersonName}`);

    // expect has tag.
    expect(Array.isArray(tags)).toBe(true);
    expect(tags.length).toBeGreaterThan(0);

    // expect has picture records.
    expect(Array.isArray(pictureRecordIDs)).toBe(true);
    expect(pictureRecordIDs.length).toBeGreaterThan(0);

    // expect same result if call create funtion every time.
    expect({
      personID,
      ...restIDs,
    }).toStrictEqual(await db.recordMaker.thing.person.create(testPersonName));
  });
});
