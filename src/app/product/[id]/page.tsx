'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { db, Product, Review } from '@/lib/firebase';
import { useCart } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import CartDrawer from '@/components/CartDrawer';
import Footer from '@/components/Footer';
import styles from './product-detail.module.css';

export default function ProductDetail() {
  const params = useParams();
  const id = params.id as string;

  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Specifications selectors
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedWeight, setSelectedWeight] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Review submission inputs
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Fetch product data and reviews
  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const prodData = await db.getProductById(id);
        if (prodData) {
          setProduct(prodData);
          
          // Select default size and weights based on category
          if (prodData.category === 'cricket-bats') {
            setSelectedSize('Short Handle');
            setSelectedWeight('Medium (820-840g)');
          } else if (prodData.category === 'hockey-sticks') {
            setSelectedSize('36.5\"');
            setSelectedWeight('Lightweight (525g)');
          }
          if (prodData.variants && prodData.variants.length > 0) {
            setSelectedColor(prodData.variants[0].color);
          }

          // Fetch reviews
          const revs = await db.getProductReviews(id);
          setReviews(revs);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleAdd = () => {
    if (!product) return;
    addToCart(product, quantity, selectedSize, selectedWeight, selectedColor);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewComment || !product) return;

    const newRev = await db.addReview(product.id, {
      name: reviewName,
      rating: reviewRating,
      comment: reviewComment,
    });

    setReviews((prev) => [newRev, ...prev]);
    setReviewSuccess(true);
    setReviewName('');
    setReviewComment('');
    setReviewRating(5);

    setTimeout(() => setReviewSuccess(false), 3000);
  };

  if (loading) {
    return (
      <main className={styles.page}>
        <Navbar />
        <CartDrawer />
        <div style={{ textAlign: 'center', padding: '120px 24px', color: 'var(--text-secondary)' }}>
          <p>Analyzing sports specs...</p>
        </div>
        <Footer />
      </main>
    );
  }

  if (!product) {
    return (
      <main className={styles.page}>
        <Navbar />
        <CartDrawer />
        <div className={styles.container} style={{ textAlign: 'center', padding: '120px 24px' }}>
          <h2 style={{ fontFamily: 'var(--font-headings)', fontSize: '32px', marginBottom: '16px' }}>
            Equipment Specification Not Found
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
            We could not find the specific product catalog parameters you requested.
          </p>
          <Link href="/shop" className="glow-btn" style={{ padding: '12px 30px', borderRadius: '8px' }}>
            Return to Store
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const getDisplayPrices = () => {
    if (!product) return { price: 0, originalPrice: 0 };
    if (selectedColor && product.variants && product.variants.length > 0) {
      const variant = product.variants.find(v => v.color.toLowerCase() === selectedColor.toLowerCase());
      if (variant) {
        return { 
          price: variant.price, 
          originalPrice: variant.originalPrice || product.originalPrice 
        };
      }
    }
    return { price: product.price, originalPrice: product.originalPrice };
  };
  const { price: displayPrice, originalPrice: displayOriginalPrice } = getDisplayPrices();

  const isCricketBat = product.category === 'cricket-bats';
  const isHockeyStick = product.category === 'hockey-sticks';

  return (
    <main className={styles.page}>
      <div className={styles.bgBlob1} />
      <div className={styles.bgBlob2} />
      <Navbar />
      <CartDrawer />

      <div className={styles.container}>
        {/* Back navigation */}
        <Link href="/shop" className={styles.backBtn}>
          ← Back to Catalog
        </Link>

        {/* Media and details row */}
        <div className={styles.detailGrid}>
          {/* Column Left: Media image display */}
          <div className={styles.mediaCol}>
            <Image
              unoptimized
              src={product.image}
              alt={product.name}
              width={480}
              height={480}
              className={styles.image}
              priority
            />
          </div>

          {/* Column Right: Text details & purchasing panels */}
          <div className={styles.detailsCol}>
            <div>
              <span className={styles.category}>{product.category.replace('-', ' ')}</span>
              <h1 className={styles.name}>{product.name}</h1>
              
              <div className={styles.ratingRow} style={{ marginTop: '10px' }}>
                <span className={styles.stars}>
                  {'★'.repeat(Math.round(product.rating))}
                  {'☆'.repeat(5 - Math.round(product.rating))}
                </span>
                <span className={styles.ratingText}>
                  {product.rating} stars ({reviews.length} customer reviews)
                </span>
              </div>
            </div>

            <div className={styles.priceRow}>
              <span className={styles.price}>₹{displayPrice.toLocaleString('en-IN')}</span>
              {displayPrice < displayOriginalPrice && (
                <>
                  <span className={styles.originalPrice}>₹{displayOriginalPrice.toLocaleString('en-IN')}</span>
                  <span className={styles.discount}>
                    Save ₹{(displayOriginalPrice - displayPrice).toLocaleString('en-IN')}
                  </span>
                </>
              )}
            </div>

            <p className={styles.description}>{product.description}</p>

            {/* Custom options selector lists */}
            {product.variants && product.variants.length > 0 && (
              <div className={styles.selectorGroup}>
                <div className={styles.selectorLabel}>Select Color:</div>
                <div className={styles.optionsGrid}>
                  {product.variants.map((v) => (
                    <button
                      key={v.color}
                      className={`${styles.optionBadge} ${selectedColor === v.color ? styles.optionBadgeActive : ''}`}
                      onClick={() => setSelectedColor(v.color)}
                      style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                      <span 
                        style={{ 
                          width: '12px', 
                          height: '12px', 
                          borderRadius: '50%', 
                          backgroundColor: v.color.toLowerCase().includes('white') ? '#ffffff' : v.color.toLowerCase().includes('pink') ? '#ec4899' : v.color.toLowerCase().includes('lime') ? '#bef264' : v.color.toLowerCase().includes('yellow') ? '#eab308' : '#374151',
                          border: '1px solid rgba(255,255,255,0.2)'
                        }} 
                      />
                      {v.color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {isCricketBat && (
              <>
                <div className={styles.selectorGroup}>
                  <div className={styles.selectorLabel}>Select Size:</div>
                  <div className={styles.optionsGrid}>
                    {['Short Handle', 'Size 6', 'Size 5'].map((sz) => (
                      <button
                        key={sz}
                        className={`${styles.optionBadge} ${selectedSize === sz ? styles.optionBadgeActive : ''}`}
                        onClick={() => setSelectedSize(sz)}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.selectorGroup}>
                  <div className={styles.selectorLabel}>Weight Class:</div>
                  <div className={styles.optionsGrid}>
                    {['Light (780-810g)', 'Medium (820-840g)', 'Heavy (850-890g)'].map((wt) => (
                      <button
                        key={wt}
                        className={`${styles.optionBadge} ${selectedWeight === wt ? styles.optionBadgeActive : ''}`}
                        onClick={() => setSelectedWeight(wt)}
                      >
                        {wt}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {isHockeyStick && (
              <>
                <div className={styles.selectorGroup}>
                  <div className={styles.selectorLabel}>Stick Length:</div>
                  <div className={styles.optionsGrid}>
                    {['36.5\"', '37.5\"'].map((sz) => (
                      <button
                        key={sz}
                        className={`${styles.optionBadge} ${selectedSize === sz ? styles.optionBadgeActive : ''}`}
                        onClick={() => setSelectedSize(sz)}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.selectorGroup}>
                  <div className={styles.selectorLabel}>Weight Class:</div>
                  <div className={styles.optionsGrid}>
                    {['Lightweight (525g)', 'Standard (540g)'].map((wt) => (
                      <button
                        key={wt}
                        className={`${styles.optionBadge} ${selectedWeight === wt ? styles.optionBadgeActive : ''}`}
                        onClick={() => setSelectedWeight(wt)}
                      >
                        {wt}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Quantity and Checkout Add to cart row */}
            <div className={styles.purchaseRow}>
              <div className={styles.qtySelector}>
                <button
                  className={styles.qtyBtn}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className={styles.qtyVal}>{quantity}</span>
                <button
                  className={styles.qtyBtn}
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button className={`${styles.addBtn} glow-btn`} onClick={handleAdd}>
                Add To Bag
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </button>
            </div>

            {/* Checklist verified badges card */}
            <div className={styles.featuresCard}>
              <h4 className={styles.featuresTitle}>Why Choose this ADRIN Series</h4>
              <ul className={styles.featuresList}>
                {product.features.map((feat, idx) => (
                  <li className={styles.featureItem} key={idx}>
                    <span className={styles.featureCheck}>✓</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Specifications sheet & Reviews submission row */}
        <div className={styles.bottomTabs}>
          {/* Spec sheets */}
          <div>
            <h3 className={styles.tabTitle}>Product Specs</h3>
            <table className={styles.specsTable}>
              <tbody>
                {Object.entries(product.specifications).map(([key, val]) => (
                  <tr className={styles.specRow} key={key}>
                    <td className={styles.specCellLabel}>{key}</td>
                    <td className={styles.specCellVal}>{val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Customer Reviews dynamic thread */}
          <div>
            <h3 className={styles.tabTitle}>Player Reviews ({reviews.length})</h3>

            {/* List */}
            <div style={{ maxHeight: '420px', overflowY: 'auto', paddingRight: '8px' }}>
              {reviews.map((rev) => (
                <div className={styles.reviewCard} key={rev.id}>
                  <div className={styles.reviewHeader}>
                    <span className={styles.reviewerName}>{rev.reviewerName}</span>
                    <span className={styles.reviewDate}>{rev.date}</span>
                  </div>
                  <div style={{ color: 'var(--primary)', marginBottom: '8px', fontSize: '13px' }}>
                    {'★'.repeat(rev.rating)}
                    {'☆'.repeat(5 - rev.rating)}
                  </div>
                  <p className={styles.reviewComment}>{rev.comment}</p>
                </div>
              ))}
            </div>

            {/* Form */}
            <form className={styles.reviewForm} onSubmit={handleReviewSubmit}>
              <h4 style={{ fontFamily: 'var(--font-headings)', fontSize: '16px', textTransform: 'uppercase' }}>
                Leave a Verified Review
              </h4>
              
              {reviewSuccess && (
                <p style={{ color: 'var(--primary)', fontSize: '13px', fontWeight: 600 }}>
                  Review logged successfully. Thank you for your feedback!
                </p>
              )}

              <div className={styles.formGrid}>
                <div>
                  <label htmlFor="reviewer-name-input" style={{ display: 'none' }}>Name</label>
                  <input
                    id="reviewer-name-input"
                    type="text"
                    placeholder="Your Name / Academy Club"
                    required
                    className={styles.inputField}
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                  />
                </div>

                <div className={styles.ratingSelect}>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>Stars:</span>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      className={`${styles.ratingStar} ${reviewRating >= star ? styles.ratingStarActive : ''}`}
                      onClick={() => setReviewRating(star)}
                      style={{ background: 'none', border: 'none', padding: 0 }}
                      aria-label={`Rate ${star} star`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="reviewer-comment-textarea" style={{ display: 'none' }}>Comments</label>
                <textarea
                  id="reviewer-comment-textarea"
                  placeholder="Share details of seam stability, impact shock control, or overall build performance..."
                  required
                  rows={4}
                  className={styles.inputField}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  style={{ resize: 'vertical' }}
                />
              </div>

              <button type="submit" className="glow-btn" style={{ padding: '12px 24px', borderRadius: '4px', alignSelf: 'flex-start' }}>
                Submit Review
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
