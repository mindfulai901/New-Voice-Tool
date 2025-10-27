import React, { useState } from 'react';
import type { HistoryItem } from '../../types';
import { Button } from '../common/Button';
import { Spinner } from '../common/Spinner';
import { HistoryItemComponent } from './HistoryItem';

interface HistoryPanelProps {
  items: HistoryItem[];
  isLoading: boolean;
  onClose: () => void;
  onDelete: (items: HistoryItem[]) => Promise<void>;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ items, isLoading, onClose, onDelete }) => {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSelectItem = (id: number) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedIds(new Set(items.map(item => item.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleDeleteSelected = async () => {
    const itemsToDelete = items.filter(item => selectedIds.has(item.id));
    if (itemsToDelete.length === 0) return;
    
    setIsDeleting(true);
    await onDelete(itemsToDelete);
    setSelectedIds(new Set());
    setIsDeleting(false);
  };

  const handleDeleteSingle = async (item: HistoryItem) => {
    setIsDeleting(true);
    await onDelete([item]);
    setIsDeleting(false);
  };
  
  const isAllSelected = selectedIds.size > 0 && selectedIds.size === items.length;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 flex items-center justify-center animate-fade-in" onClick={onClose}>
      <div 
        className="bg-gray-100 dark:bg-[#12161F] border border-gray-200 dark:border-white/10 rounded-2xl w-full max-w-4xl h-[90vh] flex flex-col shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-white/10">
          <h2 className="text-2xl font-bold">Generation History</h2>
          <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-2xl font-bold">&times;</button>
        </header>

        <div className="flex-grow overflow-hidden flex flex-col">
          {items.length > 0 && (
             <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-white/10 bg-black/5">
                <div className="flex items-center gap-3">
                    <input 
                        type="checkbox" 
                        className="h-4 w-4 rounded bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-cyan-600 dark:text-cyan-500 focus:ring-cyan-600"
                        checked={isAllSelected}
                        onChange={handleSelectAll}
                    />
                    <label className="text-sm text-gray-700 dark:text-gray-300">
                        {selectedIds.size > 0 ? `${selectedIds.size} selected` : 'Select All'}
                    </label>
                </div>
                <Button 
                    variant="danger" 
                    className="!px-4 !py-2"
                    onClick={handleDeleteSelected}
                    disabled={selectedIds.size === 0 || isDeleting}
                >
                    {isDeleting && selectedIds.size > 0 ? <Spinner /> : `Delete Selected (${selectedIds.size})`}
                </Button>
            </div>
          )}

          <div className="flex-grow overflow-y-auto p-4 space-y-3">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                <Spinner />
                <p className="mt-4">Loading History...</p>
              </div>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <p>No generation history found.</p>
                <p className="text-sm">Generated voiceovers will appear here.</p>
              </div>
            ) : (
              items.map(item => (
                <HistoryItemComponent 
                    key={item.id}
                    item={item}
                    isSelected={selectedIds.has(item.id)}
                    onSelect={handleSelectItem}
                    onDelete={handleDeleteSingle}
                    isDeleting={isDeleting}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};