import React from 'react';
import type { Listing } from '../types/listing';

interface ListingCardProps {
  listing: Listing;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
  const price = listing?.price ?? 0;
  const bedrooms = listing?.bedrooms ?? 0;

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <span style={styles.cityBadge}>{listing?.city || 'Unknown'}</span>
        <span style={styles.price}>${price.toLocaleString()}</span>
      </div>

      <h3 style={styles.title}>{listing?.title || 'Untitled Property'}</h3>

      <div style={styles.metaRow}>
        <span style={styles.metaBadge}>
          🛏️ {bedrooms} {bedrooms === 1 ? 'Bed' : 'Beds'}
        </span>
      </div>

      <p style={styles.description}>{listing?.description || ''}</p>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '20px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cityBadge: {
    fontSize: '12px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: '#0284c7',
    backgroundColor: '#e0f2fe',
    padding: '4px 10px',
    borderRadius: '9999px',
  },
  price: {
    fontSize: '20px',
    fontWeight: 800,
    color: '#0f172a',
  },
  title: {
    margin: 0,
    fontSize: '18px',
    fontWeight: 700,
    color: '#1e293b',
    lineHeight: 1.3,
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  metaBadge: {
    fontSize: '13px',
    color: '#475569',
    backgroundColor: '#f1f5f9',
    padding: '4px 8px',
    borderRadius: '6px',
    fontWeight: 500,
  },
  description: {
    margin: 0,
    fontSize: '14px',
    color: '#64748b',
    lineHeight: 1.5,
  },
};