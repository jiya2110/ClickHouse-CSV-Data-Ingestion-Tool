const express = require('express');
const { createClient } = require('@clickhouse/client');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

class ClickHouseService {
  constructor(config) {
    this.client = createClient({
      host: `${config.protocol || 'http'}://${config.host}:${config.port}`,
      username: config.username,
      password: config.token,
      database: config.database,
    });
  }

  async createTable(tableName, schema) {
    const columns = schema.map(col => `${col.name} ${col.type}`).join(', ');
    await this.client.query({
      query: `CREATE TABLE IF NOT EXISTS ${tableName} (${columns}) ENGINE = MergeTree() ORDER BY id`,
    });
  }

  async insertData(tableName, data) {
    await this.client.insert({
      table: tableName,
      values: data,
      format: 'JSONEachRow',
    });
  }
}

app.post('/api/connect', async (req, res) => {
  const { host, port, database, username, token, protocol = 'http' } = req.body;

  try {
    const clickhouse = createClient({
      host: `${protocol}://${host}:${port}`,
      username: username,
      password: token,
      database,
    });

    const result = await clickhouse.query({ query: 'SELECT 1' });
    await result.json();

    res.json({ success: true });
  } catch (err) {
