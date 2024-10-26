import React, { useState } from 'react';
import { format } from 'date-fns';
import { FilterType, PageData, PageStatus, getNextReviewDate } from '../types';
import { Calendar } from 'lucide-react';

interface PageGridProps {
  pageStatus: PageData;
  activeFilter: FilterType;
  onPageClick: (page: number, status?: PageStatus, percentage?: number, isReview?: boolean) => void;
  selectedPage: number | null;
  isSelecting: boolean;
  selectedPages: Set<number>;
}

export function PageGrid({ 
  pageStatus, 
  activeFilter, 
  onPageClick, 
  selectedPage,
  isSelecting,
  selectedPages
}: PageGridProps) {
  const [showPercentageInput, setShowPercentageInput] = useState<number | null>(null);
  const [percentageValue, setPercentageValue] = useState(50);

  const shouldShowPage = (page: number) => {
    const data = pageStatus[page];
    if (!data) return activeFilter === 'all' || activeFilter === '0';
    if (activeFilter === 'review') {
      return data.nextReview && new Date(data.nextReview) <= new Date();
    }
    return activeFilter === 'all' || data.status.toString() === activeFilter;
  };

  const handlePageClick = (page: number, e: React.MouseEvent) => {
    if (isSelecting) {
      onPageClick(page);
      return;
    }

    if (e.shiftKey) {
      setShowPercentageInput(page);
    } else if (e.altKey && pageStatus[page]?.status === 3) {
      onPageClick(page, undefined, undefined, true);
    } else {
      const currentData = pageStatus[page] || { status: 0, percentage: 0 };
      const newStatus = ((currentData.status + 1) % 4) as PageStatus;
      const newPercentage = newStatus === 3 ? 100 : newStatus === 0 ? 0 : currentData.percentage || 0;
      onPageClick(page, newStatus, newPercentage);
    }
  };

  const handlePercentageSubmit = (page: number) => {
    onPageClick(page, undefined, percentageValue);
    setShowPercentageInput(null);
    setPercentageValue(50);
  };

  const getPageStyle = (page: number) => {
    const data = pageStatus[page];
    if (!data) return {};

    const baseColor = data.status === 1 ? [255, 183, 77] : // Amber
                     data.status === 2 ? [100, 181, 246] : // Blue
                     data.status === 3 ? [129, 199, 132] : // Green
                     [224, 224, 224]; // Gray

    const opacity = data.percentage / 100;
    const rgb = baseColor.map(c => Math.round(c * opacity + 224 * (1 - opacity)));
    
    return {
      backgroundColor: `rgb(${rgb.join(',')})`,
    };
  };

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(3rem,1fr))] gap-2">
      {Array.from({ length: 604 }, (_, i) => i + 1).map(page => {
        if (!shouldShowPage(page)) return null;

        const data = pageStatus[page];
        const isSelected = selectedPage === page || selectedPages.has(page);
        const isPercentageInputVisible = showPercentageInput === page;
        const needsReview = data?.nextReview && new Date(data.nextReview) <= new Date();

        return (
          <div key={page} className="relative">
            <button
              onClick={(e) => handlePageClick(page, e)}
              data-page={page}
              className={`
                aspect-square rounded-lg transition-all relative group w-full
                hover:ring-2 hover:ring-indigo-500 hover:ring-offset-2 dark:hover:ring-offset-gray-900
                ${isSelected ? 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-gray-900' : ''}
              `}
              style={getPageStyle(page)}
              title={`Page ${page}${data?.percentage ? ` - ${data.percentage}% complete` : ''}${
                needsReview ? ' - Due for review!' : ''
              }`}
            >
              <span className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                {page}
              </span>
              {needsReview && (
                <Calendar className="absolute top-0 right-0 w-3 h-3 text-red-500" />
              )}
            </button>

            {isPercentageInputVisible && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 z-10 w-48">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={percentageValue}
                  onChange={(e) => setPercentageValue(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between mt-2">
                  <span className="text-xs text-gray-600 dark:text-gray-400">{percentageValue}%</span>
                  <div className="space-x-2">
                    <button
                      onClick={() => setShowPercentageInput(null)}
                      className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handlePercentageSubmit(page)}
                      className="text-xs px-2 py-1 bg-indigo-500 text-white rounded"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}