'use client';

import React from 'react';
import Footer from '@/components/footer/Footer';
import { usePathname } from 'next/navigation';

export default function FooterLayout() {
    const pathname = usePathname();
    const showFooter = pathname !== '/login-signup' && pathname !== '/profile';

    return (
        <>
            {showFooter && <Footer />}
        </>
    );
}
