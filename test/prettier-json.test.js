const prettierJSONStringify = require('../lib/prettier-json');

it('should prettier json correctly', () => {
  const testData = {
    a: 1,
    b: 2,
  };

  const normalJSON = JSON.stringify(testData);
  const prettyJSON = prettierJSONStringify(testData);

  expect(normalJSON).not.toBe(prettyJSON);
  expect(JSON.parse(normalJSON)).toStrictEqual(JSON.parse(prettyJSON));
  expect(JSON.parse(prettyJSON)).toStrictEqual(testData);
  expect(normalJSON.length).toBeLessThan(prettyJSON.length);
});
