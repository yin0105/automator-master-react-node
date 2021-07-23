const SmallestPlacePicker = require('../lib/smallest-place-picker');

jest.setTimeout(1e7);

describe('Smallest place picker module test', () => {
  it('should pick smallest place correctly', async () => {
    const smallestPlaceName = await SmallestPlacePicker.pick([
      'Seoul',
      'Earth',
      'Asia',
      'Itaewon',
    ]);

    expect(smallestPlaceName).toBe('Itaewon');
  });
});
