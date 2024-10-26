import React from 'react';
import { PageData } from '../types';
import { Calendar, Clock } from 'lucide-react';
import { format, isToday, isTomorrow, isThisWeek } from 'date-fns';

interface ReviewStatsProps {
  pageStatus: PageData;
}

export function ReviewStats({ pageStatus }: ReviewStatsProps) {
  const now = new Date();
  const reviewPages = Object.entries(pageStatus).reduce((acc, [page, data]) => {
    if (data.nextReview) {
      const reviewDate = new Date(data.nextReview);
      if (reviewDate <= now) {
        acc.overdue.push(parseInt(page));
      } else if (isToday(reviewDate)) {
        acc.today.push(parseInt(page));
      } else if (isTomorrow(reviewDate)) {
        acc.tomorrow.push(parseInt(page));
      } else if (isThisWeek(reviewDate)) {
        acc.thisWeek.push(parseInt(page));
      }
    }
    return acc;
  }, {
    overdue: [] as number[],
    today: [] as number[],
    tomorrow: [] as number[],
    thisWeek: [] as number[],
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <Calendar className="w-5 h-5 text-indigo-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Review Schedule
        </h3>
      </div>

      <div className="space-y-4">
        {reviewPages.overdue.length > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-red-500">Overdue</span>
            <span className="text-sm text-red-500">{reviewPages.overdue.length} pages</span>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Today</span>
          <span className="text-sm text-gray-900 dark:text-white">{reviewPages.today.length} pages</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Tomorrow</span>
          <span className="text-sm text-gray-900 dark:text-white">{reviewPages.tomorrow.length} pages</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">This Week</span>
          <span className="text-sm text-gray-900 dark:text-white">{reviewPages.thisWeek.length} pages</span>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Alt+click on memorized pages to mark them as reviewed
          </p>
        </div>
      </div>
    </div>
  );
}