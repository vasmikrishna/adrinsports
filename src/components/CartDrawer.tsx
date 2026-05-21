'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import styles from './CartDrawer.module.css';

export const CartDrawer: React.FC = () => {
  const {
    cartItems,
    isCartOpen,
    setCartOpen,
    updateQuantity,
    removeFromCart,
    cartTotal,
    clearCart,
  } = useCart();

  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = () => {
    setIsCheckingOut(true);
    // Simulate API call to Firebase/order service
    setTimeout(() => {
      setIsCheckingOut(false);
      setCheckoutSuccess(true);
      setTimeout(() => {
        clearCart();
        setCheckoutSuccess(false);
        setCartOpen(false);
      }, 3500);
    }, 1500);
  };

  return (
    <>
      {/* Overlay Backdrop */}
      <div
        className={`${styles.overlay} ${isCartOpen ? styles.overlayOpen : ''}`}
        onClick={() => !checkoutSuccess && setCartOpen(false)}
      />

      {/* Drawer Container */}
      <div className={`${styles.drawer} ${isCartOpen ? styles.drawerOpen : ''}`}>
        {/* Success screen upon checkout completion */}
        {checkoutSuccess && (
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
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 style={{ fontFamily: 'var(--font-headings)', fontSize: '24px', marginBottom: '8px' }}>
              Order Placed!
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '16px' }}>
              Thank you for choosing ADRIN Sports. Your match-grade equipment is being prepared for shipping.
            </p>
            <p style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '12px' }}>
              Auto-closing in a moment...
            </p>
          </div>
        )}

        {/* Drawer Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            Shopping Bag
          </h2>
          <button className={styles.closeButton} onClick={() => setCartOpen(false)} aria-label="Close cart">
            ✕
          </button>
        </div>

        {/* Items List */}
        <div className={styles.content}>
          {cartItems.length === 0 ? (
            <div className={styles.emptyState}>
              <svg
                className={styles.emptyIcon}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <p className={styles.emptyText}>Your cart is completely empty</p>
              <button className={`${styles.shopBtn} glow-btn`} onClick={() => setCartOpen(false)}>
                Explore Catalog
              </button>
            </div>
          ) : (
            cartItems.map((item, index) => (
              <div className={styles.itemCard} key={`${item.product.id}-${index}`}>
                <div className={styles.itemImageContainer}>
                  <Image
                    unoptimized
                    src={item.product.image}
                    alt={item.product.name}
                    width={80}
                    height={80}
                    className={styles.itemImage}
                    priority
                  />
                </div>

                <div className={styles.itemDetails}>
                  <div>
                    <h4 className={styles.itemName}>{item.product.name}</h4>
                    {(item.selectedSize || item.selectedWeight || item.selectedColor) && (
                      <div className={styles.itemSpecs}>
                        {item.selectedColor && (
                          <span className={styles.itemSpecBadge} style={{ backgroundColor: 'rgba(190, 242, 100, 0.1)', color: 'var(--primary)', borderColor: 'rgba(190, 242, 100, 0.3)' }}>
                            Color: {item.selectedColor}
                          </span>
                        )}
                        {item.selectedSize && <span className={styles.itemSpecBadge}>Size: {item.selectedSize}</span>}
                        {item.selectedWeight && <span className={styles.itemSpecBadge}>Weight: {item.selectedWeight}</span>}
                      </div>
                    )}
                  </div>

                  <div className={styles.itemBottom}>
                    <span className={styles.itemPrice}>
                      ₹{(item.selectedColor && item.product.variants && item.product.variants.find(v => v.color.toLowerCase() === item.selectedColor?.toLowerCase())?.price || item.product.price).toLocaleString('en-IN')}
                    </span>

                    <div className={styles.qtyControls}>
                      <button
                        className={styles.qtyBtn}
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span className={styles.qtyVal}>{item.quantity}</span>
                      <button
                        className={styles.qtyBtn}
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  className={styles.removeBtn}
                  onClick={() => removeFromCart(item.product.id)}
                  aria-label="Remove item"
                >
                  <svg
                    className={styles.removeIcon}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer Billing Actions */}
        {cartItems.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.summaryRow}>
              <span>Items Subtotal</span>
              <span>₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Shipping & Handling</span>
              <span style={{ color: 'var(--primary)', fontWeight: 600 }}>FREE</span>
            </div>

            <div className={styles.totalRow}>
              <span>Grand Total</span>
              <span className={styles.totalPrice}>₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className={`${styles.checkoutBtn} glow-btn`}
            >
              {isCheckingOut ? 'Securing checkout...' : 'Proceed to Checkout'}
              {!isCheckingOut && (
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
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              )}
            </button>

            <button className={styles.clearCartBtn} onClick={clearCart}>
              Clear Bag
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
