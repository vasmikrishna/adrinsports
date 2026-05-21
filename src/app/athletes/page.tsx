'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { db, Portfolio } from '@/lib/firebase';
import Navbar from '@/components/Navbar';
import CartDrawer from '@/components/CartDrawer';
import PortfolioCard from '@/components/PortfolioCard';
import Footer from '@/components/Footer';
import styles from './athletes.module.css';

const sportFilters = [
  { key: 'all', label: 'All Athletes' },
  { key: 'cricket', label: '🏏 Cricket' },
  { key: 'hockey', label: '🏑 Hockey' },
];

export default function AthletesDirectory() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sportFilter, setSportFilter] = useState('all');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await db.searchPortfolios({
          searchQuery,
          sport: sportFilter,
        });
        setPortfolios(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [searchQuery, sportFilter]);

  return (
    <main className={styles.page}>
      <div className={styles.bgBlob1} />
      <div className={styles.bgBlob2} />
      <Navbar />
      <CartDrawer />

      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.badge}>Athlete Network</span>
          <h1 className={styles.title}>Discover Athletes</h1>
          <p className={styles.subtitle}>
            Browse sports portfolios from cricket players, hockey athletes, coaches, and academy stars across India. Connect with talent directly.
          </p>
        </div>

        {/* Search & Filters */}
        <div className={styles.searchRow}>
          <div className={styles.searchWrapper}>
            <svg className={styles.searchIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by name, city, role, or academy..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.filterBar}>
          {sportFilters.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSportFilter(tab.key)}
              className={`${styles.filterTab} ${sportFilter === tab.key ? styles.filterTabActive : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Results */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px 0', color: 'var(--text-secondary)' }}>
            Discovering athletes...
          </div>
        ) : portfolios.length > 0 ? (
          <div className={styles.grid}>
            {portfolios.map((p) => (
              <PortfolioCard key={p.id} portfolio={p} />
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <svg className={styles.emptyIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 style={{ fontFamily: 'var(--font-headings)', fontSize: '20px', textTransform: 'uppercase' }}>
              No athletes found
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '380px' }}>
              {searchQuery
                ? `No results for "${searchQuery}". Try a different name, city, or role.`
                : 'Be the first to create your sports portfolio and get discovered!'}
            </p>
          </div>
        )}

        {/* CTA to create */}
        <div className={styles.createCta}>
          <h2 className={styles.ctaTitle}>Build Your Own Portfolio</h2>
          <p className={styles.ctaDesc}>
            Create a premium sports profile to showcase your skills, stats, and achievements. Share it with clubs, academies, and scouts across India.
          </p>
          <Link href="/portfolio/create" className="glow-btn" style={{ padding: '16px 36px', borderRadius: '8px', display: 'inline-flex', marginTop: '24px' }}>
            Create My Portfolio
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  );
}
