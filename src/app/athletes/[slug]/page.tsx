'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { db, Portfolio } from '@/lib/firebase';
import Navbar from '@/components/Navbar';
import CartDrawer from '@/components/CartDrawer';
import ShareBar from '@/components/ShareBar';
import Footer from '@/components/Footer';
import styles from './portfolio-view.module.css';

export default function PortfolioView() {
  const params = useParams();
  const slug = params.slug as string;

  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    const load = async () => {
      setLoading(true);
      try {
        const data = await db.getPortfolioBySlug(slug);
        setPortfolio(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  if (loading) {
    return (
      <main className={styles.page}>
        <Navbar />
        <CartDrawer />
        <div style={{ textAlign: 'center', padding: '120px 24px', color: 'var(--text-secondary)' }}>
          Loading athlete profile...
        </div>
        <Footer />
      </main>
    );
  }

  if (!portfolio) {
    return (
      <main className={styles.page}>
        <Navbar />
        <CartDrawer />
        <div style={{ textAlign: 'center', padding: '120px 24px', maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-headings)', fontSize: '32px', marginBottom: '16px' }}>
            Portfolio Not Found
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
            This athlete profile may have been removed or the link is incorrect.
          </p>
          <Link href="/athletes" className="glow-btn" style={{ padding: '12px 30px', borderRadius: '8px' }}>
            Browse Athletes
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const sportLabel = portfolio.sport === 'both' ? 'Cricket & Hockey' : portfolio.sport === 'cricket' ? 'Cricket' : 'Hockey';
  const sportEmoji = portfolio.sport === 'hockey' ? '🏑' : portfolio.sport === 'both' ? '🏏🏑' : '🏏';
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <main className={styles.page}>
      <div className={styles.bgBlob1} />
      <div className={styles.bgBlob2} />
      <Navbar />
      <CartDrawer />

      <div className={styles.container}>
        <Link href="/athletes" className={styles.backBtn}>
          ← Back to Athletes
        </Link>

        {/* Profile Hero */}
        <div className={styles.profileHero}>
          <div className={styles.heroGlow} />
          <div className={styles.imageCol}>
            <div className={styles.glowCircle} />
            {portfolio.profileImage ? (
              <Image
                unoptimized
                src={portfolio.profileImage}
                alt={portfolio.fullName}
                width={200}
                height={200}
                className={styles.profileImage}
              />
            ) : (
              <div className={styles.placeholderAvatar}>
                {portfolio.fullName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className={styles.infoCol}>
            <span className={styles.sportBadge}>{sportEmoji} {sportLabel}</span>
            <h1 className={styles.heroName}>{portfolio.fullName}</h1>
            <div className={styles.heroRole}>{portfolio.role}</div>
            <div className={styles.heroLocation}>
              <span>📍</span> {portfolio.city}, {portfolio.state}
            </div>
            {portfolio.academy && (
              <div className={styles.heroAcademy}>
                <span>🏫</span> {portfolio.academy}
              </div>
            )}
            {portfolio.experience && (
              <div className={styles.heroAcademy}>
                <span>⏳</span> {portfolio.experience} experience
              </div>
            )}
          </div>
        </div>

        {/* Share Bar */}
        <ShareBar url={shareUrl} title={portfolio.fullName} description={`${portfolio.role} — ${sportLabel} athlete from ${portfolio.city}`} />

        {/* Bio */}
        {portfolio.bio && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>About</h2>
            <p className={styles.bioText}>{portfolio.bio}</p>
          </div>
        )}

        {/* Stats Dashboard */}
        {Object.keys(portfolio.stats).length > 0 && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Performance Stats</h2>
            <div className={styles.statsGrid}>
              {Object.entries(portfolio.stats).map(([label, value]) => (
                <div className={styles.statCard} key={label}>
                  <div className={styles.statValue}>{value}</div>
                  <div className={styles.statLabel}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievements */}
        {portfolio.achievements.length > 0 && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Achievements</h2>
            <div className={styles.achievementsList}>
              {portfolio.achievements.map((a, idx) => (
                <div className={styles.achievementItem} key={idx}>
                  <span className={styles.achievementIcon}>🏆</span>
                  <span>{a}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contact */}
        {(portfolio.contactEmail || portfolio.contactPhone || portfolio.socialLinks?.whatsapp || portfolio.socialLinks?.instagram) && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Contact</h2>
            <div className={styles.contactGrid}>
              {portfolio.contactEmail && (
                <a href={`mailto:${portfolio.contactEmail}`} className={styles.contactCard}>
                  <span className={styles.contactIcon}>✉️</span>
                  <div>
                    <div className={styles.contactLabel}>Email</div>
                    <div className={styles.contactValue}>{portfolio.contactEmail}</div>
                  </div>
                </a>
              )}
              {portfolio.contactPhone && (
                <a href={`tel:${portfolio.contactPhone}`} className={styles.contactCard}>
                  <span className={styles.contactIcon}>📞</span>
                  <div>
                    <div className={styles.contactLabel}>Phone</div>
                    <div className={styles.contactValue}>{portfolio.contactPhone}</div>
                  </div>
                </a>
              )}
              {portfolio.socialLinks?.whatsapp && (
                <a href={`https://wa.me/${portfolio.socialLinks.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className={styles.contactCard}>
                  <span className={styles.contactIcon}>💬</span>
                  <div>
                    <div className={styles.contactLabel}>WhatsApp</div>
                    <div className={styles.contactValue}>Message</div>
                  </div>
                </a>
              )}
              {portfolio.socialLinks?.instagram && (
                <a href={`https://instagram.com/${portfolio.socialLinks.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className={styles.contactCard}>
                  <span className={styles.contactIcon}>📸</span>
                  <div>
                    <div className={styles.contactLabel}>Instagram</div>
                    <div className={styles.contactValue}>@{portfolio.socialLinks.instagram.replace('@', '')}</div>
                  </div>
                </a>
              )}
              {portfolio.socialLinks?.youtube && (
                <a href={portfolio.socialLinks.youtube} target="_blank" rel="noopener noreferrer" className={styles.contactCard}>
                  <span className={styles.contactIcon}>🎬</span>
                  <div>
                    <div className={styles.contactLabel}>YouTube</div>
                    <div className={styles.contactValue}>Watch highlights</div>
                  </div>
                </a>
              )}
            </div>
          </div>
        )}

        {/* Edit link */}
        <div style={{ textAlign: 'center', marginTop: '40px', paddingBottom: '20px' }}>
          <Link href={`/portfolio/edit/${portfolio.id}`} className="sec-btn" style={{ padding: '10px 24px', borderRadius: '8px' }}>
            Edit This Portfolio
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  );
}
