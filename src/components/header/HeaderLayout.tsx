'use client';

import React from 'react';
import Header from '@/components/header/Header';
import { usePathname } from 'next/navigation';

export default function HeaderLayout() {
    const pathname = usePathname();
    const showHeader = pathname !== '/login-signup' && pathname !== '/login';

    return (
        <>
            {showHeader && <Header />}
        </>
    );
}
