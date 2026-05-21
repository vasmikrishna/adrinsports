'use client';

import React, { useState } from 'react';
import styles from './ShareBar.module.css';

interface ShareBarProps {
  url: string;
  title: string;
  description?: string;
}

export const ShareBar: React.FC<ShareBarProps> = ({ url, title, description }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = url;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(`Check out ${title}'s sports portfolio on ADRIN Sports: ${url}`);
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share({
          title: `${title} — Sports Portfolio`,
          text: description || `View ${title}'s athlete portfolio on ADRIN Sports`,
          url,
        });
      } catch {
        // User cancelled share
      }
    }
  };

  return (
    <div className={styles.bar}>
      <span className={styles.label}>Share Profile</span>

      <button className={`${styles.copyBtn} ${copied ? styles.copied : ''}`} onClick={handleCopy}>
        {copied ? (
          <>
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
            Copied!
          </>
        ) : (
          <>
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
            Copy Link
          </>
        )}
      </button>

      <button className={styles.shareBtn} onClick={handleWhatsApp} aria-label="Share on WhatsApp" title="Share on WhatsApp">
        💬
      </button>

      {typeof navigator !== 'undefined' && 'share' in navigator && (
        <button className={styles.shareBtn} onClick={handleNativeShare} aria-label="Share" title="Share">
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
        </button>
      )}
    </div>
  );
};

export default ShareBar;
