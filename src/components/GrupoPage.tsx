import React from 'react';
import { MessageCircleMore } from 'lucide-react';

export function GrupoPage() {
    const whatsappLink = 'https://chat.whatsapp.com/CpQZUkK7X7e9NM40s9952i'; // substitua com o link real

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900 text-black dark:text-white px-4">
            <h1 className="text-2xl font-bold mb-6 text-center">Bem-vindo ao PID!</h1>

            <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-green-500 hover:bg-green-600 text-white neon-zap text-sm font-medium shadow-md transition"
            >
                <MessageCircleMore className="w-5 h-5" />
                Entrar no Grupo do WhatsApp
            </a>
        </div>
    );
}
