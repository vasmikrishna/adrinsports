'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import Navbar from '@/components/Navbar';
import CartDrawer from '@/components/CartDrawer';
import Footer from '@/components/Footer';
import styles from './bulk.module.css';

export default function BulkInquiry() {
  // Form input states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [organization, setOrganization] = useState('');
  const [category, setCategory] = useState('cricket-bats');
  const [notes, setNotes] = useState('');
  const [brandingRequired, setBrandingRequired] = useState(false);
  const [quantity, setQuantity] = useState(50);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Bulk Discount calculation factors
  const getAveragePricePerItem = (cat: string) => {
    switch (cat) {
      case 'cricket-bats':
        return 650; // Average cost of premium PVC bats
      case 'cricket-balls':
        return 140; // Average cost of wind/leatherette balls
      case 'hockey-sticks':
        return 2000; // Average cost of fiberglass composite sticks
      case 'hockey-balls':
        return 130; // Average cost of polyurethane balls
      default:
        return 800; // Mixed equipment average cost
    }
  };

  const getDiscountPercentage = (qty: number) => {
    if (qty < 10) return 0;
    if (qty < 50) return 10;   // 10-49 units
    if (qty < 100) return 15;  // 50-99 units
    if (qty < 250) return 25;  // 100-249 units
    return 35;                 // 250+ units (Maximum discount)
  };

  const unitPrice = getAveragePricePerItem(category);
  const discountPercent = getDiscountPercentage(quantity);
  const rawSubtotal = unitPrice * quantity;
  const savings = Math.round(rawSubtotal * (discountPercent / 100));
  const finalBudgetEstimate = rawSubtotal - savings;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !organization) return;

    setIsSubmitting(true);
    try {
      await db.submitInquiry({
        name,
        email,
        phone,
        organization,
        category,
        quantity,
        notes,
        brandingRequired,
      });

      setSubmitted(true);
      // Reset form fields
      setName('');
      setEmail('');
      setPhone('');
      setOrganization('');
      setNotes('');
      setBrandingRequired(false);
      setQuantity(50);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.bgBlob1} />
      <div className={styles.bgBlob2} />
      <Navbar />
      <CartDrawer />

      <div className={styles.container}>
        {/* Page Header */}
        <div className={styles.header}>
          <span className={`${styles.badge} badge`} style={{ display: 'inline-flex' }}>
            Academy & Club Supplies
          </span>
          <h1 className={styles.title}>Bulk Orders Quoting Hub</h1>
          <p className={styles.subtitle}>
            Equip your squad with Jalandhar-engineered match-grade cricket bats, wind balls, or field hockey sticks. Slide quantities to view dynamic scaling discounts.
          </p>
        </div>

        {submitted ? (
          /* Success display card */
          <div className={styles.formCard} style={{ maxWidth: '640px', margin: '0 auto' }}>
            <div className={styles.successOverlay}>
              <svg
                className={styles.successIcon}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h2 className={styles.successTitle}>Enquiry Successfully Logged!</h2>
              <p className={styles.successDesc}>
                Thank you. We have recorded your bulk quotation specifications. Our Jalandhar distribution team will review pricing plans and reach out to your club email in under 24 hours.
              </p>
              <button className={`${styles.successBtn} glow-btn`} onClick={() => setSubmitted(false)}>
                Submit New Inquiry
              </button>
            </div>
          </div>
        ) : (
          /* General columns split layout */
          <div className={styles.grid}>
            {/* Left: Input fields */}
            <div className={styles.formCard}>
              <h2 className={styles.formTitle}>Quotation Specifications</h2>
              <form onSubmit={handleSubmit}>
                <div className={styles.formGroupDouble}>
                  <div className={styles.formGroup}>
                    <label htmlFor="bulk-name-input" className={styles.label}>Full Name *</label>
                    <input
                      id="bulk-name-input"
                      type="text"
                      placeholder="e.g. Coach Sandeep Sharma"
                      required
                      className={styles.input}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="bulk-email-input" className={styles.label}>Contact Email *</label>
                    <input
                      id="bulk-email-input"
                      type="email"
                      placeholder="e.g. sandeep@ludhianaclub.com"
                      required
                      className={styles.input}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className={styles.formGroupDouble}>
                  <div className={styles.formGroup}>
                    <label htmlFor="bulk-phone-input" className={styles.label}>Phone / Mobile *</label>
                    <input
                      id="bulk-phone-input"
                      type="tel"
                      placeholder="e.g. +91 98558 37914"
                      required
                      className={styles.input}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="bulk-org-input" className={styles.label}>Club / Academy / School *</label>
                    <input
                      id="bulk-org-input"
                      type="text"
                      placeholder="e.g. Jalandhar Junior Sports Academy"
                      required
                      className={styles.input}
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                    />
                  </div>
                </div>

                <div className={styles.formGroupDouble}>
                  <div className={styles.formGroup}>
                    <label htmlFor="bulk-category-select" className={styles.label}>Equipment Category *</label>
                    <select
                      id="bulk-category-select"
                      className={`${styles.input} styles.select`}
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="cricket-bats">Cricket Bats (PVC Performance)</option>
                      <option value="cricket-balls">Cricket Balls (i-10 PVC Wind Series)</option>
                      <option value="hockey-sticks">Field Hockey Sticks (Carbon Composite)</option>
                      <option value="hockey-balls">Hockey Balls (Dimpled Polyurethane)</option>
                      <option value="all-mixed">Mixed Equipment Supplies</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    {/* Glowing Volume Range Slider */}
                    <div className={styles.sliderWrapper}>
                      <div className={styles.sliderHeader}>
                        <label htmlFor="bulk-quantity-slider" className={styles.label}>Volume Quantity:</label>
                        <span className={styles.sliderVal}>{quantity} Items</span>
                      </div>
                      <input
                        id="bulk-quantity-slider"
                        type="range"
                        min="10"
                        max="1000"
                        step="5"
                        className={styles.rangeInput}
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="bulk-notes-textarea" className={styles.label}>Special Requirements / Sizing Splits</label>
                  <textarea
                    id="bulk-notes-textarea"
                    placeholder="Specify sizes/weights split (e.g. 30 Short Handle bats, 20 Size 5 bats, customized handle wraps...)"
                    rows={4}
                    className={`${styles.input} styles.textarea`}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={`${styles.checkboxGroup} ${styles.label}`}>
                    <input
                      type="checkbox"
                      className={styles.checkbox}
                      checked={brandingRequired}
                      onChange={(e) => setBrandingRequired(e.target.checked)}
                    />
                    Add Custom Club Branding (Custom Logo Embossing)
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`${styles.submitBtn} glow-btn`}
                >
                  {isSubmitting ? 'Logging specifications...' : 'Submit Bulk Enquiry'}
                </button>
              </form>
            </div>

            {/* Right: Dynamic Cost Calculator card */}
            <div className={styles.calcCard}>
              <h2 className={styles.calcTitle}>
                <svg
                  className={styles.calcIcon}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                Budget Calculator
              </h2>

              <div className={styles.calcRow}>
                <span>Average Standard Price</span>
                <span>₹{unitPrice} / Unit</span>
              </div>

              <div className={styles.calcRow}>
                <span>Standard Subtotal</span>
                <span>₹{rawSubtotal.toLocaleString('en-IN')}</span>
              </div>

              <div className={styles.calcRow}>
                <span>Volume Discount Rate</span>
                <span className={styles.calcValDiscount}>-{discountPercent}%</span>
              </div>

              <div className={`${styles.calcRow} styles.calcRowActive`}>
                <span>Estimated Volume Savings</span>
                <span className={styles.calcValHighlight}>- ₹{savings.toLocaleString('en-IN')}</span>
              </div>

              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>Estimated Budget</span>
                <span className={styles.totalVal}>₹{finalBudgetEstimate.toLocaleString('en-IN')}</span>
              </div>

              {/* Tiers display indicators */}
              <div className={styles.tiersList}>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
                  Volume Discount Tiers
                </div>
                <div className={`${styles.tierBadge} ${quantity >= 10 && quantity < 50 ? styles.tierBadgeActive : ''}`}>
                  <span>10 - 49 Items</span>
                  <span>10% OFF</span>
                </div>
                <div className={`${styles.tierBadge} ${quantity >= 50 && quantity < 100 ? styles.tierBadgeActive : ''}`}>
                  <span>50 - 99 Items</span>
                  <span>15% OFF</span>
                </div>
                <div className={`${styles.tierBadge} ${quantity >= 100 && quantity < 250 ? styles.tierBadgeActive : ''}`}>
                  <span>100 - 249 Items</span>
                  <span>25% OFF</span>
                </div>
                <div className={`${styles.tierBadge} ${quantity >= 250 ? styles.tierBadgeActive : ''}`}>
                  <span>250+ Items</span>
                  <span>35% OFF (Max Savings)</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
