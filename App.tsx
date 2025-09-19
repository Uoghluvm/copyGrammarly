import React, { useState, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { Editor } from './components/Editor';
import { ChatSidebar } from './components/Sidebar';
import { SuggestionPopup } from './components/SuggestionCard';
import { getWritingSuggestions } from './services/geminiService';
import type { Suggestion } from './types';
import { DEMO_TEXT } from './constants';

const App: React.FC = () => {
    const [text, setText] = useState<string>(DEMO_TEXT);
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [activeSuggestion, setActiveSuggestion] = useState<Suggestion | null>(null);
    const [popupPosition, setPopupPosition] = useState<{ top: number; left: number } | null>(null);
    
    const editorRef = useRef<HTMLDivElement>(null);
    const [lastSelection, setLastSelection] = useState<Range | null>(null);

    const handleTextChange = useCallback((newText: string) => {
        setText(newText);
        if (suggestions.length > 0 || activeSuggestion) {
            setSuggestions([]);
            setActiveSuggestion(null);
            setPopupPosition(null);
        }
    }, [suggestions, activeSuggestion]);

    const handleCheckText = useCallback(async () => {
        if (!text.trim()) {
            setSuggestions([]);
            return;
        }
        setIsLoading(true);
        setError(null);
        setSuggestions([]);
        setActiveSuggestion(null);
        try {
            const newSuggestions = await getWritingSuggestions(text);
            setSuggestions(newSuggestions);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [text]);
    
    const handleSuggestionClick = useCallback((suggestion: Suggestion, target: HTMLElement) => {
        const rect = target.getBoundingClientRect();
        setPopupPosition({ top: rect.bottom + window.scrollY + 5, left: rect.left + window.scrollX });
        setActiveSuggestion(suggestion);
    }, []);

    const handleApplySuggestion = useCallback((suggestionToApply: Suggestion) => {
        setText(currentText => currentText.replace(suggestionToApply.original, suggestionToApply.correction));
        setSuggestions(currentSuggestions => currentSuggestions.filter(s => s !== suggestionToApply));
        setActiveSuggestion(null);
    }, []);

    const handleInsertText = useCallback((textToInsert: string) => {
        const editor = editorRef.current;
        if (!editor) return;

        editor.focus();
        const sel = window.getSelection();
        if (!sel) return;

        let range: Range;
        if (lastSelection) {
            sel.removeAllRanges();
            sel.addRange(lastSelection);
            range = lastSelection;
        } else if (sel.rangeCount > 0) {
            range = sel.getRangeAt(0);
        } else {
            range = document.createRange();
            range.selectNodeContents(editor);
            range.collapse(false); // Go to end
        }

        range.deleteContents();
        const textNode = document.createTextNode(textToInsert);
        range.insertNode(textNode);

        // Move cursor after inserted text
        range.setStartAfter(textNode);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
        setLastSelection(range.cloneRange());
        
        // Update state
        handleTextChange(editor.innerText);

    }, [lastSelection, handleTextChange]);

    return (
        <div className="min-h-screen text-slate-900 font-sans" onClick={(e) => {
            // Close popup if clicking outside
            if (activeSuggestion && !(e.target as HTMLElement).closest('.suggestion-popup, .suggestion-span')) {
                setActiveSuggestion(null);
            }
        }}>
            <Header />
            <main className="p-4 sm:p-6 lg:p-8">
                <div className="container mx-auto max-w-7xl">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <Editor
                                editorRef={editorRef}
                                text={text}
                                suggestions={suggestions}
                                onTextChange={handleTextChange}
                                onCheckText={handleCheckText}
                                isLoading={isLoading}
                                onSuggestionClick={handleSuggestionClick}
                                onSelectionChange={setLastSelection}
                            />
                        </div>
                        <div className="lg:col-span-1">
                           <ChatSidebar onInsertText={handleInsertText} />
                        </div>
                    </div>
                </div>
            </main>
            {activeSuggestion && popupPosition && (
                <SuggestionPopup
                    suggestion={activeSuggestion}
                    position={popupPosition}
                    onApply={handleApplySuggestion}
                    onClose={() => setActiveSuggestion(null)}
                />
            )}
        </div>
    );
};

export default App;