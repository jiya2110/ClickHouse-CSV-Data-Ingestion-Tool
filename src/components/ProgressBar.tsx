import React from 'react';

interface ProgressBarProps {
  progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Ingestion Progress</h2>
      <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
        <div
          className="bg-blue-600 h-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="text-center mt-2">{progress}% Complete</div>
    </div>
  );
};

export default ProgressBar;