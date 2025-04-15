const { ClickHouseService } = require('../index.js');

const config = {
  host: 'localhost',
  port: 8123,
  database: 'default',
  username: 'default',
  token: '',
};

describe('ClickHouseService Database Tests', () => {
  let clickhouseService;

  beforeAll(() => {
    clickhouseService = new ClickHouseService(config);
  });

  test('Create table, insert data, and query data', async () => {
    const tableName = 'test_table';
    const schema = [
      { name: 'id', type: 'UInt32' },
      { name: 'name', type: 'String' },
    ];
    const data = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
    ];

    // Create table
    await clickhouseService.createTable(tableName, schema);

    // Insert data
    await clickhouseService.insertData(tableName, data);

    // Query data
    const result = await clickhouseService.previewData(tableName, ['id', 'name']);
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 1, name: 'Alice' }),
        expect.objectContaining({ id: 2, name: 'Bob' }),
      ])
    );
  });
});
