package main

import (
	"encoding/json"
	"fmt"
	"math"
	"net/http"
	"sort"
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
	Score       float64 `json:"score"`
}

type ListingResponse struct {
	Items        []Listing `json:"items"`
	NextCursor   string    `json:"nextCursor"`
	HasMore      bool      `json:"hasMore"`
	Total        int       `json:"total"`
	TargetBudget *float64  `json:"targetBudget,omitempty"`
}

var mockListings = []Listing{
	{
		ID:          "1",
		Title:       "Modern Downtown Condo",
		Price:       450000,
		Bedrooms:    2,
		City:        "Austin",
		Description: "Luxury condo with city views and pool access.",
	},
	{
		ID:          "2",
		Title:       "Cozy Suburban Home",
		Price:       320000,
		Bedrooms:    3,
		City:        "Austin",
		Description: "Spacious backyard, quiet neighborhood.",
	},
	{
		ID:          "3",
		Title:       "Beachfront Villa",
		Price:       850000,
		Bedrooms:    4,
		City:        "Miami",
		Description: "Ocean views with private dock and modern interior.",
	},
	{
		ID:          "4",
		Title:       "Compact Studio Loft",
		Price:       210000,
		Bedrooms:    1,
		City:        "Chicago",
		Description: "Near metro station, freshly renovated.",
	},
	{
		ID:          "5",
		Title:       "Family Residence",
		Price:       600000,
		Bedrooms:    4,
		City:        "Austin",
		Description: "Large garage, modern kitchen, private pool.",
	},
	{
		ID:          "6",
		Title:       "Charming Craftsman Bungalow",
		Price:       380000,
		Bedrooms:    2,
		City:        "Seattle",
		Description: "Hardwood floors, renovated kitchen, and vibrant garden.",
	},
}

// calculateMatchScore calculates:
//
// max(
//     0,
//     100 - (abs(listingPrice - targetBudget) / targetBudget * 100)
// )
//
// Examples:
//
// $450,000 listing / $450,000 target = 100.0
// $500,000 listing / $450,000 target = 88.9
// $320,000 listing / $450,000 target = 71.1
// $850,000 listing / $450,000 target = 11.1
func calculateMatchScore(listingPrice float64, targetBudget float64) float64 {
	if targetBudget <= 0 ||
		math.IsNaN(targetBudget) ||
		math.IsInf(targetBudget, 0) {
		return 0
	}

	if listingPrice < 0 ||
		math.IsNaN(listingPrice) ||
		math.IsInf(listingPrice, 0) {
		return 0
	}

	difference := math.Abs(listingPrice - targetBudget)

	percentageDifference := (difference / targetBudget) * 100

	score := 100 - percentageDifference

	// Clamp to [0, 100].
	if score < 0 {
		score = 0
	}

	if score > 100 {
		score = 100
	}

	// Round to one decimal place.
	score = math.Round(score*10) / 10

	return score
}

func getListingsHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")

	w.Header().Set("Content-Type", "application/json")

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	query := r.URL.Query()

	minPriceStr := strings.TrimSpace(query.Get("minPrice"))
	maxPriceStr := strings.TrimSpace(query.Get("maxPrice"))
	minBedsStr := strings.TrimSpace(query.Get("minBedrooms"))

	city := strings.ToLower(strings.TrimSpace(query.Get("city")))
	keyword := strings.ToLower(strings.TrimSpace(query.Get("keyword")))

	// ---------------------------------------------------------
	// TARGET BUDGET
	// ---------------------------------------------------------

	targetBudgetStr := strings.TrimSpace(query.Get("targetBudget"))

	var targetBudget float64
	hasTargetBudget := false

	if targetBudgetStr != "" {

		// Remove common formatting characters.
		cleanBudget := strings.ReplaceAll(targetBudgetStr, "$", "")
		cleanBudget = strings.ReplaceAll(cleanBudget, ",", "")
		cleanBudget = strings.TrimSpace(cleanBudget)

		parsedBudget, err := strconv.ParseFloat(cleanBudget, 64)

		if err == nil && parsedBudget > 0 {
			targetBudget = parsedBudget
			hasTargetBudget = true
		}
	}

	// Debug output so we can see EXACTLY what the frontend sent.
	fmt.Printf(
		"\nREQUEST: %s\n",
		r.URL.String(),
	)

	fmt.Printf(
		"targetBudget parameter: %q\n",
		targetBudgetStr,
	)

	fmt.Printf(
		"parsed targetBudget: %.2f\n",
		targetBudget,
	)

	fmt.Printf(
		"hasTargetBudget: %v\n\n",
		hasTargetBudget,
	)

	// ---------------------------------------------------------
	// FILTER LISTINGS
	// ---------------------------------------------------------

	var filtered []Listing

	for _, item := range mockListings {

		l := Listing{
			ID:          item.ID,
			Title:       item.Title,
			Price:       item.Price,
			Bedrooms:    item.Bedrooms,
			City:        item.City,
			Description: item.Description,

			// Default is zero ONLY when there is no target budget.
			Score: 0,
		}

		// Minimum price.
		if minPriceStr != "" {

			minPrice, err := strconv.ParseFloat(
				strings.ReplaceAll(minPriceStr, ",", ""),
				64,
			)

			if err == nil && l.Price < minPrice {
				continue
			}
		}

		// Maximum price.
		if maxPriceStr != "" {

			maxPrice, err := strconv.ParseFloat(
				strings.ReplaceAll(maxPriceStr, ",", ""),
				64,
			)

			if err == nil && l.Price > maxPrice {
				continue
			}
		}

		// Minimum bedrooms.
		if minBedsStr != "" {

			minBeds, err := strconv.Atoi(minBedsStr)

			if err == nil && l.Bedrooms < minBeds {
				continue
			}
		}

		// City.
		if city != "" &&
			!strings.Contains(
				strings.ToLower(l.City),
				city,
			) {
			continue
		}

		// Keyword.
		if keyword != "" {

			titleMatches := strings.Contains(
				strings.ToLower(l.Title),
				keyword,
			)

			descriptionMatches := strings.Contains(
				strings.ToLower(l.Description),
				keyword,
			)

			if !titleMatches && !descriptionMatches {
				continue
			}
		}

		// ---------------------------------------------------------
		// CALCULATE SCORE
		// ---------------------------------------------------------

		if hasTargetBudget {
			l.Score = calculateMatchScore(
				l.Price,
				targetBudget,
			)
		}

		fmt.Printf(
			"Listing %s | price=$%.2f | target=$%.2f | score=%.1f\n",
			l.ID,
			l.Price,
			targetBudget,
			l.Score,
		)

		filtered = append(filtered, l)
	}

	// ---------------------------------------------------------
	// SORT BY SCORE
	// ---------------------------------------------------------

	if hasTargetBudget {

		sort.SliceStable(
			filtered,
			func(i, j int) bool {
				return filtered[i].Score > filtered[j].Score
			},
		)
	}

	// ---------------------------------------------------------
	// PAGINATION
	// ---------------------------------------------------------

	cursor := query.Get("cursor")

	limit := 6

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

	if endIndex > len(filtered) {
		endIndex = len(filtered)
	}

	paginated := []Listing{}

	if startIndex < len(filtered) {
		paginated = filtered[startIndex:endIndex]
	}

	nextCursor := ""

	hasMore := endIndex < len(filtered)

	if hasMore && len(paginated) > 0 {
		nextCursor = paginated[len(paginated)-1].ID
	}

	// ---------------------------------------------------------
	// RESPONSE
	// ---------------------------------------------------------

	response := ListingResponse{
		Items:      paginated,
		NextCursor: nextCursor,
		HasMore:    hasMore,
		Total:      len(filtered),
	}

	if hasTargetBudget {
		response.TargetBudget = &targetBudget
	}

	if err := json.NewEncoder(w).Encode(response); err != nil {
		fmt.Printf("JSON encoding error: %v\n", err)
		return
	}
}

func main() {

	http.HandleFunc(
		"/api/listings",
		getListingsHandler,
	)

	fmt.Println("Server running on http://localhost:8080")

	if err := http.ListenAndServe(":8080", nil); err != nil {
		fmt.Printf(
			"Server error: %v\n",
			err,
		)
	}
}