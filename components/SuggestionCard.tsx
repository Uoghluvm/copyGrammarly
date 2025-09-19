import React from 'react';
import type { Suggestion } from '../types';

interface SuggestionPopupProps {
    suggestion: Suggestion;
    position: { top: number; left: number };
    onApply: (suggestion: Suggestion) => void;
    onClose: () => void;
}

export const SuggestionPopup: React.FC<SuggestionPopupProps> = ({ suggestion, position, onApply, onClose }) => {
    return (
        <div
            className="suggestion-popup absolute z-30 bg-white rounded-lg shadow-2xl border border-slate-200 w-72"
            style={{ top: `${position.top}px`, left: `${position.left}px` }}
        >
            <div className="p-3">
                <div className="flex justify-between items-center mb-2">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700`}>
                        {suggestion.type}
                    </span>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">&times;</button>
                </div>
                
                <p className="text-sm text-slate-600 mb-3">{suggestion.explanation}</p>
                
                <div className="bg-slate-50 p-2 rounded-md">
                    <p className="text-red-500 line-through text-sm">{suggestion.original}</p>
                    <p className="text-green-600 text-sm font-medium">{suggestion.correction}</p>
                </div>

            </div>
            <div className="px-3 py-2 bg-slate-50 rounded-b-lg flex justify-end">
                <button
                    onClick={() => onApply(suggestion)}
                    className="px-4 py-1 text-sm font-semibold text-white bg-indigo-500 rounded-md hover:bg-indigo-600 transition-colors"
                >
                    Accept
                </button>
            </div>
        </div>
    );
};
