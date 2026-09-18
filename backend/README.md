

Run with:
```
go run main.go
```



### Calculation Formula

When a user specifies a target budget, each listing is assigned a match score calculated as:

$$\text{Match Percentage} = \max\left(0, 100 - \left( \frac{\vert{}\text{Listing Price} - \text{Target Budget}\vert{}}{\text{Target Budget}} \times 100 \right)\right)$$

Where:
* **$\text{Listing Price}$**: The asking price of the property.
* **$\text{Target Budget}$**: The target price requested by the user.
* **Score Range**: Clamped between $0\%$ and $100\%$.