'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { db, Product, Inquiry, Review, ProductVariant } from '@/lib/firebase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './admin.module.css';

// Admin Login credentials (with secure fallback)
const ADMIN_EMAIL = 'ckrishna@startensystems.com';
const ADMIN_PASSWORD = 'Admin@0tox2026';

export default function AdminPortal() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<'products' | 'inquiries' | 'reviews'>('products');

  // Database Data States
  const [products, setProducts] = useState<Product[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal forms states
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form Fields State
  const [prodId, setProdId] = useState('');
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState<Product['category']>('cricket-bats');
  const [prodPrice, setProdPrice] = useState(0);
  const [prodOriginalPrice, setProdOriginalPrice] = useState(0);
  const [prodImage, setProdImage] = useState('/images/hero_cricket.jpg');
  const [prodDescription, setProdDescription] = useState('');
  const [prodFeatures, setProdFeatures] = useState('');
  const [prodSpecs, setProdSpecs] = useState<Record<string, string>>({});
  const [prodVariants, setProdVariants] = useState<ProductVariant[]>([]);

  // Check login state on mount
  useEffect(() => {
    const auth = sessionStorage.getItem('adrin_admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch admin dashboard datasets when authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchAllData = async () => {
      setLoading(true);
      try {
        const [allProds, allInqs, allRevs] = await Promise.all([
          db.getProducts(),
          db.getInquiries(),
          db.getAllReviews(),
        ]);
        setProducts(allProds);
        setInquiries(allInqs);
        setReviews(allRevs);
      } catch (err) {
        console.error('Failed to load admin datasets:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [isAuthenticated]);

  // Handle Login form submit
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      sessionStorage.setItem('adrin_admin_auth', 'true');
      setIsAuthenticated(true);
    } else {
      setLoginError('Invalid Administrator credentials. Please verify username and passcode.');
    }
  };

  // Handle Logout
  const handleLogout = () => {
    sessionStorage.removeItem('adrin_admin_auth');
    setIsAuthenticated(false);
    setEmail('');
    setPassword('');
  };

  // Handle inquiry status toggle/change
  const handleInquiryStatusChange = async (inqId: string, currentStatus?: string) => {
    const nextStatusMap: Record<string, 'pending' | 'contacted' | 'completed'> = {
      'pending': 'contacted',
      'contacted': 'completed',
      'completed': 'pending'
    };
    const nextStatus = nextStatusMap[currentStatus || 'pending'] || 'pending';
    
    const success = await db.updateInquiryStatus(inqId, nextStatus);
    if (success) {
      setInquiries(prev =>
        prev.map(inq => inq.id === inqId ? { ...inq, status: nextStatus } : inq)
      );
    }
  };

  // Handle review deletion moderation
  const handleReviewDelete = async (revId: string, productId: string) => {
    if (window.confirm('Are you sure you want to remove this player review? This action cannot be undone.')) {
      const success = await db.deleteReview(revId, productId);
      if (success) {
        setReviews(prev => prev.filter(rev => rev.id !== revId));
      }
    }
  };

  // Open modal for creating product
  const handleCreateProductClick = () => {
    setEditingProduct(null);
    setProdId('adrin-' + Math.random().toString(36).substring(2, 8));
    setProdName('');
    setProdCategory('cricket-bats');
    setProdPrice(0);
    setProdOriginalPrice(0);
    setProdImage('/images/hero_cricket.jpg');
    setProdDescription('');
    setProdFeatures('');
    setProdSpecs({
      'Material': 'High-Impact Polymer Blend',
      'Standard': 'Academy Match Grade'
    });
    setProdVariants([]);
    setIsProductModalOpen(true);
  };

  // Open modal for editing product
  const handleEditProductClick = (product: Product) => {
    setEditingProduct(product);
    setProdId(product.id);
    setProdName(product.name);
    setProdCategory(product.category);
    setProdPrice(product.price);
    setProdOriginalPrice(product.originalPrice || product.price);
    setProdImage(product.image);
    setProdDescription(product.description);
    setProdFeatures(product.features.join(', '));
    setProdSpecs(product.specifications || {});
    setProdVariants(product.variants || []);
    setIsProductModalOpen(true);
  };

  // Handle variant management
  const handleAddVariant = () => {
    setProdVariants(prev => [...prev, { color: 'Neon Orange', price: prodPrice, originalPrice: prodOriginalPrice }]);
  };

  const handleUpdateVariantField = (idx: number, field: keyof ProductVariant, val: string | number) => {
    setProdVariants(prev =>
      prev.map((variant, i) => i === idx ? { ...variant, [field]: val } : variant)
    );
  };

  const handleRemoveVariant = (idx: number) => {
    setProdVariants(prev => prev.filter((_, i) => i !== idx));
  };

  // Handle local image file upload converting to Base64
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Enforce 2MB size limit to prevent extremely large payloads in Supabase DB
    const MAX_SIZE = 2 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      alert('Selected image is too large. Please upload an image smaller than 2MB to keep database synchronizations fast.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setProdImage(reader.result);
      }
    };
    reader.onerror = (error) => {
      console.error('Error reading image file:', error);
      alert('Failed to read the selected file as image.');
    };
    reader.readAsDataURL(file);
  };

  // Handle Product Create/Update form submission
  const handleProductFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const featuresArray = prodFeatures
      .split(',')
      .map(f => f.trim())
      .filter(f => f.length > 0);

    const productPayload: Omit<Product, 'rating' | 'reviewsCount'> = {
      id: prodId,
      name: prodName,
      category: prodCategory,
      price: Number(prodPrice),
      originalPrice: Number(prodOriginalPrice || prodPrice),
      description: prodDescription,
      features: featuresArray,
      specifications: prodSpecs,
      image: prodImage,
      variants: prodVariants,
      isBestSeller: editingProduct ? editingProduct.isBestSeller : false,
      isNewArrival: editingProduct ? editingProduct.isNewArrival : true
    };

    try {
      if (editingProduct) {
        const updated = await db.updateProduct(prodId, productPayload);
        setProducts(prev => prev.map(p => p.id === prodId ? updated : p));
      } else {
        const created = await db.createProduct(productPayload);
        setProducts(prev => [created, ...prev]);
      }
      setIsProductModalOpen(false);
    } catch (err) {
      console.error('Error saving product parameters:', err);
      alert('Failed to save product coordinates. Check console errors.');
    }
  };

  // Handle product deletion
  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to permanently delete this product from database inventory?')) {
      try {
        const success = await db.deleteProduct(id);
        if (success) {
          setProducts(prev => prev.filter(p => p.id !== id));
        }
      } catch (err) {
        console.error('Delete failed:', err);
      }
    }
  };

  // Helper stats
  const totalProducts = products.length;
  const pendingInquiries = inquiries.filter(i => !i.status || i.status === 'pending').length;
  const completedInquiries = inquiries.filter(i => i.status === 'completed').length;
  const totalReviews = reviews.length;

  return (
    <main className={styles.page}>
      {!isAuthenticated ? (
        /* Login Screen Panel */
        <div className={styles.loginContainer}>
          <div className={styles.loginCard}>
            <Link href="/" className={styles.backToStore}>
              ← Back to Storefront
            </Link>
            <h2 className={styles.loginTitle}>ADRIN Admin Portal</h2>
            <p className={styles.loginSubtitle}>Access control database validation system.</p>

            {loginError && <div className={styles.errorAlert}>{loginError}</div>}

            <form onSubmit={handleLoginSubmit}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="email-input">
                  Admin Email Address
                </label>
                <input
                  id="email-input"
                  type="email"
                  placeholder="name@startensystems.com"
                  required
                  className={styles.inputField}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="password-input">
                  Admin Passcode
                </label>
                <input
                  id="password-input"
                  type="password"
                  placeholder="••••••••••••"
                  required
                  className={styles.inputField}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>

              <button type="submit" className={`${styles.loginBtn} glow-btn`}>
                Verify Authenticity
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* Authenticated Admin Dashboard Workspace */
        <div className={styles.dashboard}>
          {/* Header row */}
          <div className={styles.dashHeader}>
            <div className={styles.dashTitleInfo}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <Link href="/" className={styles.backToStore} style={{ marginBottom: 0 }}>
                  ← Back to Storefront
                </Link>
                <span style={{ color: 'rgba(255,255,255,0.15)' }}>|</span>
                <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase' }}>ADMIN MODE</span>
              </div>
              <h1>ADRIN E-Commerce Control Center</h1>
              <p>Welcome back, Administrator. Real-time sports equipment catalog & order systems console.</p>
            </div>
            <button className={styles.logoutBtn} onClick={handleLogout}>
              Logout Control Panel
            </button>
          </div>

          {/* Stat metrics Row */}
          <div className={styles.statsRow}>
            <div className={`${styles.statCard} ${styles.statPrimaryGlow}`}>
              <span className={styles.statLabel}>Database Inventory</span>
              <span className={styles.statValue}>{totalProducts} Products</span>
            </div>
            <div className={styles.statCard} style={{ borderLeft: '3px solid #f59e0b' }}>
              <span className={styles.statLabel}>Pending Inquiries</span>
              <span className={styles.statValue}>{pendingInquiries} Orders</span>
            </div>
            <div className={styles.statCard} style={{ borderLeft: '3px solid #10b881' }}>
              <span className={styles.statLabel}>Fulfilled Inquiries</span>
              <span className={styles.statValue}>{completedInquiries} Closed</span>
            </div>
            <div className={styles.statCard} style={{ borderLeft: '3px solid #3b82f6' }}>
              <span className={styles.statLabel}>Verified Player Reviews</span>
              <span className={styles.statValue}>{totalReviews} Reviews</span>
            </div>
          </div>

          {/* Navigation tabs */}
          <div className={styles.tabsContainer}>
            <button
              className={`${styles.tabBtn} ${activeTab === 'products' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('products')}
            >
              Inventory Manager
            </button>
            <button
              className={`${styles.tabBtn} ${activeTab === 'inquiries' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('inquiries')}
            >
              Inquiry & Bulk Orders ({pendingInquiries})
            </button>
            <button
              className={`${styles.tabBtn} ${activeTab === 'reviews' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Review Moderation
            </button>
          </div>

          {/* Main workspace display card */}
          <div className={styles.workspace}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-secondary)' }}>
                Syncing Supabase database tables...
              </div>
            ) : (
              <>
                {/* 1. PRODUCTS TAB */}
                {activeTab === 'products' && (
                  <div>
                    <div className={styles.workspaceHeader}>
                      <h2 className={styles.workspaceTitle}>Product Catalog List</h2>
                      <button className="glow-btn" onClick={handleCreateProductClick} style={{ padding: '8px 16px', borderRadius: '6px' }}>
                        + Add Custom Product
                      </button>
                    </div>

                    <div className={styles.tableContainer}>
                      <table className={styles.table}>
                        <thead>
                          <tr>
                            <th>Product Info</th>
                            <th>Category</th>
                            <th>Pricing parameters</th>
                            <th>Color Variants</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {products.map(product => (
                            <tr key={product.id}>
                              <td>
                                <div className={styles.prodRowInfo}>
                                  <Image
                                    unoptimized
                                    src={product.image}
                                    alt={product.name}
                                    width={40}
                                    height={40}
                                    className={styles.prodThumb}
                                  />
                                  <div>
                                    <strong style={{ display: 'block', color: 'var(--text-primary)' }}>{product.name}</strong>
                                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>ID: {product.id}</span>
                                  </div>
                                </div>
                              </td>
                              <td style={{ textTransform: 'capitalize' }}>
                                {product.category.replace('-', ' ')}
                              </td>
                              <td>
                                <span style={{ fontWeight: 600, color: 'var(--primary)' }}>₹{product.price}</span>
                                {product.originalPrice > product.price && (
                                  <span style={{ textDecoration: 'line-through', fontSize: '12px', color: 'var(--text-secondary)', marginLeft: '6px' }}>
                                    ₹{product.originalPrice}
                                  </span>
                                )}
                              </td>
                              <td>
                                {product.variants && product.variants.length > 0 ? (
                                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                    {product.variants.map((v, i) => (
                                      <span
                                        key={i}
                                        className={styles.badge}
                                        style={{ backgroundColor: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)', border: '1px solid rgba(255,255,255,0.1)' }}
                                      >
                                        {v.color} (₹{v.price})
                                      </span>
                                    ))}
                                  </div>
                                ) : (
                                  <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Standard Color Only</span>
                                )}
                              </td>
                              <td>
                                <div className={styles.actionGroup}>
                                  <button className={styles.editBtn} onClick={() => handleEditProductClick(product)}>
                                    Edit Details
                                  </button>
                                  <button className={styles.deleteBtn} onClick={() => handleDeleteProduct(product.id)}>
                                    Remove
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 2. INQUIRIES TAB */}
                {activeTab === 'inquiries' && (
                  <div>
                    <div className={styles.workspaceHeader}>
                      <h2 className={styles.workspaceTitle}>Bulk Inquiry Feed</h2>
                    </div>

                    <div className={styles.tableContainer}>
                      {inquiries.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                          No customer inquiries filed yet.
                        </div>
                      ) : (
                        <table className={styles.table}>
                          <thead>
                            <tr>
                              <th>Date</th>
                              <th>Customer & Organization</th>
                              <th>Quantity & Category</th>
                              <th>Notes & Spec overrides</th>
                              <th>Status Pill</th>
                            </tr>
                          </thead>
                          <tbody>
                            {inquiries.map(inq => (
                              <tr key={inq.id}>
                                <td>
                                  {new Date(inq.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </td>
                                <td>
                                  <strong style={{ display: 'block', color: 'var(--text-primary)' }}>{inq.name}</strong>
                                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block' }}>{inq.email} | {inq.phone}</span>
                                  {inq.organization && (
                                    <span className={styles.badge} style={{ marginTop: '4px', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.2)' }}>
                                      {inq.organization}
                                    </span>
                                  )}
                                </td>
                                <td>
                                  <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{inq.quantity} units</span>
                                  <span style={{ display: 'block', fontSize: '12px', textTransform: 'capitalize', color: 'var(--text-secondary)' }}>
                                    {inq.category.replace('-', ' ')}
                                  </span>
                                </td>
                                <td style={{ maxWidth: '300px' }}>
                                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>{inq.notes || 'No notes left.'}</p>
                                  {inq.brandingRequired && (
                                    <span className={styles.badge} style={{ marginTop: '6px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b881', border: '1px solid rgba(16,185,129,0.2)' }}>
                                      Custom Logo Branding Requested
                                    </span>
                                  )}
                                </td>
                                <td>
                                  <button
                                    onClick={() => handleInquiryStatusChange(inq.id, inq.status)}
                                    className={`${styles.statusBtn} ${
                                      inq.status === 'completed'
                                        ? styles.badgeCompleted
                                        : inq.status === 'contacted'
                                        ? styles.badgeContacted
                                        : styles.badgePending
                                    }`}
                                    style={{ border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                                    title="Click to cycle status"
                                  >
                                    <span className={styles.badge} style={{ fontSize: '11px', textTransform: 'uppercase' }}>
                                      {inq.status || 'pending'}
                                    </span>
                                    <span style={{ fontSize: '8px', opacity: 0.6, marginTop: '2px' }}>Cycle Status</span>
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                )}

                {/* 3. REVIEWS TAB */}
                {activeTab === 'reviews' && (
                  <div>
                    <div className={styles.workspaceHeader}>
                      <h2 className={styles.workspaceTitle}>Customer Reviews Moderation</h2>
                    </div>

                    <div className={styles.tableContainer}>
                      {reviews.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                          No player reviews logged.
                        </div>
                      ) : (
                        <table className={styles.table}>
                          <thead>
                            <tr>
                              <th>Product ID</th>
                              <th>Reviewer Details</th>
                              <th>Stars</th>
                              <th>Comment text</th>
                              <th>Controls</th>
                            </tr>
                          </thead>
                          <tbody>
                            {reviews.map(rev => (
                              <tr key={rev.id}>
                                <td>
                                  <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{rev.productId}</span>
                                </td>
                                <td>
                                  <strong>{rev.reviewerName}</strong>
                                  <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)' }}>{rev.date}</span>
                                </td>
                                <td>
                                  <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>
                                    {'★'.repeat(rev.rating)}
                                    {'☆'.repeat(5 - rev.rating)}
                                  </span>
                                </td>
                                <td>
                                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '400px' }}>
                                    {rev.comment}
                                  </p>
                                </td>
                                <td>
                                  <button className={styles.deleteBtn} onClick={() => handleReviewDelete(rev.id, rev.productId)}>
                                    Delete Review
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Product ADD/EDIT Modal */}
      {isProductModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {editingProduct ? `Edit ${editingProduct.name} parameters` : 'Create Custom Product coordinate'}
              </h3>
              <button className={styles.closeModalBtn} onClick={() => setIsProductModalOpen(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleProductFormSubmit}>
              {/* Product ID and Name */}
              <div className={styles.gridTwo}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel} htmlFor="prod-id-input">Unique Product ID URL slug</label>
                  <input
                    id="prod-id-input"
                    type="text"
                    required
                    disabled={!!editingProduct}
                    className={styles.inputField}
                    value={prodId}
                    onChange={e => setProdId(e.target.value)}
                    placeholder="e.g. adrin-neon-bat"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel} htmlFor="prod-name-input">Product Display Name</label>
                  <input
                    id="prod-name-input"
                    type="text"
                    required
                    className={styles.inputField}
                    value={prodName}
                    onChange={e => setProdName(e.target.value)}
                    placeholder="e.g. Adrin Striker Pro 2026"
                  />
                </div>
              </div>

              {/* Category & Thumbnail Image */}
              <div className={styles.gridTwo}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel} htmlFor="prod-category-select">Product Category</label>
                  <select
                    id="prod-category-select"
                    className={styles.inputField}
                    value={prodCategory}
                    onChange={e => setProdCategory(e.target.value as any)}
                  >
                    <option value="cricket-bats">Cricket Bats</option>
                    <option value="cricket-balls">Cricket Balls</option>
                    <option value="cricket-gear">Cricket Gear & Guards</option>
                    <option value="hockey-sticks">Hockey Sticks</option>
                    <option value="hockey-balls">Hockey Balls</option>
                    <option value="hockey-gear">Hockey Accessories & Guards</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Product Display Image</label>
                  <div className={styles.imageUploadContainer}>
                    {/* Live Preview Wrapper */}
                    <div className={styles.imagePreviewWrapper}>
                      {prodImage ? (
                        <Image
                          unoptimized
                          src={prodImage}
                          alt="Product Preview"
                          width={72}
                          height={72}
                          className={styles.imagePreview}
                        />
                      ) : (
                        <span className={styles.imagePreviewPlaceholder}>No image</span>
                      )}
                    </div>

                    {/* Image Selector Controls */}
                    <div className={styles.imageUploadControls}>
                      <button
                        type="button"
                        className={styles.uploadFileBtn}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="17 8 12 3 7 8" />
                          <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                        Upload Local File
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleImageFileChange}
                      />
                      <span className={styles.uploadHelperText}>
                        Or paste direct link / relative public path below:
                      </span>
                      <input
                        id="prod-image-input"
                        type="text"
                        required
                        className={styles.inputField}
                        value={prodImage}
                        onChange={e => setProdImage(e.target.value)}
                        placeholder="/images/hero_cricket.jpg"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Standard pricing */}
              <div className={styles.gridTwo}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel} htmlFor="prod-price-input">Base Price (INR)</label>
                  <input
                    id="prod-price-input"
                    type="number"
                    required
                    className={styles.inputField}
                    value={prodPrice}
                    onChange={e => setProdPrice(Number(e.target.value))}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel} htmlFor="prod-original-price-input">Original Price (INR)</label>
                  <input
                    id="prod-original-price-input"
                    type="number"
                    required
                    className={styles.inputField}
                    value={prodOriginalPrice}
                    onChange={e => setProdOriginalPrice(Number(e.target.value))}
                  />
                </div>
              </div>

              {/* Features array input */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="prod-features-textarea">Key Features (comma-separated points)</label>
                <input
                  id="prod-features-textarea"
                  type="text"
                  className={styles.inputField}
                  value={prodFeatures}
                  onChange={e => setProdFeatures(e.target.value)}
                  placeholder="e.g. Regulation match weight, Low deflection low bow shaft, Double vulcanized handle rubber"
                />
              </div>

              {/* Product description */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="prod-description-textarea">Technical Description</label>
                <textarea
                  id="prod-description-textarea"
                  rows={3}
                  required
                  className={styles.textareaField}
                  value={prodDescription}
                  onChange={e => setProdDescription(e.target.value)}
                  placeholder="Detailed layout of manufacturing composite specs, shock damping profile and tournament usability metrics."
                />
              </div>

              {/* Specifications setup */}
              <div className={styles.variantSection}>
                <h4 style={{ margin: 0, fontFamily: 'var(--font-headings)', fontSize: '13px', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                  Technical Spec Sheet Sheet (Key/Value pairs)
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
                  {Object.entries(prodSpecs).map(([key, val]) => (
                    <div key={key} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', color: 'var(--primary)', minWidth: '100px', fontWeight: 600 }}>{key}:</span>
                      <input
                        id={`prod-specs-input-${key}`}
                        type="text"
                        className={styles.inputField}
                        value={val}
                        onChange={e => setProdSpecs(prev => ({ ...prev, [key]: e.target.value }))}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* COLOR VARIANTS WITH UNIQUE PRICING */}
              <div className={styles.variantSection}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ margin: 0, fontFamily: 'var(--font-headings)', fontSize: '13px', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                    Color Variants & Differential Pricing
                  </h4>
                  <button type="button" className="glow-btn" onClick={handleAddVariant} style={{ padding: '4px 10px', fontSize: '11px', borderRadius: '4px' }}>
                    + Add Color Variant
                  </button>
                </div>

                {prodVariants.length === 0 ? (
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px', margin: 0 }}>
                    Standard product model. No differential pricing variants exist yet.
                  </p>
                ) : (
                  <div className={styles.variantList}>
                    {prodVariants.map((variant, idx) => (
                      <div className={styles.variantItem} key={idx}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <label className={styles.formLabel} style={{ fontSize: '9px' }} htmlFor={`variant-color-${idx}`}>Color Name</label>
                          <input
                            id={`variant-color-${idx}`}
                            type="text"
                            placeholder="e.g. Neon Pink"
                            className={styles.inputField}
                            value={variant.color}
                            onChange={e => handleUpdateVariantField(idx, 'color', e.target.value)}
                          />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <label className={styles.formLabel} style={{ fontSize: '9px' }} htmlFor={`variant-price-${idx}`}>Price (₹)</label>
                          <input
                            id={`variant-price-${idx}`}
                            type="number"
                            placeholder="Price"
                            className={styles.inputField}
                            value={variant.price}
                            onChange={e => handleUpdateVariantField(idx, 'price', Number(e.target.value))}
                          />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <label className={styles.formLabel} style={{ fontSize: '9px' }} htmlFor={`variant-original-price-${idx}`}>Orig Price (₹)</label>
                          <input
                            id={`variant-original-price-${idx}`}
                            type="number"
                            placeholder="Orig Price"
                            className={styles.inputField}
                            value={variant.originalPrice || ''}
                            onChange={e => handleUpdateVariantField(idx, 'originalPrice', Number(e.target.value))}
                          />
                        </div>
                        <button type="button" className={styles.deleteBtn} onClick={() => handleRemoveVariant(idx)} style={{ alignSelf: 'flex-end', padding: '10px 14px' }}>
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Form Action buttons */}
              <div className={styles.formActions}>
                <button type="button" className={styles.editBtn} onClick={() => setIsProductModalOpen(false)}>
                  Cancel changes
                </button>
                <button type="submit" className="glow-btn" style={{ padding: '10px 24px', borderRadius: '6px' }}>
                  {editingProduct ? 'Save Inventory Product' : 'Initialize Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </main>
  );
}
