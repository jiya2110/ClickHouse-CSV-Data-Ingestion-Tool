import React, { useState } from 'react';
import { DatabaseIcon, FileSpreadsheet, ArrowLeftRight } from 'lucide-react';
import ConnectionForm from './components/ConnectionForm';
import SchemaViewer from './components/SchemaViewer';
import DataPreview from './components/DataPreview';
import ProgressBar from './components/ProgressBar';
import { ClickHouseService } from './lib/clickhouse';
import { CSVService } from './lib/csv';

type Direction = 'clickhouse-to-csv' | 'csv-to-clickhouse';

function App() {
  const [direction, setDirection] = useState<Direction>('clickhouse-to-csv');
  const [service, setService] = useState<ClickHouseService | File | null>(null);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [joinConfig, setJoinConfig] = useState<{ table: string; condition: string } | undefined>();
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [progress, setProgress] = useState(0);

  const handleConnect = (newService: ClickHouseService | File) => {
    setService(newService);
    setSelectedColumns([]);
    setPreviewData([]);
    setProgress(0);
  };

  const handleSchemaSelect = (
    columns: string[],
    newJoinConfig?: { table: string; condition: string }
  ) => {
    setSelectedColumns(columns);
    setJoinConfig(newJoinConfig);
  };

  const handlePreview = async () => {
    if (!service || selectedColumns.length === 0) return;

    try {
      if (service instanceof File) {
        const { preview } = await CSVService.parseFile(service);
        setPreviewData(preview);
      } else {
        const data = await service.previewData(
          'your_table_name',
          selectedColumns,
          joinConfig
        );
        setPreviewData(data);
      }
    } catch (error) {
      console.error('Preview failed:', error);
      // TODO: Show error message to user
    }
  };

  const handleStartIngestion = async () => {
    if (!service || selectedColumns.length === 0) return;

    try {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 500);

      if (service instanceof File) {
        // CSV to ClickHouse
        const { columns, preview } = await CSVService.parseFile(service);
        // TODO: Implement actual ingestion logic
      } else {
        // ClickHouse to CSV
        const csvData = await service.exportToCSV(
          'your_table_name',
          selectedColumns,
          joinConfig
        );
        // TODO: Implement download logic
      }
    } catch (error) {
      console.error('Ingestion failed:', error);
      // TODO: Show error message to user
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Data Ingestion Portal</h1>
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={() => setDirection('clickhouse-to-csv')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all ${
                direction === 'clickhouse-to-csv'
                  ? 'bg-blue-600 shadow-lg'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              <DatabaseIcon className="w-5 h-5" />
              <ArrowLeftRight className="w-4 h-4" />
              <FileSpreadsheet className="w-5 h-5" />
            </button>
            <button
              onClick={() => setDirection('csv-to-clickhouse')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all ${
                direction === 'csv-to-clickhouse'
                  ? 'bg-blue-600 shadow-lg'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              <FileSpreadsheet className="w-5 h-5" />
              <ArrowLeftRight className="w-4 h-4" />
              <DatabaseIcon className="w-5 h-5" />
            </button>
          </div>
        </header>

        <main className="max-w-4xl mx-auto">
          <div className="bg-gray-800 rounded-xl shadow-2xl p-6 mb-8">
            <ConnectionForm direction={direction} onConnect={handleConnect} />
          </div>

          {service && (
            <>
              <div className="bg-gray-800 rounded-xl shadow-2xl p-6 mb-8">
                <SchemaViewer
                  direction={direction}
                  service={service}
                  onSchemaSelect={handleSchemaSelect}
                />
              </div>

              <div className="bg-gray-800 rounded-xl shadow-2xl p-6 mb-8">
                <div className="flex justify-end mb-4">
                  <button
                    onClick={handlePreview}
                    className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                  >
                    Preview
                  </button>
                </div>
                <DataPreview data={previewData} columns={selectedColumns} />
              </div>

              <div className="bg-gray-800 rounded-xl shadow-2xl p-6">
                <ProgressBar progress={progress} />
                <div className="flex justify-center mt-6">
                  <button
                    onClick={handleStartIngestion}
                    disabled={selectedColumns.length === 0}
                    className={`font-bold py-3 px-8 rounded-lg transition-colors ${
                      selectedColumns.length === 0
                        ? 'bg-gray-600 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700'
                    } text-white`}
                  >
                    Start Ingestion
                  </button>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;