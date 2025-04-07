import React from 'react';

export function LoadingScreen() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 transition-colors">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
        </div>
    );
}
