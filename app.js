// Fetch reviews from data layer and render UI
function fetchReviews() {
  const reviews = window.getReviews();
  renderReviews(reviews);
}

function renderReviews(reviews) {
  const grid = document.querySelector('.grid');
  grid.textContent = '';

  // Update summary counts
  const pendingCount = document.getElementById('pending-count');
  const repliedCount = document.getElementById('replied-count');

  const pending = reviews.filter(r => r.status === 'pending').length;
  const replied = reviews.filter(r => r.status === 'replied').length;

  pendingCount.textContent = `Pending: ${pending}`;
  repliedCount.textContent = `Replied: ${replied}`;

  reviews.forEach(review => {
    const card = document.createElement('div');
    card.className = 'card';
    if (review.status === 'replied') card.classList.add('replied');

    // Card header
    const header = document.createElement('div');
    header.className = 'card-header';

    const name = document.createElement('div');
    name.className = 'customer-name';
    name.textContent = review.customer_name;

    const rating = document.createElement('div');
    rating.className = 'rating';
    rating.textContent = `Rating: ★★★★★`;
    rating.style.fontSize = '1rem';

    const status = document.createElement('span');
    status.className = 'status-badge';
    status.textContent = review.status;
    status.classList.add(`status-badge.${review.status}`);

    header.appendChild(name);
    header.appendChild(rating);
    header.appendChild(status);
    card.appendChild(header);

    // Review content
    const reviewText = document.createElement('div');
    reviewText.className = 'review-text';
    reviewText.textContent = review.review_text;
    reviewText.style.display = review.status === 'replied' ? 'none' : 'block';

    // Reply elements
    const textarea = document.createElement('textarea');
    textarea.className = 'reply-textarea';
    textarea.rows = 4;
    textarea.placeholder = 'Write your reply...';
    if (review.status === 'pending') {
      card.appendChild(textarea);
    }

    const btn = document.createElement('button');
    btn.className = 'submit-btn';
    btn.textContent = 'Submit Reply';
    btn.addEventListener('click', () => {
      const replyText = textarea.value.trim();
      if (replyText) {
        window.replyToReview(review.id, replyText);
        fetchReviews();
      }
    });
    btn.style.display = review.status === 'pending' ? 'block' : 'none';
    card.appendChild(btn);

    // Reply display
    const replyDisplay = document.createElement('div');
    replyDisplay.className = 'reply-display';
    if (review.status === 'replied') {
      replyDisplay.textContent = review.reply_text || '(No reply yet)';
      card.appendChild(replyDisplay);
    }

    grid.appendChild(card);
  });
}

// Initialize with mock data when DOM loads
document.addEventListener('DOMContentLoaded', () => {
  // Mock review data
  const mockReviews = [
    {
      id: 1,
      customer_name: "John Doe",
      rating: 5,
      review_text: "Great product! Love it so far."
    },
    {
      id: 2,
      customer_name: "Jane Smith",
      rating: 4,
      review_text: "Good service, fast delivery"
    },
    {
      id: 3,
      customer_name: "Bob Johnson",
      rating: 3,
      review_text: "Average experience, could be better"
    }
  ];

  // Initialize the review data
  window.initializeReviews(mockReviews);

  // Fetch and render reviews
  fetchReviews();
});