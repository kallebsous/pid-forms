// src/components/ThemeToggle.tsx
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const root = document.documentElement;
        const saved = localStorage.getItem('theme');
/*
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: light)').matches;
*/
        const initial = saved || 'light';
        root.classList.toggle('dark', initial === 'dark');
        setIsDark(initial === 'dark');
    }, []);

    const toggleTheme = () => {
        const root = document.documentElement;
        const newTheme = isDark ? 'light' : 'dark';
        root.classList.toggle('dark', newTheme === 'dark');
        localStorage.setItem('theme', newTheme);
        setIsDark(!isDark);
    };

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-rose-700 hover:text-white dark:hover:bg-rose-700 transition"
            aria-label="Alternar tema"
        >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
    );
}
