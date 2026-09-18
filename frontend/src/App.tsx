import React, { useEffect, useState } from 'react';
import { fetchListings } from './api/listingsApi';
import { ListingCard } from './components/ListingCard';
import { SearchFilters } from './components/SearchFilters';
import type { Listing, SearchFiltersState } from './types/listing';

const initialFilters: SearchFiltersState = {
  minPrice: '',
  maxPrice: '',
  minBedrooms: '',
  city: '',
  keyword: '',
  targetBudget: '',
};

export default function App() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [filters, setFilters] = useState<SearchFiltersState>(initialFilters);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);

  const loadData = async (currentFilters: SearchFiltersState) => {
    setLoading(true);
    try {
      const data = await fetchListings(currentFilters);
      setListings(data.items);
      setTotal(data.total);
    } catch (err) {
      console.error('Failed to load listings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(filters);
  }, []);

  const handleSearch = (newFilters: SearchFiltersState) => {
    setFilters(newFilters);
    loadData(newFilters);
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.heading}>Property Search</h1>
        <p style={styles.subheading}>
          Discover homes and apartments available in your target area.
        </p>
      </header>

      <SearchFilters onSearch={handleSearch} isLoading={loading} />

      <div style={styles.metaRow}>
        <span style={styles.totalText}>
          Showing {listings.length} of {total} properties
        </span>
      </div>

      <div style={styles.grid}>
        {listings.map((item) => (
          <ListingCard key={item.id} listing={item} />
        ))}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  },
  header: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  heading: {
    fontSize: '32px',
    fontWeight: 800,
    color: '#0f172a',
    margin: '0 0 8px 0',
  },
  subheading: {
    fontSize: '16px',
    color: '#64748b',
    margin: 0,
  },
  metaRow: {
    marginBottom: '16px',
  },
  totalText: {
    fontSize: '14px',
    color: '#64748b',
    fontWeight: 500,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '24px',
  },
};