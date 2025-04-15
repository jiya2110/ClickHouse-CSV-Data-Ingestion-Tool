import React from 'react';

interface DataPreviewProps {
  data: any[];
  columns: string[];
}

const DataPreview: React.FC<DataPreviewProps> = ({ data, columns }) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center text-gray-400 py-8">
        No data to preview. Select columns and click "Preview" to see data.
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Data Preview</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-700 rounded-lg">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column}
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-600">
            {data.map((row, index) => (
              <tr key={index}>
                {columns.map((column) => (
                  <td key={column} className="px-6 py-4 whitespace-nowrap">
                    {row[column]?.toString() || ''}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataPreview;