import React from 'react';
import { PageData } from '../types';
import { BookOpen, BookMarked, BookCheck } from 'lucide-react';

interface StatsDashboardProps {
  pageStatus: PageData;
  totalPages: number;
}

export function StatsDashboard({ pageStatus, totalPages }: StatsDashboardProps) {
  const stats = Object.values(pageStatus).reduce(
    (acc, status) => {
      if (status === 1) acc.started++;
      else if (status === 2) acc.partial++;
      else if (status === 3) acc.memorized++;
      return acc;
    },
    { started: 0, partial: 0, memorized: 0 }
  );

  const statCards = [
    {
      label: 'Pages Started',
      value: stats.started,
      icon: BookOpen,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-100 dark:bg-amber-900/20',
    },
    {
      label: 'Partially Memorized',
      value: stats.partial,
      icon: BookMarked,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      label: 'Fully Memorized',
      value: stats.memorized,
      icon: BookCheck,
      color: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-100 dark:bg-green-900/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {statCards.map(({ label, value, icon: Icon, color, bg }) => (
        <div
          key={label}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg ${bg}`}>
              <Icon className={`w-6 h-6 ${color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {label}
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {value}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}