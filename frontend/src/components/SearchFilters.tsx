import React, { useState } from 'react';
import type { SearchFiltersState } from '../types/listing';

interface SearchFiltersProps {
  onSearch: (filters: SearchFiltersState) => void;
  isLoading: boolean;
}

const initialFilters: SearchFiltersState = {
  minPrice: '',
  maxPrice: '',
  minBedrooms: '',
  city: '',
  keyword: '',
  targetBudget: '',
};

export const SearchFilters: React.FC<SearchFiltersProps> = ({ onSearch, isLoading }) => {
  const [filters, setFilters] = useState<SearchFiltersState>(initialFilters);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  const handleReset = () => {
    setFilters(initialFilters);
    onSearch(initialFilters);
  };

  return (
    <div style={styles.card}>
      <form onSubmit={handleSubmit}>
        <div style={styles.formGrid}>
          <div style={styles.field}>
            <label style={styles.label}>Min Price</label>
            <input
              type="number"
              name="minPrice"
              placeholder="$ Min"
              value={filters.minPrice}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Max Price</label>
            <input
              type="number"
              name="maxPrice"
              placeholder="$ Max"
              value={filters.maxPrice}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Bedrooms</label>
            <select
              name="minBedrooms"
              value={filters.minBedrooms}
              onChange={handleChange}
              style={styles.input}
            >
              <option value="">Any Beds</option>
              <option value="1">1+ Bedrooms</option>
              <option value="2">2+ Bedrooms</option>
              <option value="3">3+ Bedrooms</option>
              <option value="4">4+ Bedrooms</option>
            </select>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>City</label>
            <input
              type="text"
              name="city"
              placeholder="e.g. Austin"
              value={filters.city}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Keyword</label>
            <input
              type="text"
              name="keyword"
              placeholder="Pool, garden..."
              value={filters.keyword}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
        </div>

        <div style={styles.actions}>
          <button type="submit" disabled={isLoading} style={styles.searchBtn}>
            {isLoading ? 'Searching...' : 'Search Properties'}
          </button>
          <button type="button" onClick={handleReset} style={styles.resetBtn}>
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    marginBottom: '32px',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '16px',
    marginBottom: '20px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#334155',
  },
  input: {
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    fontSize: '14px',
    outline: 'none',
    backgroundColor: '#f8fafc',
    color: '#0f172a',
  },
  actions: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  searchBtn: {
    padding: '10px 24px',
    backgroundColor: '#0284c7',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 600,
    fontSize: '14px',
    cursor: 'pointer',
  },
  resetBtn: {
    padding: '10px 20px',
    backgroundColor: '#f1f5f9',
    color: '#475569',
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    fontWeight: 600,
    fontSize: '14px',
    cursor: 'pointer',
  },
};