import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onJumpToPage: (page: number) => void;
}

export function SearchBar({ onJumpToPage }: SearchBarProps) {
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const page = parseInt(value);
    if (page >= 1 && page <= 604) {
      onJumpToPage(page);
      setValue('');
    } else {
      alert('Please enter a valid page number (1-604)');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <div className="relative">
        <input
          type="number"
          min="1"
          max="604"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Go to page..."
          className="pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent outline-none transition-shadow"
        />
        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
      </div>
      <button
        type="submit"
        className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors"
      >
        Go
      </button>
    </form>
  );
}