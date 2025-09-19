import React from 'react';

const LogoIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="url(#grad1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 17L12 22L22 17" stroke="url(#grad2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 12L12 17L22 12" stroke="url(#grad3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <defs>
            <linearGradient id="grad1" x1="12" y1="2" x2="12" y2="12" gradientUnits="userSpaceOnUse">
                <stop stopColor="#a855f7"/>
                <stop offset="1" stopColor="#6366f1"/>
            </linearGradient>
            <linearGradient id="grad2" x1="12" y1="17" x2="12" y2="22" gradientUnits="userSpaceOnUse">
                 <stop stopColor="#a855f7"/>
                <stop offset="1" stopColor="#8b5cf6"/>
            </linearGradient>
            <linearGradient id="grad3" x1="12" y1="12" x2="12" y2="17" gradientUnits="userSpaceOnUse">
                <stop stopColor="#8b5cf6"/>
                <stop offset="1" stopColor="#6366f1"/>
            </linearGradient>
        </defs>
    </svg>
);


export const Header: React.FC = () => {
    return (
        <header className="bg-white/60 backdrop-blur-lg border-b border-white/30 sticky top-0 z-20">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-3">
                       <LogoIcon />
                        <h1 className="text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
                           AI Writing Assistant
                        </h1>
                    </div>
                    <div className="flex items-center">
                        <a href="#" className="px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-black/5 transition-colors">
                            Account
                        </a>
                    </div>
                </div>
            </div>
        </header>
    );
};
