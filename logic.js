/**
 * Logic layer for managing customer reviews.
 * Handles state management and business logic for reviews.
 */

// Array state to hold all customer reviews
let reviews = [];

/**
 * Initialize reviews with mock data
 * @param {Array} initialReviews - Array of review objects to initialize with
 */
function initializeReviews(initialReviews) {
  reviews = initialReviews.map(review => ({
    id: review.id,
    customer_name: review.customer_name,
    rating: review.rating,
    review_text: review.review_text,
    reply_text: null,
    status: 'pending'
  }));
}

/**
 * Get all reviews
 * @returns {Array} Array of all reviews
 */
function getReviews() {
  return [...reviews];
}

/**
 * Find a review by its ID
 * @param {string|number} reviewId - The ID of the review to find
 * @returns {Object|undefined} The review object or undefined if not found
 */
function findReviewById(reviewId) {
  return reviews.find(review => review.id === reviewId);
}

/**
 * Update a review's reply text and change status to 'replied'
 * @param {string|number} reviewId - The ID of the review to update
 * @param {string} text - The reply text to set
 * @returns {Object|boolean} The updated review object, or false if not found
 */
function replyToReview(reviewId, text) {
  const review = findReviewById(reviewId);

  if (!review) {
    return false;
  }

  // Create a new review object with updated fields
  const reviewIndex = reviews.findIndex(r => r.id === reviewId);

  reviews[reviewIndex] = {
    ...review,
    reply_text: text,
    status: 'replied'
  };

  return reviews[reviewIndex];
}

/**
 * Add a new review
 * @param {Object} review - The review object to add (should have id, customer_name, rating, review_text)
 * @returns {Object} The added review
 */
function addReview(review) {
  const newReview = {
    id: review.id,
    customer_name: review.customer_name,
    rating: review.rating,
    review_text: review.review_text,
    reply_text: null,
    status: 'pending'
  };

  reviews.push(newReview);
  return newReview;
}

/**
 * Remove a review by ID
 * @param {string|number} reviewId - The ID of the review to remove
 * @returns {boolean} True if review was removed, false if not found
 */
function removeReview(reviewId) {
  const initialLength = reviews.length;
  reviews = reviews.filter(review => review.id !== reviewId);
  return reviews.length < initialLength;
}

// Environment-safe exports for browser and Node.js compatibility
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initializeReviews,
    getReviews,
    findReviewById,
    replyToReview,
    addReview,
    removeReview
  };
}