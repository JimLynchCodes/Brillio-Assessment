package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"strings"
)

type Listing struct {
	ID          string  `json:"id"`
	Title       string  `json:"title"`
	Price       float64 `json:"price"`
	Bedrooms    int     `json:"bedrooms"`
	City        string  `json:"city"`
	Description string  `json:"description"`
}

type ListingResponse struct {
	Items      []Listing `json:"items"`
	NextCursor string    `json:"nextCursor"`
	HasMore    bool      `json:"hasMore"`
	Total      int       `json:"total"`
}

// In-memory dataset
var mockListings = []Listing{
	{ID: "1", Title: "Modern Downtown Condo", Price: 450000, Bedrooms: 2, City: "Austin", Description: "Luxury condo with city views and pool access."},
	{ID: "2", Title: "Cozy Suburban Home", Price: 320000, Bedrooms: 3, City: "Austin", Description: "Spacious backyard, quiet neighborhood."},
	{ID: "3", Title: "Beachfront Villa", Price: 850000, Bedrooms: 4, City: "Miami", Description: "Ocean views with private dock and modern interior."},
	{ID: "4", Title: "Compact Studio Loft", Price: 210000, Bedrooms: 1, City: "Chicago", Description: "Near metro station, freshly renovated."},
	{ID: "5", Title: "Family Residence", Price: 600000, Bedrooms: 4, City: "Austin", Description: "Large garage, modern kitchen, private pool."},
	{ID: "6", Title: "Charming Craftsman Bungalow", Price: 380000, Bedrooms: 2, City: "Seattle", Description: "Hardwood floors, renovated kitchen, and vibrant garden."},
	{ID: "7", Title: "High-rise Luxury Penthouse", Price: 1200000, Bedrooms: 3, City: "Miami", Description: "360-degree ocean skyline view with private elevator."},
	{ID: "8", Title: "Affordable Starter Home", Price: 195000, Bedrooms: 2, City: "Chicago", Description: "Great location for first-time buyers near parks."},
}

func enableCORS(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
	(*w).Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
	(*w).Header().Set("Access-Control-Allow-Headers", "Content-Type")
}

func getListingsHandler(w http.ResponseWriter, r *http.Request) {
	enableCORS(&w)

	// Handle CORS preflight options request
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	w.Header().Set("Content-Type", "application/json")

	// Parse query parameters
	query := r.URL.Query()
	minPriceStr := query.Get("minPrice")
	maxPriceStr := query.Get("maxPrice")
	minBedsStr := query.Get("minBedrooms")
	city := strings.ToLower(strings.TrimSpace(query.Get("city")))
	keyword := strings.ToLower(strings.TrimSpace(query.Get("keyword")))

	cursor := query.Get("cursor")
	limitStr := query.Get("limit")

	limit := 6
	if l, err := strconv.Atoi(limitStr); err == nil && l > 0 {
		limit = l
	}

	// Step 1: Apply Filter Logic
	filtered := make([]Listing, 0)

	for _, listing := range mockListings {
		// Min Price Filter
		if minPriceStr != "" {
			if minP, err := strconv.ParseFloat(minPriceStr, 64); err == nil {
				if listing.Price < minP {
					continue
				}
			}
		}

		// Max Price Filter
		if maxPriceStr != "" {
			if maxP, err := strconv.ParseFloat(maxPriceStr, 64); err == nil {
				if listing.Price > maxP {
					continue
				}
			}
		}

		// Min Bedrooms Filter
		if minBedsStr != "" {
			if minB, err := strconv.Atoi(minBedsStr); err == nil {
				if listing.Bedrooms < minB {
					continue
				}
			}
		}

		// City Filter
		if city != "" {
			if !strings.Contains(strings.ToLower(listing.City), city) {
				continue
			}
		}

		// Keyword Search (Matches Title or Description)
		if keyword != "" {
			titleMatch := strings.Contains(strings.ToLower(listing.Title), keyword)
			descMatch := strings.Contains(strings.ToLower(listing.Description), keyword)
			if !titleMatch && !descMatch {
				continue
			}
		}

		filtered = append(filtered, listing)
	}

	totalFilteredCount := len(filtered)

	// Step 2: Apply Cursor Pagination
	startIndex := 0
	if cursor != "" {
		for idx, item := range filtered {
			if item.ID == cursor {
				startIndex = idx + 1
				break
			}
		}
	}

	endIndex := startIndex + limit
	if endIndex > totalFilteredCount {
		endIndex = totalFilteredCount
	}

	paginatedItems := []Listing{}
	if startIndex < totalFilteredCount {
		paginatedItems = filtered[startIndex:endIndex]
	}

	// Determine next cursor token
	nextCursor := ""
	hasMore := endIndex < totalFilteredCount
	if hasMore && len(paginatedItems) > 0 {
		nextCursor = paginatedItems[len(paginatedItems)-1].ID
	}

	// Step 3: Write JSON Response
	response := ListingResponse{
		Items:      paginatedItems,
		NextCursor: nextCursor,
		HasMore:    hasMore,
		Total:      totalFilteredCount,
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}

func main() {
	http.HandleFunc("/api/listings", getListingsHandler)

	fmt.Println("Server running on http://localhost:8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}