import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Inter } from 'next/font/google';

import './globals.css';


const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Keep Typing And No One Explodes',
    description: 'Pair programming simulator in 2025.',
}

export default function RootLayout(props: { children: ReactNode }) {
    return (
        <html lang="en" className="scroll-smooth">
            <body className={inter.className}>
                {props.children}
            </body>
        </html>
    )
}
