import React from 'react';
import { PageData } from '../types';

interface ProgressBarProps {
  pageStatus: PageData;
  totalPages: number;
}

export function ProgressBar({ pageStatus, totalPages }: ProgressBarProps) {
  const memorizedPages = Object.values(pageStatus).filter(status => status === 3).length;
  const percentage = (memorizedPages / totalPages) * 100;

  return (
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
      <div
        className="bg-green-500 dark:bg-green-600 h-full transition-all duration-300 flex items-center justify-center text-xs text-white font-medium"
        style={{ width: `${percentage}%` }}
      >
        {percentage.toFixed(1)}%
      </div>
    </div>
  );
}