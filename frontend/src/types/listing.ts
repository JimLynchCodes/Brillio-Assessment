export interface Listing {
  id: string;
  title: string;
  price: number;
  bedrooms: number;
  city: string;
  description: string;
}

export interface SearchFiltersState {
  minPrice: string;
  maxPrice: string;
  minBedrooms: string;
  city: string;
  keyword: string;
  targetBudget: string;
}

export interface SearchResponse {
  items: Listing[];
  nextCursor: string;
  hasMore: boolean;
  total: number;
}