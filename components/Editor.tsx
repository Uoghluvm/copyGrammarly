import React, { useMemo } from 'react';
import type { Suggestion } from '../types';
import { SuggestionType } from '../types';

interface EditorProps {
    text: string;
    suggestions: Suggestion[];
    onTextChange: (text: string) => void;
    onCheckText: () => void;
    isLoading: boolean;
    onSuggestionClick: (suggestion: Suggestion, target: HTMLElement) => void;
    onSelectionChange: (range: Range | null) => void;
    editorRef: React.RefObject<HTMLDivElement>;
}

const typeUnderlineColors: Record<SuggestionType, string> = {
    [SuggestionType.Grammar]: 'decoration-red-500',
    [SuggestionType.Clarity]: 'decoration-blue-500',
    [SuggestionType.Style]: 'decoration-purple-500',
    [SuggestionType.Spelling]: 'decoration-yellow-500',
    [SuggestionType.Punctuation]: 'decoration-green-500',
    [SuggestionType.Conciseness]: 'decoration-teal-500',
};

const escapeRegExp = (string: string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); 
};

export const Editor: React.FC<EditorProps> = ({ text, suggestions, onTextChange, onCheckText, isLoading, onSuggestionClick, onSelectionChange, editorRef }) => {
    
    const editorContent = useMemo(() => {
        if (suggestions.length === 0) {
            return text;
        }

        const parts = [];
        let lastIndex = 0;

        // Sort suggestions by their position in the text to avoid conflicts
        const sortedSuggestions = [...suggestions].sort((a, b) => text.indexOf(a.original) - text.indexOf(b.original));

        sortedSuggestions.forEach((suggestion, index) => {
            const originalIndex = text.indexOf(suggestion.original);
            if (originalIndex === -1 || originalIndex < lastIndex) return;

            // Add text before the suggestion
            if (originalIndex > lastIndex) {
                parts.push(text.substring(lastIndex, originalIndex));
            }
            
            // Add the highlighted suggestion
            parts.push(
                <span
                    key={index}
                    onClick={(e) => onSuggestionClick(suggestion, e.currentTarget)}
                    className={`suggestion-span cursor-pointer underline decoration-wavy decoration-2 ${typeUnderlineColors[suggestion.type] || 'decoration-gray-500'}`}
                >
                    {suggestion.original}
                </span>
            );

            lastIndex = originalIndex + suggestion.original.length;
        });

        // Add any remaining text
        if (lastIndex < text.length) {
            parts.push(text.substring(lastIndex));
        }
        
        return parts;
    }, [text, suggestions, onSuggestionClick]);

    const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
        onTextChange(e.currentTarget.innerText);
    };

    const handleBlur = () => {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            onSelectionChange(selection.getRangeAt(0));
        }
    };

    return (
        <div className="bg-white/60 backdrop-blur-lg border border-white/30 rounded-lg shadow-lg h-full flex flex-col">
            <div className="p-4 border-b border-slate-200/80 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-slate-800">Editor</h2>
            </div>
            <div className="p-1 flex-grow">
                 <div
                    ref={editorRef}
                    contentEditable={!isLoading}
                    onInput={handleInput}
                    onBlur={handleBlur}
                    suppressContentEditableWarning={true}
                    className="w-full h-full min-h-[400px] lg:min-h-[500px] p-3 text-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none leading-relaxed"
                >
                    {editorContent}
                </div>
            </div>
            <div className="p-4 border-t border-slate-200/80 flex justify-end items-center space-x-4">
                 <div className="text-sm text-slate-500">
                    {text.trim().split(/\s+/).filter(Boolean).length} words
                </div>
                <button
                    onClick={onCheckText}
                    disabled={isLoading || !text.trim()}
                    className="relative inline-flex items-center justify-center px-6 py-2 text-md font-medium text-white bg-slate-800 rounded-md group disabled:opacity-50 disabled:cursor-not-allowed transition-transform active:scale-95"
                >
                    <span className="absolute inset-0 w-full h-full mt-1 ml-1 transition-all duration-300 ease-in-out bg-gradient-to-br from-purple-500 to-indigo-500 rounded-md group-hover:mt-0 group-hover:ml-0"></span>
                    <span className="absolute inset-0 w-full h-full bg-white/20 rounded-md "></span>
                    <span className="absolute inset-0 w-full h-full transition-all duration-200 ease-in-out delay-100 bg-slate-800 rounded-md opacity-100 group-hover:opacity-0"></span>
                    <span className="relative text-white transition-colors duration-200 ease-in-out delay-100">
                        {isLoading ? 'Analyzing...' : 'Check Text'}
                    </span>
                </button>
            </div>
        </div>
    );
};
