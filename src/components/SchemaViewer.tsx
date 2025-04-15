import React, { useState, useEffect } from 'react';
import { ClickHouseService } from '../lib/clickhouse';
import { CSVService, CSVColumn } from '../lib/csv';

interface SchemaViewerProps {
  direction: 'clickhouse-to-csv' | 'csv-to-clickhouse';
  service: ClickHouseService | File;
  onSchemaSelect: (columns: string[], joinConfig?: { table: string; condition: string }) => void;
}

const SchemaViewer: React.FC<SchemaViewerProps> = ({ direction, service, onSchemaSelect }) => {
  const [tables, setTables] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [columns, setColumns] = useState<Array<{ name: string; type: string }>>([]);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [joinTable, setJoinTable] = useState<string>('');
  const [joinCondition, setJoinCondition] = useState<string>('');

  useEffect(() => {
    const loadSchema = async () => {
      if (service instanceof File) {
        const { columns } = await CSVService.parseFile(service);
        setColumns(columns);
      } else {
        const tableList = await service.getTables();
        setTables(tableList);
        if (tableList.length > 0) {
          setSelectedTable(tableList[0]);
          const schema = await service.getTableSchema(tableList[0]);
          setColumns(schema);
        }
      }
    };

    loadSchema();
  }, [service]);

  useEffect(() => {
    if (selectedTable && service instanceof ClickHouseService) {
      service.getTableSchema(selectedTable).then(setColumns);
    }
  }, [selectedTable]);

  const handleColumnToggle = (columnName: string) => {
    setSelectedColumns(prev =>
      prev.includes(columnName)
        ? prev.filter(col => col !== columnName)
        : [...prev, columnName]
    );
  };

  useEffect(() => {
    const joinConfig = joinTable && joinCondition
      ? { table: joinTable, condition: joinCondition }
      : undefined;
    onSchemaSelect(selectedColumns, joinConfig);
  }, [selectedColumns, joinTable, joinCondition]);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Schema Selection</h2>
      <div className="space-y-4">
        {service instanceof ClickHouseService && (
          <div className="bg-gray-700 rounded-lg p-4">
            <label className="block text-sm font-medium mb-2">Select Table</label>
            <select
              value={selectedTable}
              onChange={(e) => setSelectedTable(e.target.value)}
              className="w-full bg-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {tables.map(table => (
                <option key={table} value={table}>
                  {table}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="bg-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-medium mb-3">Available Columns</h3>
          <div className="space-y-2">
            {columns.map((column) => (
              <label key={column.name} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedColumns.includes(column.name)}
                  onChange={() => handleColumnToggle(column.name)}
                  className="form-checkbox h-5 w-5 text-blue-600 rounded"
                />
                <span>{column.name}</span>
                <span className="text-gray-400 text-sm">({column.type})</span>
              </label>
            ))}
          </div>
        </div>

        {direction === 'clickhouse-to-csv' && service instanceof ClickHouseService && (
          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-medium mb-3">JOIN Configuration</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  JOIN Table
                </label>
                <select
                  value={joinTable}
                  onChange={(e) => setJoinTable(e.target.value)}
                  className="w-full bg-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Select a table</option>
                  {tables.filter(t => t !== selectedTable).map(table => (
                    <option key={table} value={table}>
                      {table}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  JOIN Condition
                </label>
                <input
                  type="text"
                  value={joinCondition}
                  onChange={(e) => setJoinCondition(e.target.value)}
                  className="w-full bg-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g., users.id = orders.user_id"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SchemaViewer;