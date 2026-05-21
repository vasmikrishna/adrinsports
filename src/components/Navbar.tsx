'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import styles from './Navbar.module.css';

export const Navbar: React.FC = () => {
  const { cartCount, toggleCart } = useCart();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`${styles.header} ${isScrolled ? styles.headerScrolled : ''}`}>
      <div className={styles.container}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          Adrin<span className={styles.logoAccent}>Sports</span>
        </Link>

        {/* Links */}
        <nav>
          <ul className={styles.navLinks}>
            <li>
              <Link href="/" className={`${styles.navLink} ${pathname === '/' ? styles.active : ''}`}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/shop" className={`${styles.navLink} ${pathname === '/shop' ? styles.active : ''}`}>
                Products Store
              </Link>
            </li>
            <li>
              <Link href="/#tech-showcase" className={styles.navLink}>
                Technology
              </Link>
            </li>
            <li>
              <Link href="/bulk" className={`${styles.navLink} ${pathname === '/bulk' ? styles.active : ''}`}>
                Bulk Orders
              </Link>
            </li>
          </ul>
        </nav>

        {/* Action button triggers */}
        <div className={styles.actions}>
          <button onClick={toggleCart} className={styles.cartTrigger} aria-label="Open Shopping Cart">
            <svg
              className={styles.cartIcon}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span>Cart</span>
            {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
          </button>

          <Link href="/bulk" className="glow-btn styles.bulkButton" style={{ padding: '10px 20px', borderRadius: '8px' }}>
            Get Quote
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
