import React from 'react';

interface PaginationProps {
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  totalResults: number;
  currentCount: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  hasMore,
  isLoading,
  onLoadMore,
  totalResults,
  currentCount,
}) => {
  return (
    <div style={styles.container}>
      <p style={styles.counterText}>
        Showing <strong>{currentCount}</strong> of <strong>{totalResults}</strong> listings
      </p>

      {hasMore && (
        <button
          onClick={onLoadMore}
          disabled={isLoading}
          style={{
            ...styles.loadMoreBtn,
            opacity: isLoading ? 0.6 : 1,
            cursor: isLoading ? 'not-allowed' : 'pointer',
          }}
        >
          {isLoading ? 'Loading More...' : 'Load More Listings'}
        </button>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    marginTop: '32px',
    paddingTop: '16px',
    borderTop: '1px solid #e2e8f0',
  },
  counterText: {
    margin: 0,
    fontSize: '14px',
    color: '#64748b',
  },
  loadMoreBtn: {
    padding: '12px 28px',
    backgroundColor: '#0f172a',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: 600,
    transition: 'background-color 0.2s ease',
  },
};