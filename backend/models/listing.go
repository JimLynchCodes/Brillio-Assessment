package models

type Listing struct {
	ID             string  `json:"id"`
	Source         string  `json:"source"`
	Title          string  `json:"title"`        // ← add this
	Address        string  `json:"address"`
	City           string  `json:"city"`
	State          string  `json:"state"`
	Zip            string  `json:"zip"`
	Price          float64 `json:"price"`
	Bedrooms       int     `json:"bedrooms"`
	Bathrooms      float64 `json:"bathrooms"`
	Sqft           int     `json:"sqft"`
	Latitude       float64 `json:"latitude"`
	Longitude      float64 `json:"longitude"`
	ListedDate     string  `json:"listedDate"`
	Status         string  `json:"status"`
	Description    string  `json:"description"`
	Score          float64 `json:"score"`          // ← rename from RelevanceScore
}

type CursorPayload struct {
	Score float64 `json:"score"`
	ID    string  `json:"id"`
}

type CursorSearchResponse struct {
	Items      []Listing `json:"items"`
	NextCursor string    `json:"nextCursor,omitempty"`
	HasMore    bool      `json:"hasMore"`
	Total      int       `json:"total"`
}

type ErrorResponse struct {
	Error   string `json:"error"`
	Message string `json:"message"`
}