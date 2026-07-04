/* Supabase Logic Layer */
const supabase = window.supabase; // Supabase client loaded from CDN

/* AUTH STATE LISTENER */
window.supabase.auth.onAuthStateChange(async (event, session) => {
  if (session?.user) {
    // User is authenticated – hide login, show dashboard
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');

    // Pull user‑specific reviews
    await fetchUserReviews(session.user.id);
  } else {
    // No session – show login UI
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('dashboard').classList.add('hidden');
  }
});

/* GOOGLE SIGN‑IN */
document.getElementById('google-signin').addEventListener('click', async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin }
  });
  if (error) console.error('Google sign‑in error:', error);
});

/* APPLICATION RENDERING */
function renderReviews(reviews) {
  const grid = document.querySelector('.grid');
  grid.textContent = '';

  const pendingCount   = document.getElementById('pending-count');
  const repliedCount   = document.getElementById('replied-count');
  pendingCount.textContent  = `Pending: ${reviews.filter(r => r.status === 'pending').length}`;
  repliedCount.textContent  = `Replied: ${reviews.filter(r => r.status === 'replied').length}`;

  reviews.forEach(review => {
    const card = document.createElement('div');
    card.className = 'card' + (review.status === 'replied' ? ' replied' : '');
    card.innerHTML = `
      <div class="card-header">
        <div class="customer-name">${review.customer_name}</div>
        <div class="rating">★★★★★</div>
        <span class="status-badge ${review.status}">${review.status}</span>
      </div>
      <div class="review-text">${review.review_text}</div>
      ${review.status === 'pending' ? `
        <textarea class="reply-textarea" rows="4" placeholder="Write your reply..."></textarea>
        <button class="submit-btn">Submit Reply</button>
      ` : `
        <div class="reply-display">Reply: ${reply_text || '(No reply yet)'}</div>
      `;
    }

    // Submit button event
    const submitBtn = card.querySelector('.submit-btn');
    if (review.status === 'pending' && submitBtn) {
      submitBtn.addEventListener('click', async () => {
        const textarea = card.querySelector('textarea');
        const replyText = textarea.value.trim();
        if (replyText) {
          const { error } = await supabase
            .from('reviews')
            .update({ reply_text: replyText, status: 'replied' })
            .eq('id', review.id);
          if (!error) {
            // Refresh UI after successful update
            renderReviews(window.getReviews());
          }
        }
      });
    }
  });
}

/* INITIALISATION */
document.addEventListener('DOMContentLoaded', async () => {
  // If no session yet, seed mock data for first render
  if (!window.supabase.auth.session) {
    window.initializeReviews([
      {id:1, customer_name:"John Doe",   rating:5, review_text:"Great product! Love it so far.", reply_text:null, status:'pending'},
      {id:2, customer_name:"Jane Smith", rating:4, review_text:"Good service",          review_text:null, status:'pending'},
      {id:3, customer_name:"Bob Johnson",rating:3, review_text:"Average experience",   review_text:null, status:'pending'}
    ]);
  }
  renderReviews(window.getReviews());
});