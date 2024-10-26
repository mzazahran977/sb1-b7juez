import React from 'react';
import { FilterType, STATUS_LABELS } from '../types';

interface FilterButtonsProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export function FilterButtons({ activeFilter, onFilterChange }: FilterButtonsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onFilterChange('all')}
        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
          ${activeFilter === 'all'
            ? 'bg-indigo-500 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
          }`}
      >
        All Pages
      </button>
      {(Object.entries(STATUS_LABELS) as [FilterType, string][]).map(([status, label]) => (
        <button
          key={status}
          onClick={() => onFilterChange(status)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
            ${activeFilter === status
              ? 'bg-indigo-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
            }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}