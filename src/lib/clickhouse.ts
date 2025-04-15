import { createClient } from '@clickhouse/client';

export interface ClickHouseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  token: string;
}

export class ClickHouseService {
  private client;

  constructor(config: ClickHouseConfig) {
    this.client = createClient({
      host: `http://${config.host}:${config.port}`,
      database: config.database,
      username: config.username,
      password: config.token,
    });
  }

  async getTables(): Promise<string[]> {
    const result = await this.client.query({
      query: 'SHOW TABLES',
      format: 'JSONEachRow',
    });
    const tables = await result.json();
    return tables.map((table: any) => table.name);
  }

  async getTableSchema(table: string): Promise<Array<{ name: string; type: string }>> {
    const result = await this.client.query({
      query: `DESCRIBE TABLE ${table}`,
      format: 'JSONEachRow',
    });
    return result.json();
  }

  async previewData(table: string, columns: string[], joinConfig?: { table: string; condition: string }) {
    let query = `SELECT ${columns.join(', ')} FROM ${table}`;
    if (joinConfig) {
      query += ` JOIN ${joinConfig.table} ON ${joinConfig.condition}`;
    }
    query += ' LIMIT 100';

    const result = await this.client.query({
      query,
      format: 'JSONEachRow',
    });
    return result.json();
  }

  async exportToCSV(table: string, columns: string[], joinConfig?: { table: string; condition: string }) {
    let query = `SELECT ${columns.join(', ')} FROM ${table}`;
    if (joinConfig) {
      query += ` JOIN ${joinConfig.table} ON ${joinConfig.condition}`;
    }

    const result = await this.client.query({
      query,
      format: 'CSV',
    });
    return result.text();
  }

  async createTable(tableName: string, schema: Array<{ name: string; type: string }>) {
    const columns = schema.map(col => `${col.name} ${col.type}`).join(', ');
    await this.client.query({
      query: `CREATE TABLE IF NOT EXISTS ${tableName} (${columns}) ENGINE = MergeTree() ORDER BY tuple()`,
    });
  }

  async insertData(tableName: string, data: any[]) {
    await this.client.insert({
      table: tableName,
      values: data,
      format: 'JSONEachRow',
    });
  }
}