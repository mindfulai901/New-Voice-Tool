import React, { useState } from 'react';
import type { HistoryItem } from '../../types';
import { Button } from '../common/Button';
import { Spinner } from '../common/Spinner';

interface HistoryItemProps {
  item: HistoryItem;
  isSelected: boolean;
  onSelect: (id: number) => void;
  onDelete: (item: HistoryItem) => void;
  isDeleting: boolean;
}

export const HistoryItemComponent: React.FC<HistoryItemProps> = ({ item, isSelected, onSelect, onDelete, isDeleting }) => {
  const [showScriptModal, setShowScriptModal] = useState(false);
  const [isThisItemDeleting, setIsThisItemDeleting] = useState(false);

  const handleDelete = async () => {
    setIsThisItemDeleting(true);
    await onDelete(item);
    // isDeleting prop from parent will turn this off
  };

  const creationDate = new Date(item.createdAt).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <>
      {showScriptModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in" onClick={() => setShowScriptModal(false)}>
            <div className="bg-[#181C25] border border-white/10 rounded-xl w-full max-w-2xl p-6 shadow-lg" onClick={e => e.stopPropagation()}>
                <h3 className="text-lg font-bold mb-4 text-cyan-400">Script for "{item.scriptName}"</h3>
                <pre className="bg-black/20 p-4 rounded-lg text-gray-300 max-h-96 overflow-y-auto whitespace-pre-wrap font-sans text-sm">{item.scriptContent}</pre>
                <div className="text-right mt-6">
                    <Button variant="secondary" onClick={() => setShowScriptModal(false)}>Close</Button>
                </div>
            </div>
        </div>
      )}

      <div className={`flex items-center gap-4 p-3 rounded-lg transition-colors duration-200 ${isSelected ? 'bg-cyan-500/10' : 'bg-white/5'}`}>
        <input 
          type="checkbox" 
          className="h-4 w-4 rounded flex-shrink-0 bg-gray-700 border-gray-600 text-cyan-500 focus:ring-cyan-600"
          checked={isSelected}
          onChange={() => onSelect(item.id)}
        />
        <div className="flex-grow">
          <p className="font-semibold text-white">{item.scriptName}</p>
          <p className="text-xs text-gray-400">{creationDate}</p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <audio controls src={item.audioUrl} className="h-9"></audio>
          <Button variant="secondary" className="!px-3 !py-2 text-sm" onClick={() => setShowScriptModal(true)}>View Script</Button>
          <Button 
            variant="danger" 
            className="!px-3 !py-2 w-24 flex justify-center items-center" 
            onClick={handleDelete}
            disabled={isDeleting}
          >
             {isThisItemDeleting ? <Spinner /> : 'Delete'}
          </Button>
        </div>
      </div>
    </>
  );
};
