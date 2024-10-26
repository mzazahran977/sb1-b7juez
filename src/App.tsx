import React, { useEffect, useState } from 'react';
import { Book, Trash2 } from 'lucide-react';
import { FilterType, PageData, PageStatus, getNextReviewDate } from './types';
import { ProgressBar } from './components/ProgressBar';
import { FilterButtons } from './components/FilterButtons';
import { PageGrid } from './components/PageGrid';
import { BackupControls } from './components/BackupControls';
import { StatsDashboard } from './components/StatsDashboard';
import { JuzProgress } from './components/JuzProgress';
import { SearchBar } from './components/SearchBar';
import { ThemeToggle } from './components/ThemeToggle';
import { ReviewStats } from './components/ReviewStats';
import { BatchSelect } from './components/BatchSelect';

const TOTAL_PAGES = 604;

export default function App() {
  const [pageStatus, setPageStatus] = useState<PageData>({});
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('darkMode');
      if (stored !== null) return stored === 'true';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const [selectedPage, setSelectedPage] = useState<number | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    const loadData = () => {
      const data: PageData = {};
      for (let i = 1; i <= TOTAL_PAGES; i++) {
        const stored = localStorage.getItem(`pageStatus${i}`);
        if (stored) {
          data[i] = JSON.parse(stored);
        }
      }
      setPageStatus(data);
    };

    loadData();
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', isDark.toString());
  }, [isDark]);

  const handlePageClick = (
    page: number, 
    status?: PageStatus, 
    percentage?: number,
    isReview?: boolean
  ) => {
    setPageStatus(prev => {
      const currentData = prev[page] || { status: 0, percentage: 0, reviewCount: 0 };
      let newData;

      if (isReview) {
        newData = {
          ...currentData,
          reviewCount: (currentData.reviewCount || 0) + 1,
          nextReview: getNextReviewDate(currentData.reviewCount || 0).toISOString(),
          lastModified: new Date().toISOString()
        };
      } else {
        const newStatus = status ?? ((currentData.status + 1) % 4) as PageStatus;
        const newPercentage = percentage ?? (
          newStatus === 3 ? 100 : 
          newStatus === 0 ? 0 : 
          currentData.percentage || 0
        );

        newData = {
          ...currentData,
          status: newStatus,
          percentage: newPercentage,
          lastModified: new Date().toISOString(),
          ...(newStatus === 3 && currentData.status !== 3 ? {
            nextReview: getNextReviewDate(0).toISOString(),
            reviewCount: 0
          } : {})
        };
      }

      localStorage.setItem(`pageStatus${page}`, JSON.stringify(newData));
      return { ...prev, [page]: newData };
    });
  };

  const handleBatchUpdate = (startPage: number, endPage: number, status: PageStatus) => {
    setPageStatus(prev => {
      const newStatus = { ...prev };
      for (let page = startPage; page <= endPage; page++) {
        const currentData = prev[page] || { status: 0, percentage: 0, reviewCount: 0 };
        const newData = {
          ...currentData,
          status,
          percentage: status === 3 ? 100 : status === 0 ? 0 : currentData.percentage || 0,
          lastModified: new Date().toISOString(),
          ...(status === 3 ? {
            nextReview: getNextReviewDate(0).toISOString(),
            reviewCount: 0
          } : {})
        };
        localStorage.setItem(`pageStatus${page}`, JSON.stringify(newData));
        newStatus[page] = newData;
      }
      return newStatus;
    });
  };

  const handleClearData = () => {
    if (showClearConfirm) {
      for (let i = 1; i <= TOTAL_PAGES; i++) {
        localStorage.removeItem(`pageStatus${i}`);
      }
      setPageStatus({});
      setShowClearConfirm(false);
    } else {
      setShowClearConfirm(true);
      setTimeout(() => setShowClearConfirm(false), 3000);
    }
  };

  const handleImport = (data: PageData) => {
    setPageStatus(data);
    Object.entries(data).forEach(([page, pageData]) => {
      localStorage.setItem(`pageStatus${page}`, JSON.stringify(pageData));
    });
  };

  const handleJumpToPage = (page: number) => {
    setSelectedPage(page);
    const element = document.querySelector(`[data-page="${page}"]`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 transition-colors">
      <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
      
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Book className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            Quran Memorization Tracker
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Track your progress as you memorize the Quran
          </p>
        </div>

        <div className="space-y-8">
          <div className="grid gap-8 grid-cols-1 lg:grid-cols-[2fr,1fr]">
            <StatsDashboard pageStatus={pageStatus} totalPages={TOTAL_PAGES} />
            <ReviewStats pageStatus={pageStatus} />
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Juz' Progress
              </h2>
              <button
                onClick={handleClearData}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                  ${showClearConfirm 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200'}
                `}
              >
                <Trash2 className="w-4 h-4" />
                {showClearConfirm ? 'Click again to confirm' : 'Clear All Data'}
              </button>
            </div>
            <JuzProgress 
              pageStatus={pageStatus} 
              onJuzClick={handleJumpToPage}
            />
          </div>

          <ProgressBar pageStatus={pageStatus} totalPages={TOTAL_PAGES} />
          
          <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-4 items-start">
            <FilterButtons
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />
            <SearchBar onJumpToPage={handleJumpToPage} />
            <BackupControls
              pageStatus={pageStatus}
              onImport={handleImport}
            />
          </div>

          <BatchSelect onBatchUpdate={handleBatchUpdate} />

          <PageGrid
            pageStatus={pageStatus}
            activeFilter={activeFilter}
            onPageClick={handlePageClick}
            selectedPage={selectedPage}
          />
        </div>
      </div>
    </div>
  );
}