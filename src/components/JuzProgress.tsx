import React from 'react';
import { PageData, JUZ_INFO } from '../types';
import { ChevronRight } from 'lucide-react';

interface JuzProgressProps {
  pageStatus: PageData;
  onJuzClick: (startPage: number) => void;
}

export function JuzProgress({ pageStatus, onJuzClick }: JuzProgressProps) {
  const calculateJuzProgress = (startPage: number, endPage: number) => {
    let memorized = 0;
    for (let page = startPage; page <= endPage; page++) {
      if (pageStatus[page] === 3) memorized++;
    }
    return memorized / (endPage - startPage + 1);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {Object.entries(JUZ_INFO).map(([juz, info]) => {
        const progress = calculateJuzProgress(info.start, info.end);
        
        return (
          <button
            key={juz}
            onClick={() => onJuzClick(info.start)}
            className="relative bg-white dark:bg-gray-800 rounded-lg p-4 text-left border border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors group"
          >
            <div 
              className="absolute inset-0 bg-green-500 dark:bg-green-600 opacity-10 rounded-lg transition-all duration-300" 
              style={{ width: `${progress * 100}%` }} 
            />
            <div className="flex justify-between items-start relative">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Juz' {juz}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{info.name}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-500 transition-colors" />
            </div>
            <div className="mt-2 flex justify-between items-center relative">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Pages {info.start}-{info.end}
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {(progress * 100).toFixed(0)}%
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}