import React, { useState, useEffect, useCallback } from 'react';
import type { Listing, SearchFiltersState } from './types/listing';
import { fetchListings } from './api/listingsApi';
import { SearchFilters } from './components/SearchFilters';
import { ListingCard } from './components/ListingCard';

const initialFilters: SearchFiltersState = {
  minPrice: '',
  maxPrice: '',
  minBedrooms: '',
  city: '',
  keyword: '',
  targetBudget: '',
};

export const App: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [filters, setFilters] = useState<SearchFiltersState>(initialFilters);
  const [cursor, setCursor] = useState<string>('');
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async (activeFilters: SearchFiltersState, nextCursor: string = '') => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchListings(activeFilters, nextCursor, 6);

      if (nextCursor) {
        setListings((prev) => [...prev, ...response.items]);
      } else {
        setListings(response.items ?? []);
      }

      setCursor(response.nextCursor || '');
      setHasMore(response.hasMore);
      setTotal(response.total);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error fetching listings');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData(initialFilters, '');
  }, [loadData]);

  const handleSearch = (newFilters: SearchFiltersState) => {
    setFilters(newFilters);
    setCursor('');
    loadData(newFilters, '');
  };

  const handleLoadMore = () => {
    if (cursor && !isLoading) {
      loadData(filters, cursor);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.title}>Property Search</h1>
          <p style={styles.subtitle}>Discover homes and apartments available in your target area.</p>
        </header>

        <SearchFilters onSearch={handleSearch} isLoading={isLoading} />

        {error && <div style={styles.errorAlert}>⚠️ {error}</div>}

        <div style={styles.resultsBar}>
          <span style={styles.resultsCount}>
            Showing <strong>{listings.length}</strong> of <strong>{total}</strong> properties
          </span>
        </div>

        <div style={styles.grid}>
          {listings.map((item) => (
            <ListingCard key={item.id} listing={item} />
          ))}
        </div>

        {!isLoading && listings.length === 0 && !error && (
          <div style={styles.emptyCard}>
            <h3>No matching listings found</h3>
            <p>Try clearing filters or broadening your search criteria.</p>
          </div>
        )}

        {hasMore && (
          <div style={styles.paginationWrapper}>
            <button onClick={handleLoadMore} disabled={isLoading} style={styles.loadMoreBtn}>
              {isLoading ? 'Loading...' : 'Load More Listings'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    padding: '40px 16px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
  },
  header: {
    marginBottom: '28px',
  },
  title: {
    margin: '0 0 8px 0',
    fontSize: '32px',
    fontWeight: 800,
    color: '#0f172a',
    letterSpacing: '-0.02em',
  },
  subtitle: {
    margin: 0,
    fontSize: '16px',
    color: '#64748b',
  },
  resultsBar: {
    marginBottom: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultsCount: {
    fontSize: '14px',
    color: '#64748b',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px',
  },
  errorAlert: {
    padding: '14px 18px',
    backgroundColor: '#fef2f2',
    color: '#991b1b',
    border: '1px solid #fecaca',
    borderRadius: '8px',
    marginBottom: '24px',
    fontSize: '14px',
  },
  emptyCard: {
    textAlign: 'center',
    padding: '48px 24px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px dashed #cbd5e1',
    color: '#64748b',
    marginTop: '16px',
  },
  paginationWrapper: {
    marginTop: '36px',
    display: 'flex',
    justifyContent: 'center',
  },
  loadMoreBtn: {
    padding: '12px 28px',
    backgroundColor: '#0f172a',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 600,
    fontSize: '14px',
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
};

export default App;