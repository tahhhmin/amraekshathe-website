import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faInstagram,
    faFacebook,
    faYoutube,
    faLinkedin,
} from '@fortawesome/free-brands-svg-icons';

import React from 'react';
import Styles from './Footer.module.css';
import Image from 'next/image';
import Link from 'next/link';

import Logo from '../../../public/amraekshathe-icon.svg';

export default function Footer() {
    return (
        <footer className={Styles.footer}>
            <div className={Styles.header}>
                <Link href="/">
                    <Image
                        className={Styles.logo}
                        src={Logo}
                        alt="Hashi Ekshathe Logo"
                    />
                </Link>

                <div className={Styles.headerIcons}>
                    <Link href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faFacebook} className={Styles.fontawesomeIcon} />
                    </Link>
                    <Link href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faInstagram} className={Styles.fontawesomeIcon} />
                    </Link>
                    <Link href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faYoutube} className={Styles.fontawesomeIcon} />
                    </Link>
                    <Link href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faLinkedin} className={Styles.fontawesomeIcon} />
                    </Link>
                </div>
            </div>

            <div className={Styles.footerFooter}>
                <p>&copy; 2025 Amra Ekshathe. All Rights Reserved.</p>
                <a href="#">Privacy Policy</a>
                <a href="#">Terms & Services</a>

            </div>
        </footer>
    );
}
