'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/firebase';
import { useCart } from '@/context/CartContext';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, priority = false }) => {
  const { addToCart } = useCart();

  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  const formatCategory = (cat: string) => {
    return cat.replace('-', ' ').toUpperCase();
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <Link href={`/product/${product.id}`} className={styles.card}>
      {/* Badges and image */}
      <div className={styles.imageWrapper}>
        <span className={styles.badge}>{product.category.split('-')[0]}</span>
        {product.price < product.originalPrice && (
          <span className={styles.saleBadge}>{discountPercent}% OFF</span>
        )}

        <Image
          unoptimized
          src={product.image}
          alt={product.name}
          width={300}
          height={300}
          className={styles.image}
          priority={priority}
        />

        {/* Quick Add Overlay */}
        <div className={styles.quickAddOverlay}>
          <button className={`${styles.quickAddBtn} glow-btn`} onClick={handleQuickAdd}>
            Quick Add
            <svg
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Info details */}
      <div className={styles.info}>
        <div>
          <div className={styles.category}>{formatCategory(product.category)}</div>
          <h3 className={styles.title}>{product.name}</h3>

          <div className={styles.ratingRow}>
            <span className={styles.stars}>
              {'★'.repeat(Math.round(product.rating))}
              {'☆'.repeat(5 - Math.round(product.rating))}
            </span>
            <span className={styles.ratingVal}>
              {product.rating} ({product.reviewsCount})
            </span>
          </div>
        </div>

        <div className={styles.priceRow}>
          <span className={styles.price}>₹{product.price.toLocaleString('en-IN')}</span>
          {product.price < product.originalPrice && (
            <>
              <span className={styles.originalPrice}>₹{product.originalPrice.toLocaleString('en-IN')}</span>
              <span className={styles.saving}>Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')}</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
