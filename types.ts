
export enum SuggestionType {
    Grammar = 'Grammar',
    Clarity = 'Clarity',
    Style = 'Style',
    Spelling = 'Spelling',
    Punctuation = 'Punctuation',
    Conciseness = 'Conciseness'
}

export interface Suggestion {
    original: string;
    correction: string;
    explanation: string;
    type: SuggestionType;
}
