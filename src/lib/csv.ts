import Papa from 'papaparse';

export interface CSVColumn {
  name: string;
  type: string;
  sample: string;
}

export class CSVService {
  static async parseFile(file: File): Promise<{
    columns: CSVColumn[];
    preview: any[];
  }> {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        preview: 100,
        complete: (results) => {
          const preview = results.data;
          const columns = Object.keys(preview[0]).map(name => ({
            name,
            type: this.inferClickHouseType(preview.map(row => row[name])),
            sample: preview[0][name],
          }));

          resolve({ columns, preview });
        },
        error: (error) => reject(error),
      });
    });
  }

  static inferClickHouseType(values: any[]): string {
    const sample = values.find(v => v !== null && v !== undefined);
    if (!sample) return 'String';

    if (!isNaN(sample) && !isNaN(parseFloat(sample))) {
      const isInteger = values.every(v => v === null || v === undefined || Number.isInteger(parseFloat(v)));
      return isInteger ? 'Int64' : 'Float64';
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    const timestampRegex = /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}:\d{2}/;

    if (values.every(v => v === null || v === undefined || timestampRegex.test(v))) {
      return 'DateTime';
    }

    if (values.every(v => v === null || v === undefined || dateRegex.test(v))) {
      return 'Date';
    }

    return 'String';
  }

  static async exportToCSV(data: any[], columns: string[]): Promise<string> {
    const csv = Papa.unparse(data.map(row => {
      const newRow: any = {};
      columns.forEach(col => {
        newRow[col] = row[col];
      });
      return newRow;
    }));
    return csv;
  }
}