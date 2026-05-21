'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Brand Column */}
        <div className={styles.brandCol}>
          <Link href="/" className={styles.logo}>
            Adrin<span className={styles.logoAccent}>Sports</span>
          </Link>
          <p className={styles.description}>
            Premium manufacturer and supplier of professional-grade cricket and hockey equipment based in Jalandhar, India. Spliced for velocity, impact resistance, and maximum control.
          </p>
          <div className={styles.socials}>
            <a href="https://wa.me/917973161494" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="WhatsApp">
              💬
            </a>
            <a href="#" className={styles.socialIcon} aria-label="Instagram">
              📸
            </a>
            <a href="#" className={styles.socialIcon} aria-label="Facebook">
              📘
            </a>
          </div>
        </div>

        {/* Quick Links Column */}
        <div>
          <h4 className={styles.title}>Menu Links</h4>
          <ul className={styles.links}>
            <li className={styles.linkItem}>
              <Link href="/">Home Page</Link>
            </li>
            <li className={styles.linkItem}>
              <Link href="/shop">Sports Catalog</Link>
            </li>
            <li className={styles.linkItem}>
              <Link href="/#tech-showcase">Manufacturing Technology</Link>
            </li>
            <li className={styles.linkItem}>
              <Link href="/bulk">Bulk Team Orders</Link>
            </li>
          </ul>
        </div>

        {/* Contact Info Column */}
        <div>
          <h4 className={styles.title}>Contact</h4>
          <div className={styles.contactInfo}>
            <div className={styles.contactRow}>
              <span className={styles.contactIcon}>📍</span>
              <span>105 New Gobind Nagar,<br />Gujja Peer Road,<br />Jalandhar – 144004,<br />Punjab, India</span>
            </div>
            <div className={styles.contactRow}>
              <span className={styles.contactIcon}>📞</span>
              <span>+91 70099 56467<br />+91 98558 37914</span>
            </div>
            <div className={styles.contactRow}>
              <span className={styles.contactIcon}>✉️</span>
              <span>info@adrinsports.com</span>
            </div>
          </div>
        </div>

        {/* Newsletter Column */}
        <div className={styles.newsletterCol}>
          <h4 className={styles.title}>Newsletter</h4>
          <p style={{ fontSize: '13px', lineHeight: 1.5 }}>
            Subscribe to receive premium sports gear announcements, restock alerts, and exclusive academy discount offers.
          </p>
          <form className={styles.newsletterForm} onSubmit={handleSubscribe}>
            <div className={styles.inputGroup}>
              <input
                type="email"
                placeholder="Enter email address"
                required
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button type="submit" className={`${styles.submitBtn} glow-btn`}>
              {subscribed ? 'Subscribed!' : 'Subscribe'}
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={styles.bottom}>
        <div>
          © {new Date().getFullYear()} Adrin Sports. All rights reserved. Jalandhar, Punjab.
        </div>
        <div className={styles.badges}>
          <div className={styles.badge}>
            <span className={styles.badgeIcon}>✓</span> ISI Quality Certified
          </div>
          <div className={styles.badge}>
            <span className={styles.badgeIcon}>✓</span> Toxic Free Compound
          </div>
          <div className={styles.badge}>
            <span className={styles.badgeIcon}>✓</span> 100% Quality Tested
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
