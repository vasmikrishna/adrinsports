'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Portfolio } from '@/lib/firebase';
import styles from './PortfolioCard.module.css';

interface PortfolioCardProps {
  portfolio: Portfolio;
}

export const PortfolioCard: React.FC<PortfolioCardProps> = ({ portfolio }) => {
  const sportLabel = portfolio.sport === 'both' ? 'Cricket & Hockey' : portfolio.sport === 'cricket' ? 'Cricket' : 'Hockey';
  const sportEmoji = portfolio.sport === 'hockey' ? '🏑' : portfolio.sport === 'both' ? '🏏🏑' : '🏏';

  return (
    <Link href={`/athletes/${portfolio.slug}`} className={styles.card}>
      <div className={styles.imageWrapper}>
        <span className={styles.sportBadge}>{sportEmoji} {sportLabel}</span>
        {portfolio.profileImage ? (
          <Image
            unoptimized
            src={portfolio.profileImage}
            alt={portfolio.fullName}
            width={300}
            height={300}
            className={styles.image}
          />
        ) : (
          <div className={styles.placeholder}>
            <span>{portfolio.fullName.charAt(0).toUpperCase()}</span>
          </div>
        )}
      </div>

      <div className={styles.info}>
        <div>
          <h3 className={styles.name}>{portfolio.fullName}</h3>
          <div className={styles.role}>{portfolio.role}</div>
          <div className={styles.locationRow}>
            <span>📍</span>
            <span>{portfolio.city}, {portfolio.state}</span>
          </div>
          {portfolio.academy && (
            <div className={styles.academyRow}>
              <span>🏫</span>
              <span>{portfolio.academy}</span>
            </div>
          )}
        </div>

        <span className={styles.viewBtn}>
          View Profile
          <span>➔</span>
        </span>
      </div>
    </Link>
  );
};

export default PortfolioCard;
