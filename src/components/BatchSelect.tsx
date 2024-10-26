import React, { useState } from 'react';
import { PageStatus, STATUS_LABELS } from '../types';

interface BatchSelectProps {
  onBatchUpdate: (startPage: number, endPage: number, status: PageStatus) => void;
}

export function BatchSelect({ onBatchUpdate }: BatchSelectProps) {
  const [startPage, setStartPage] = useState('');
  const [endPage, setEndPage] = useState('');
  const [status, setStatus] = useState<PageStatus>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const start = parseInt(startPage);
    const end = parseInt(endPage);
    
    if (start > 0 && end > 0 && start <= 604 && end <= 604 && start <= end) {
      onBatchUpdate(start, end, status);
      setStartPage('');
      setEndPage('');
    } else {
      alert('Please enter valid page numbers (1-604) with start page less than or equal to end page');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Batch Update Pages
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-[1fr,1fr,2fr,auto] gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Start Page
          </label>
          <input
            type="number"
            min="1"
            max="604"
            value={startPage}
            onChange={(e) => setStartPage(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            End Page
          </label>
          <input
            type="number"
            min="1"
            max="604"
            value={endPage}
            onChange={(e) => setEndPage(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(parseInt(e.target.value) as PageStatus)}
            className="w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent"
          >
            {(Object.entries(STATUS_LABELS) as [string, string][]).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors"
        >
          Update
        </button>
      </div>
    </form>
  );
}