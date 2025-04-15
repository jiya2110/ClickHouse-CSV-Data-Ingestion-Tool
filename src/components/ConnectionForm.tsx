import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { DatabaseIcon, FileSpreadsheet } from 'lucide-react';

interface ClickHouseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  token: string;
}

interface ConnectionFormProps {
  direction: 'clickhouse-to-csv' | 'csv-to-clickhouse';
  onConnect: (config: ClickHouseConfig | File) => void;
}

const ConnectionForm: React.FC<ConnectionFormProps> = ({ direction, onConnect }) => {
  const [config, setConfig] = useState<ClickHouseConfig & { protocol?: string }>({
    host: 'localhost',
    port: 8123,
    database: 'default',
    username: 'default',
    token: '',
    protocol: 'http',
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'text/csv': ['.csv'] },
    onDrop: async ([file]) => {
      if (file) {
        onConnect(file);
      }
    },
  });

  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    try {
      const response = await fetch('http://localhost:4000/api/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      const data = await response.json();
      if (data.success) {
        alert('Connected to ClickHouse!');
        onConnect(config);
      } else {
        setErrorMessage(data.message);
      }
    } catch (err: any) {
      setErrorMessage('Error: ' + err.message);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 flex items-center">
        {direction === 'clickhouse-to-csv' ? (
          <>
            <DatabaseIcon className="w-6 h-6 mr-2" />
            ClickHouse Connection
          </>
        ) : (
          <>
            <FileSpreadsheet className="w-6 h-6 mr-2" />
            CSV Configuration
          </>
        )}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {direction === 'clickhouse-to-csv' ? (
          <>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Protocol</label>
                <select
                  value={config.protocol}
                  onChange={(e) => setConfig({ ...config, protocol: e.target.value })}
                  className="w-full bg-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="http">http</option>
                  <option value="https">https</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Host</label>
                <input
                  type="text"
                  value={config.host}
                  onChange={(e) => setConfig({ ...config, host: e.target.value })}
                  className="w-full bg-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="localhost"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Port</label>
                <input
                  type="number"
                  value={config.port}
                  onChange={(e) => setConfig({ ...config, port: parseInt(e.target.value) })}
                  className="w-full bg-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="8123"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Database</label>
                <input
                  type="text"
                  value={config.database}
                  onChange={(e) => setConfig({ ...config, database: e.target.value })}
                  className="w-full bg-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="default"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Username</label>
                <input
                  type="text"
                  value={config.username}
                  onChange={(e) => setConfig({ ...config, username: e.target.value })}
                  className="w-full bg-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="default"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">JWT Token</label>
              <input
                type="password"
                value={config.token}
                onChange={(e) => setConfig({ ...config, token: e.target.value })}
                className="w-full bg-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter your JWT token"
              />
            </div>
            {errorMessage && (
              <div className="text-red-500 mt-2 font-medium">
                {errorMessage}
              </div>
            )}
          </>
        ) : (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed ${
              isDragActive ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600'
            } rounded-lg p-8 text-center cursor-pointer transition-colors`}
          >
            <input {...getInputProps()} />
            <FileSpreadsheet className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-400 mb-4">
              {isDragActive
                ? 'Drop the CSV file here'
                : 'Drag and drop your CSV file here, or click to select'}
            </p>
          </div>
        )}

        {direction === 'clickhouse-to-csv' && (
          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
            >
              Connect
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ConnectionForm;
