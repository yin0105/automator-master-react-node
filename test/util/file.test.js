const path = require('path');
const FileUtil = require('../../lib/util/file');

describe('test file utils', () => {
  it('should get list of files correctly', async () => {
    const list = await FileUtil.getFileList(path.join(__dirname, '../'));
    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBeGreaterThan(1);
  });

  it('should return true if file is an exel', async () => {
    const isExelFile = await FileUtil.isExelFile(
      path.join(__dirname, '../data/test-data.xlsx'),
    );
    expect(isExelFile).toBe(true);
  });

  it('should return false if file is not an exel', async () => {
    const isExelFile = await FileUtil.isExelFile(
      path.join(__dirname, '../data/test.pl'),
    );
    expect(isExelFile).toBe(false);
  });

  it('should return true if file is exist', async () => {
    const isExist = await FileUtil.isFileExist(__filename);
    expect(isExist).toBe(true);
  });

  it('should return false if file is not exist', async () => {
    const isExist = await FileUtil.isFileExist(__filename + 'HelloWorld');
    expect(isExist).toBe(false);
  });
});
