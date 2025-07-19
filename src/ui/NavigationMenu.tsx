'use client';

import React, { useRef, useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './NavigationMenu.module.css';
import Button from './button/Button';

const SCROLL_AMOUNT = 300;

interface DropdownItem {
    name: string;
    path?: string;
    description?: string;
}

export interface NavItem {
    name: string;
    path?: string;
    hasDropdown?: boolean;
    dropdownItems?: DropdownItem[];
}

interface NavigationMenuProps {
    navItems: NavItem[];
    onNavigate?: (path: string) => void;
    onDropdownNavigate?: (path: string) => void;
}

const NavigationMenu: React.FC<NavigationMenuProps> = ({
    navItems,
    onNavigate,
    onDropdownNavigate,
    }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const [showLeft, setShowLeft] = useState(false);
    const [showRight, setShowRight] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
    const [currentPath, setCurrentPath] = useState<string>('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
        setCurrentPath(window.location.pathname);
        }
    }, []);

    const updateScrollButtons = () => {
        const el = containerRef.current;
        if (!el) return;
        setShowLeft(el.scrollLeft > 0);
        setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    };

    const updateDropdownPosition = (el: HTMLElement) => {
        const rect = el.getBoundingClientRect();
        setDropdownPosition({
        top: rect.bottom + 8,
        left: rect.left + rect.width / 2,
        });
    };

    const scroll = (dir: 'left' | 'right') => {
        if (!containerRef.current) return;
        containerRef.current.scrollBy({
        left: dir === 'left' ? -SCROLL_AMOUNT : SCROLL_AMOUNT,
        behavior: 'smooth',
        });
    };

    const clearHideTimeout = () => {
        if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
        }
    };

    const scheduleHideDropdown = () => {
        clearHideTimeout();
        hideTimeoutRef.current = setTimeout(() => {
        setActiveDropdown(null);
        hideTimeoutRef.current = null;
        }, 250);
    };

    const handleNavClick = (path?: string) => {
        if (!path) return;
        setCurrentPath(path);
        if (onNavigate) {
        onNavigate(path);
        } else {
        window.location.href = path;
        }
    };

    const handleDropdownClick = (item: DropdownItem) => {
        if (!item.path) {
        console.log('Dropdown item clicked:', item.name);
        return;
        }
        if (onDropdownNavigate) {
        onDropdownNavigate(item.path);
        } else {
        window.location.href = item.path;
        }
    };

    useEffect(() => {
        updateScrollButtons();
        window.addEventListener('resize', updateScrollButtons);
        return () => window.removeEventListener('resize', updateScrollButtons);
    }, [navItems]);

    return (
        <nav className={styles.nav}>
        {/* Scroll Left Button */}
        {showLeft && (

            <div  className={` ${styles.scrollLeft}`}><Button
                variant='icon'
                icon='ChevronLeft'
                showIcon
                onClick={() => scroll('left')}
                aria-label="Scroll Left"
            /></div>
        )}

        {/* Navbar and Scroll Right Wrapper */}
        <div className={styles.navbarWrapper}>
            <div
            className={styles.navbarContainer}
            ref={containerRef}
            onScroll={updateScrollButtons}
            >
            {navItems.map((item, idx) => (
                <div key={idx} className={styles.navItemContainer}>
                <button
                    className={`${styles.navItem} ${
                    item.path === currentPath ? styles.activeNavItem : ''
                    }`}
                    onClick={() => handleNavClick(item.path)}
                    onMouseEnter={(e) => {
                    clearHideTimeout();
                    if (item.hasDropdown) {
                        setActiveDropdown(idx);
                        updateDropdownPosition(e.currentTarget as HTMLElement);
                    }
                    }}
                    onMouseLeave={() => {
                    scheduleHideDropdown();
                    }}
                    type="button"
                >
                    <span className={styles.navText}>{item.name}</span>
                    {item.hasDropdown && (
                    <ChevronDown size={16} className={styles.dropdownArrow} />
                    )}
                </button>
                </div>
            ))}
            </div>

            {showRight && (
            <div  className={` ${styles.scrollRight}`}><Button
                variant='icon'
                icon='ChevronRight'
                showIcon
                onClick={() => scroll('left')}
                aria-label="Scroll Left"
            /></div>
            )}
        </div>

        {/* Dropdown Menu */}
        {activeDropdown !== null &&
            navItems[activeDropdown]?.hasDropdown &&
            navItems[activeDropdown]?.dropdownItems && (
            <div
                className={`${styles.dropdownMenu} ${styles.active}`}
                style={{
                top: `${dropdownPosition.top}px`,
                left: `${dropdownPosition.left}px`,
                transform: 'translateX(-50%)',
                }}
                onMouseEnter={() => {
                clearHideTimeout();
                setActiveDropdown(activeDropdown);
                }}
                onMouseLeave={() => {
                scheduleHideDropdown();
                }}
            >
                {navItems[activeDropdown].dropdownItems.map((sub, subIdx) => (
                <button
                    key={subIdx}
                    className={styles.dropdownItem}
                    onClick={() => handleDropdownClick(sub)}
                    type="button"
                >
                    <div className={styles.dropdownItemTitle}>{sub.name}</div>
                    {sub.description && (
                    <div className={styles.dropdownItemDescription}>
                        {sub.description}
                    </div>
                    )}
                </button>
                ))}
            </div>
            )}
        </nav>
    );
};

export default NavigationMenu;
