'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import Styles from './Header.module.css';
import Link from 'next/link';
import Image from 'next/image';
import LogoLight from '../../../public/amraekshathe-icon.svg';
import LogoDark from '../../../public/amraekshathe-dark-icon.svg';
import AuthButton from '../buttons/AuthButton';
import ThemeToggleButton from '../buttons/ThemeToggleButton';
import NavigationMenu, { NavItem } from '@/ui/NavigationMenu';

const navItems: NavItem[] = [
  { name: 'Home', path: '/' },
  {
    name: 'About',
    path: '/about',
    hasDropdown: true,
    dropdownItems: [
      { name: 'Introduction', path: '/about/introduction', description: 'Get to know who we are and what drives our mission.' },
    ],
  },
  {
    name: 'Organisations',
    path: '/records',
    hasDropdown: true,
    dropdownItems: [
      { name: 'View all organisations', path: '/organisations', description: 'See how your contributions are making a difference.' },
      { name: 'Register', path: '/organisation/register', description: 'Review how we allocate funds for complete transparency.' },
    ],
  },
  {
    name: 'Projects',
    path: '/projects',
    hasDropdown: true,
    dropdownItems: [
      { name: 'Upcoming Projects', path: '/projects/upcoming-projects', description: 'Explore the initiatives we’re planning in the near future.' },
      { name: 'Ongoing Projects', path: '/projects/ongoing-projects', description: 'Follow the progress of our current impactful efforts.' },
      { name: 'Completed Projects', path: '/projects/completed-projects', description: 'Look back at our past achievements and milestones.' },
    ],
  },
  {
    name: 'Volunteer',
    path: '/volunteer',
    hasDropdown: true,
    dropdownItems: [
      { name: 'Register', path: '/volunteer/register', description: 'Sign up to be a part of our growing volunteer community.' },
      { name: 'Benefits', path: '/volunteer/benefits', description: 'Discover how volunteering with us helps you grow too.' },
    ],
  },
  {
    name: 'Contact',
    path: '/contact',
    hasDropdown: true,
    dropdownItems: [
      { name: 'Inquiry', path: '/contact/inquiry', description: 'Have a question? Reach out and we’ll be happy to help.' },
      { name: 'Collaborate', path: '/contact/collaborate', description: 'Let’s team up and create something meaningful together.' },
    ],
  },
];

export default function Header() {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Avoid SSR hydration issues

  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDark = currentTheme === 'dark';

  return (
    <div className={Styles.headerContainer}>
      <header className={Styles.header}>
        <div className={Styles.logoContainer}>
          <Link href="/">
            {/* Conditionally render the logo based on theme */}
            {isDark ? (
              <Image
                className={Styles.logo}
                src={LogoDark}
                alt="Dark Logo"
                priority
                width={120}
                height={120}
              />
            ) : (
              <Image
                className={Styles.logo}
                src={LogoLight}
                alt="Light Logo"
                priority
                width={120}
                height={120}
              />
            )}
          </Link>
        </div>

        <div className={Styles.navigationContainer}>
          <NavigationMenu navItems={navItems} />
        </div>

        <div className={Styles.buttonContainer}>
          <AuthButton />
          <ThemeToggleButton />
        </div>
      </header>
    </div>
  );
}
