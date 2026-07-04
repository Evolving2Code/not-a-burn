// Test suite for review logic
const assert = require('assert');
const logic = require('./logic.js');

// Mock environment globals for Node compatibility
if (typeof window === 'undefined') {
  window = {};
}
if (typeof localStorage === 'undefined') {
  window.localStorage = {
    getItem: () => null,
    setItem: () => {}
  };
}

// Mock review data for testing
const mockReviews = [
  {
    id: 1,
    customer_name: "John Doe",
    rating: 5,
    review_text: "Great product!"
  },
  {
    id: 2,
    customer_name: "Jane Smith",
    rating: 4,
    review_text: "Good service"
  },
  {
    id: 3,
    customer_name: "Bob Johnson",
    rating: 3,
    review_text: "Average experience"
  }
];

function runTests() {
  try {
    // Test initializing with mock reviews
    logic.initializeReviews(mockReviews);
    const reviews = logic.getReviews();
    assert.strictEqual(reviews.length, 3);
    assert.strictEqual(reviews[0].customer_name, "John Doe");
    assert.strictEqual(reviews[0].rating, 5);
    assert.strictEqual(reviews[0].status, 'pending');
    assert.strictEqual(reviews[0].reply_text, null);
    console.log('✓ Test 1 passed: Initialize with mock reviews');

    // Test finding a review by ID
    const review = logic.findReviewById(2);
    assert.ok(review);
    assert.strictEqual(review.customer_name, "Jane Smith");
    assert.strictEqual(review.id, 2);
    console.log('✓ Test 2 passed: Find review by ID');

    // Test updating review text via replyToReview and changing status to replied
    const result = logic.replyToReview(1, "Thank you for your feedback!");
    assert.ok(result);
    assert.strictEqual(result.reply_text, "Thank you for your feedback!");
    assert.strictEqual(result.status, 'replied');

    // Verify the original array was updated
    const updatedReview = logic.findReviewById(1);
    assert.strictEqual(updatedReview.reply_text, "Thank you for your feedback!");
    assert.strictEqual(updatedReview.status, 'replied');
    console.log('✓ Test 3 passed: Reply to review updates text and status');

    // Test returning false when trying to reply to non-existent review
    const resultFail = logic.replyToReview(999, "This should fail");
    assert.strictEqual(resultFail, false);
    console.log('✓ Test 4 passed: Reply to non-existent review returns false');

    // Test maintaining other review properties when replying
    const result2 = logic.replyToReview(3, "We'll improve!");
    assert.strictEqual(result2.customer_name, "Bob Johnson");
    assert.strictEqual(result2.rating, 3);
    assert.strictEqual(result2.review_text, "Average experience");
    assert.strictEqual(result2.reply_text, "We'll improve!");
    assert.strictEqual(result2.status, 'replied');
    console.log('✓ Test 5 passed: Reply maintains other review properties');

    console.log('\nAll tests passed! ✅');
    return true;
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    return false;
  }
}

runTests();