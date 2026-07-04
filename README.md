# Not A Burn

A lightweight, framework-free review management system built with vanilla JavaScript, HTML, and CSS. Runs in both browser and Node.js environments.

## Features

- **Isolated Data Layer** (`logic.js`) — Pure business logic for review state management
- **Zero Dependencies** — No bundlers, no frameworks, no build step
- **Universal Execution** — Works in browser and Node.js
- **Unit Tested** — Native Node.js assertions (run with `node test.js`)

## Quick Start

```bash
# Run tests
node test.js
```

## Project Structure

```
not-a-burn/
├── logic.js        # Review data engine (core business logic)
├── test.js         # Unit test suite
├── CLAUDE.md       # Development guidelines
└── README.md       # This file
```

## API (logic.js)

```javascript
// Initialize with mock data
initializeReviews([{ id, customer_name, rating, review_text }])

// Get all reviews
getReviews()

// Find by ID
findReviewById(reviewId)

// Reply to a review (sets reply_text, status: 'replied')
replyToReview(reviewId, replyText)

// Add a new review
addReview({ id, customer_name, rating, review_text })

// Remove a review
removeReview(reviewId)
```

Each review object:
```javascript
{
  id: 1,
  customer_name: "John Doe",
  rating: 5,
  review_text: "Great product!",
  reply_text: null,      // or "Thanks for your feedback!"
  status: 'pending'      // or 'replied'
}
```

## Testing

```bash
node test.js
```

Output:
```
✓ Test 1 passed: Initialize with mock reviews
✓ Test 2 passed: Find review by ID
✓ Test 3 passed: Reply to review updates text and status
✓ Test 4 passed: Reply to non-existent review returns false
✓ Test 5 passed: Reply maintains other review properties

All tests passed! ✅
```

## Development

Follow the conventions in `CLAUDE.md`:
- Keep logic isolated in `logic.js`
- Keep DOM/event handling in `app.js` (when added)
- Use `if (typeof module !== 'undefined')` for exports
- Commit with Conventional Commits format

## License

MIT