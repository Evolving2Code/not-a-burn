/**
 * Logic layer for managing customer reviews.
 * Handles state management and business logic for reviews.
 */

// Array state to hold all customer reviews
let reviews = [];

// Load saved reviews from localStorage if available (browser only)
if (typeof localStorage !== 'undefined') {
  const saved = localStorage.getItem('not_a_burn_reviews');
  if (saved) {
    try {
      reviews = JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse saved reviews from localStorage', e);
      // fallback to empty array; will be initialized later if needed
      reviews = [];
    }
  }
}

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
  // Persist to localStorage
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('not_a_burn_reviews', JSON.stringify(reviews));
  }
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

  // Persist to localStorage
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('not_a_burn_reviews', JSON.stringify(reviews));
  }

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
  // Persist to localStorage
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('not_a_burn_reviews', JSON.stringify(reviews));
  }
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
  // Persist to localStorage
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('not_a_burn_reviews', JSON.stringify(reviews));
  }
  return reviews.length < initialLength;
}

/**
 * Expose core functions for browser and Node.js compatibility
 */
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

/* Browser global assignment ------------------------------------------------- */
if (typeof window !== 'undefined') {
  window.initializeReviews = initializeReviews;
  window.getReviews = getReviews;
  window.findReviewById = findReviewById;
  window.replyToReview = replyToReview;
  window.addReview = addReview;
  window.removeReview = removeReview;
}