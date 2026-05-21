'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { db, Product } from '@/lib/firebase';
import Navbar from '@/components/Navbar';
import CartDrawer from '@/components/CartDrawer';
import ProductCard from '@/components/ProductCard';
import Footer from '@/components/Footer';
import styles from './shop.module.css';

// Active filter keys mapped to display names
const filterTabs = [
  { key: 'all', label: 'All Gear' },
  { key: 'cricket-bats', label: 'Cricket Bats' },
  { key: 'cricket-balls', label: 'Cricket Balls' },
  { key: 'cricket-gear', label: 'Protective Kit' },
  { key: 'hockey-sticks', label: 'Hockey Sticks' },
  { key: 'hockey-balls', label: 'Hockey Balls' },
  { key: 'hockey-gear', label: 'Hockey Shinguards & Gloves' }
];

function ShopContent() {
  const searchParams = useSearchParams();
  
  // Set default category filter based on query strings (e.g. ?category=cricket)
  const initialCategory = searchParams.get('category');
  
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Sync category filter if user navigates with search query parameters
  useEffect(() => {
    if (initialCategory) {
      if (initialCategory === 'cricket' || initialCategory === 'hockey') {
        setSelectedFilter(initialCategory); // We handle partial matching inside queryProducts!
      } else {
        setSelectedFilter(initialCategory);
      }
    }
  }, [initialCategory]);

  // Load and filter products dynamically when criteria changes
  useEffect(() => {
    const fetchFilteredData = async () => {
      setLoading(true);
      try {
        const filtered = await db.queryProducts({
          category: selectedFilter,
          searchQuery: searchQuery,
          sort: sortBy
        });
        setProducts(filtered);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredData();
  }, [selectedFilter, searchQuery, sortBy]);

  const handleResetFilters = () => {
    setSelectedFilter('all');
    setSearchQuery('');
    setSortBy('default');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Sports Gear Catalog</h1>
        <p className={styles.subtitle}>
          Browse Jalandhar-grade high-impact cricket and field hockey equipment. Quality certified, impact resilient, and engineered for peak athlete performance.
        </p>
      </div>

      {/* Controls: Search and Sorting dropdown */}
      <div className={styles.controlsRow}>
        <div className={styles.searchWrapper}>
          <svg
            className={styles.searchIcon}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search bats, PVC wind balls, sticks, shin guards..."
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <select
          className={styles.sortSelect}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          aria-label="Sort products filter"
        >
          <option value="default">Default Sorting</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Rating: Highest First</option>
        </select>
      </div>

      {/* Categories Horizontal Tabs */}
      <div className={styles.filterBar}>
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSelectedFilter(tab.key)}
            className={`${styles.filterTab} ${selectedFilter === tab.key ? styles.filterTabActive : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Results Listing */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '100px 0', color: 'var(--text-secondary)' }}>
          <p>Filtering premium gear...</p>
        </div>
      ) : products.length === 0 ? (
        <div className={styles.noResults}>
          <svg
            className={styles.noResultsIcon}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className={styles.noResultsTitle}>No equipment matches your search</h3>
          <p className={styles.noResultsDesc}>
            Try clearing filters or search terms, or search general terms like &quot;bat&quot;, &quot;wind ball&quot;, or &quot;hockey stick&quot;.
          </p>
          <button className={`${styles.resetBtn} glow-btn`} onClick={handleResetFilters}>
            Clear All Search Criteria
          </button>
        </div>
      ) : (
        <div className={styles.grid}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Shop() {
  return (
    <main className={styles.page}>
      <div className={styles.bgBlob1} />
      <div className={styles.bgBlob2} />
      <Navbar />
      <CartDrawer />
      <Suspense fallback={<div style={{ textAlign: 'center', padding: '100px 0', color: 'var(--text-secondary)' }}>Syncing parameters...</div>}>
        <ShopContent />
      </Suspense>
      <Footer />
    </main>
  );
}
