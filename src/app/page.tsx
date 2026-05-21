'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { db, Product } from '@/lib/firebase';
import Navbar from '@/components/Navbar';
import CartDrawer from '@/components/CartDrawer';
import ProductCard from '@/components/ProductCard';
import Footer from '@/components/Footer';
import styles from './page.module.css';

interface TechItem {
  number: string;
  title: string;
  summary: string;
  description: string;
  specs: Record<string, string>;
}

const techShowcaseItems: TechItem[] = [
  {
    number: '01',
    title: 'Precision CNC Shaping',
    summary: 'Computerized shaping of high-grade bat profiles to ensure optimal sweep and exact sweet-spot nodes.',
    description: 'Every ADRIN bat starts in our advanced CNC shaping chambers. Computerized milling eliminates weight imbalances down to the millimeter, creating a blade that has optimal wood density where it counts—generating maximum sweet-spot velocity without adding drag.',
    specs: {
      'Accuracy Rating': '0.05 mm structural calibration',
      'Blade Thickness': 'Standard 38mm-40mm edges',
      'Spine Profile': 'High spine mid-to-low bow profiles',
      'Warp Tolerance': 'Zero warp compliance standard'
    }
  },
  {
    number: '02',
    title: 'High-Pressure Molding',
    summary: 'Compressed composite fibers resulting in extreme strength-to-weight ratios in our field hockey series.',
    description: 'Our composite field hockey sticks undergo rigorous high-pressure curing. We fuse premium carbon weaves, impact fiberglass, and aramid layers inside high-temp steel molds under over 12 tons of structural pressure. This eliminates hollow micro-cavities for pure energy transfer.',
    specs: {
      'Mold Pressure': '12 Tons / Square Inch',
      'Carbon Ratio': 'Up to 90% Carbon composite overlays',
      'Shaft Bowing': 'Precision 24mm low-bow curves',
      'Impact Yield': 'Over 350kg direct strike limit'
    }
  },
  {
    number: '03',
    title: 'Automated Lock-Stitching',
    summary: 'High-tension interlocking PVC seams creating durable wind balls and cricket balls that outlast traditional brands 5x.',
    description: 'ADRIN PVC wind balls utilize automated dual-locking stitch mechanics. High-tensile synthetic threads are mechanically woven deep into the compound walls, generating a raised, waterproof seam that retains its shape, bounce, and drag properties over hundreds of club matches.',
    specs: {
      'Stitch Count': '84 precision interlocking loops',
      'Tensile rating': 'Synthetic heavy-weight structural thread',
      'Waterproof': '100% moisture sealed walls',
      'Bounce Constant': '0.85 high elasticity ratio'
    }
  },
  {
    number: '04',
    title: 'Toxic-Free Curing',
    summary: 'ISO Quality and environment safe polymer treatments ensuring academy and junior friendly play.',
    description: 'We prioritize athlete health above all. Our manufacturing lines use advanced bio-derived polymers and toxic-free compounds. Safe for school systems and juniors, all bats, grips, and balls are ISI quality certified and chemical safety checked before dispatching from Jalandhar.',
    specs: {
      'Safety Standard': 'ISI & Quality Certified',
      'Chemical Safety': '100% Phthalate and BPA free',
      'Formula Type': 'Eco-polymer safe formulation',
      'Age Limit': 'Academy approved for junior play'
    }
  }
];

export default function Home() {
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [activeTechIndex, setActiveTechIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await db.queryProducts({});
        const filtered = data.filter((p) => p.isBestSeller).slice(0, 4);
        setBestSellers(filtered);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const activeTech = techShowcaseItems[activeTechIndex];

  return (
    <div className={styles.main}>
      <div className={styles.bgBlob1} />
      <div className={styles.bgBlob2} />
      <div className={styles.bgBlob3} />

      <Navbar />
      <CartDrawer />

      {/* Modern Hero Banner */}
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          <div className={styles.heroContent}>
            <span className={styles.badge}>Jalandhar Engineered</span>
            <h1 className={styles.title}>
              Unleash <br />
              <span className={styles.neonText}>Absolute Power</span>
            </h1>
            <p className={styles.subtitle}>
              Experience professional-grade cricket and hockey equipment crafted for performance, impact resistance, and maximum durability. Trusted by clubs and academies across India.
            </p>
            <div className={styles.heroBtns}>
              <Link href="/shop" className={`${styles.heroBtn} glow-btn`}>
                Shop Collection
              </Link>
              <Link href="/bulk" className={`${styles.heroBtn} sec-btn`}>
                Bulk Team Quotation
              </Link>
            </div>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.glowingCircle} />
            <Image
              src="/images/hero_cricket.png"
              alt="Premium Adrin Cricket Bat Showcase"
              width={460}
              height={460}
              className={styles.visualImage}
              priority
            />
          </div>
        </div>
      </section>

      {/* Category Split Grid */}
      <section className={styles.splitSection}>
        <div className={styles.splitGrid}>
          {/* Cricket Banner */}
          <Link href="/shop?category=cricket" className={styles.splitCard}>
            <div className={styles.splitCardBg} style={{ backgroundImage: 'url("/images/hero_cricket.png")' }} />
            <div className={styles.splitOverlay} />
            <div className={styles.splitContent}>
              <h2 className={styles.splitTitle}>Cricket Store</h2>
              <p className={styles.splitDesc}>
                Explore match-grade PVC wind balls with high-contrast seams, plastic heavy-duty batting series, wickets, protective leg guards, and batting gloves.
              </p>
              <span className={styles.splitBtn}>
                Explore bats & balls
                <span>➔</span>
              </span>
            </div>
          </Link>

          {/* Hockey Banner */}
          <Link href="/shop?category=hockey" className={styles.splitCard}>
            <div className={styles.splitCardBg} style={{ backgroundImage: 'url("/images/hero_hockey.png")' }} />
            <div className={styles.splitOverlay} />
            <div className={styles.splitContent}>
              <h2 className={styles.splitTitle}>Hockey Equipment</h2>
              <p className={styles.splitDesc}>
                Browse high-durability fiberglass composite sticks, wooden training series, dimpled waterproof match balls, and armored shin guards.
              </p>
              <span className={styles.splitBtn}>
                Browse Sticks & gear
                <span>➔</span>
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* Best Sellers Grid */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>Elite Best Sellers</h2>
            <p className={styles.sectionDesc}>
              The highest-rated match gear selected by elite players and state academies for durability under high impact.
            </p>
          </div>
          <Link href="/shop" className="sec-btn" style={{ padding: '10px 24px', borderRadius: '8px' }}>
            View All Store
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
            Loading premium catalog...
          </div>
        ) : (
          <div className={styles.productGrid}>
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Technology Showcase Section */}
      <section id="tech-showcase" className={styles.techShowcase}>
        <div className={styles.techContainer}>
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 40px' }}>
            <span className={styles.badge} style={{ alignSelf: 'center' }}>Advanced Manufacturing</span>
            <h2 className={styles.sectionTitle} style={{ marginTop: '16px' }}>How We Build Quality</h2>
            <p className={styles.sectionDesc} style={{ margin: '10px auto 0' }}>
              Step inside our Jalandhar manufacturing facilities and see the advanced tech that makes Adrin gear industry-leading.
            </p>
          </div>

          <div className={styles.techGrid}>
            {/* Left selector */}
            <div className={styles.techTabs}>
              {techShowcaseItems.map((item, idx) => (
                <button
                  key={item.number}
                  className={`${styles.techTab} ${activeTechIndex === idx ? styles.techTabActive : ''}`}
                  onClick={() => setActiveTechIndex(idx)}
                >
                  <span className={styles.techTabNumber}>{item.number}</span>
                  <div className={styles.techTabInfo}>
                    <h4>{item.title}</h4>
                    <p>{item.summary}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Right details board */}
            <div className={styles.techCard}>
              <div className={styles.techCardGlow} />
              <h3 className={styles.techCardTitle}>{activeTech.title}</h3>
              <p className={styles.techCardDesc}>{activeTech.description}</p>
              
              <div className={styles.techSpecs}>
                {Object.entries(activeTech.specs).map(([label, val]) => (
                  <div className={styles.techSpecItem} key={label}>
                    <div className={styles.techSpecLabel}>{label}</div>
                    <div className={styles.techSpecVal}>{val}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer / Academy Testimonials */}
      <section className={`${styles.section} ${styles.testimonials}`}>
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 40px' }}>
          <span className={styles.badge} style={{ alignSelf: 'center' }}>Player Voice</span>
          <h2 className={styles.sectionTitle} style={{ marginTop: '16px' }}>What Academies Say</h2>
        </div>

        <div className={styles.testiGrid}>
          <div className={styles.testiCard}>
            <div className={styles.testiStars}>★★★★★</div>
            <p className={styles.testiQuote}>
              &quot;The i-10 PVC wind balls are by far the best training balls we have ever used. They have outstanding seam grip, reliable bounce, and outlast standard PVC wind balls 5 to 1. Excellent Jalandhar craftsmanship!&quot;
            </p>
            <div className={styles.testiAuthor}>
              <div className={styles.testiAuthorInfo}>
                <h5>Captain Rohit Singh</h5>
                <p>Academy Team Leader, Mumbai</p>
              </div>
            </div>
          </div>

          <div className={styles.testiCard}>
            <div className={styles.testiStars}>★★★★★</div>
            <p className={styles.testiQuote}>
              &quot;We transitioned our whole girls under-19 league to Adrin composite sticks this tournament season. The reduction in impact shock and vibrational dampening was immediately noticeable. The bow profile is elite.&quot;
            </p>
            <div className={styles.testiAuthor}>
              <div className={styles.testiAuthorInfo}>
                <h5>Coach Harpreet Kaur</h5>
                <p>Junior League Coordinator, Ludhiana</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bulk Quote CTA Section */}
      <section className={styles.bulkCta}>
        <div className={styles.bulkContainer}>
          <h2 className={styles.bulkTitle}>Bulk Orders & Team Supplies</h2>
          <p className={styles.bulkDesc}>
            Equip your school, club, or academy with high-performance cricket and hockey gear custom-branded with your colors and logo. We offer special competitive pricing packages and fast shipping.
          </p>
          <div className={styles.bulkBtns}>
            <Link href="/bulk" className="glow-btn" style={{ padding: '16px 36px', borderRadius: '8px' }}>
              Request Custom Quote
            </Link>
            <a href="https://wa.me/917973161494" target="_blank" rel="noopener noreferrer" className="sec-btn" style={{ padding: '16px 36px', borderRadius: '8px' }}>
              WhatsApp Team Direct
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
