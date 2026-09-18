import type { ListingResponse, SearchFiltersState } from '../types/listing';

export const fetchListings = async (
  filters: SearchFiltersState,
  cursor: string = '',
  limit: number = 6
): Promise<ListingResponse> => {
  const params = new URLSearchParams();

  if (filters.targetBudget) params.append('targetBudget', filters.targetBudget);
  if (filters.minPrice) params.append('minPrice', filters.minPrice);
  if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
  if (filters.minBedrooms) params.append('minBedrooms', filters.minBedrooms);
  if (filters.city) params.append('city', filters.city);
  if (filters.keyword) params.append('keyword', filters.keyword);

  if (cursor) params.append('cursor', cursor);
  params.append('limit', limit.toString());

  const response = await fetch(`http://localhost:8080/api/listings?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
};