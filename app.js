document.addEventListener('DOMContentLoaded', async () => {
  let supabaseClient = null;

  // Initialize Supabase client with full error handling
  try {
    const config = window.supabaseConfig;
    const supabaseLib = window.supabase;

    if (!supabaseLib) {
      throw new Error('Supabase library not loaded');
    }

    if (!config || !config.url || !config.anonKey) {
      throw new Error('Supabase config missing');
    }

    if (config.url.includes('YOUR_PROJECT_URL')) {
      throw new Error('Using placeholder URL');
    }

    supabaseClient = supabaseLib.createClient(config.url, config.anonKey);
  } catch (err) {
    console.warn('Supabase initialization failed, using local mock data:', err.message);
  }

  // Layout toggle button - independent of database
  const toggleBtn = document.getElementById('toggle-layout');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      document.getElementById('login-screen').classList.toggle('hidden');
      document.getElementById('dashboard').classList.toggle('hidden');
    });
  }

  // Google sign-in button - only works if supabaseClient is available
  const googleBtn = document.getElementById('google-signin');
  if (googleBtn && supabaseClient) {
    googleBtn.addEventListener('click', async () => {
      try {
        await supabaseClient.auth.signInWithOAuth({
          provider: 'google',
          options: { redirectTo: window.location.origin }
        });
      } catch (err) {
        console.error('Google sign-in failed:', err);
      }
    });
  }

  // Auth state listener - only active if supabaseClient is available
  if (supabaseClient) {
    supabaseClient.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // User authenticated - show dashboard, hide login
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('dashboard').classList.remove('hidden');

        // Fetch user reviews
        await fetchUserReviews(session.user.id);
      } else {
        // No session - show login
        document.getElementById('login-screen').classList.remove('hidden');
        document.getElementById('dashboard').classList.add('hidden');
      }
    });

    // Check initial session state
    const { data: { session } } = await supabaseClient.auth.getSession();

    if (!session) {
      // No session - initialize with mock data
      window.initializeReviews([
        { id: 1, customer_name: "John Doe", rating: 5, review_text: "Great product! Love it so far.", reply_text: null, status: 'pending' },
        { id: 2, customer_name: "Jane Smith", rating: 4, review_text: "Good service, fast delivery", reply_text: null, status: 'pending' },
        { id: 3, customer_name: "Bob Johnson", rating: 3, review_text: "Average experience, could be better", reply_text: null, status: 'pending' }
      ]);
    }

    // Render reviews (from session or mock data)
    renderReviews(window.getReviews());
  } else {
    // No Supabase client - use mock data but keep login screen visible
    window.initializeReviews([
      { id: 1, customer_name: "John Doe", rating: 5, review_text: "Great product! Love it so far.", reply_text: null, status: 'pending' },
      { id: 2, customer_name: "Jane Smith", rating: 4, review_text: "Good service, fast delivery", reply_text: null, status: 'pending' },
      { id: 3, customer_name: "Bob Johnson", rating: 3, review_text: "Average experience, could be better", reply_text: null, status: 'pending' }
    ]);

    // Keep login screen visible, render mock data in background
    // User must click "Sign in with Google" or "Switch Layout" to proceed
    renderReviews(window.getReviews());
  }

  // Render reviews function
  function renderReviews(reviews) {
    const grid = document.querySelector('.grid');
    grid.textContent = '';

    // Update summary counters
    const pendingCount = document.getElementById('pending-count');
    const repliedCount = document.getElementById('replied-count');
    pendingCount.textContent = `Pending: ${reviews.filter(r => r.status === 'pending').length}`;
    repliedCount.textContent = `Replied: ${reviews.filter(r => r.status === 'replied').length}`;

    // Create review cards
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
        ${review.status === 'pending'
          ? `<textarea class="reply-textarea" rows="4" placeholder="Write your reply..."></textarea>
             <button class="submit-btn">Submit Reply</button>`
          : `<div class="reply-display">Reply: ${review.reply_text || '(No reply yet)'}</div>`
        }
      `;

      // Add submit button event listener
      const submitBtn = card.querySelector('.submit-btn');
      if (review.status === 'pending' && submitBtn) {
        submitBtn.addEventListener('click', async () => {
          const textarea = card.querySelector('textarea');
          const replyText = textarea.value.trim();

          if (!replyText) return;

          if (supabaseClient) {
            // Update via Supabase
            try {
              await supabaseClient
                .from('reviews')
                .update({ reply_text: replyText, status: 'replied' })
                .eq('id', review.id);
            } catch (err) {
              console.error('Failed to update review:', err);
            }
          }

          // Update local state
          window.replyToReview(review.id, replyText);
          renderReviews(window.getReviews());
        });
      }

      grid.appendChild(card);
    });
  }

  // Fetch user reviews from Supabase
  async function fetchUserReviews(userId) {
    if (!supabaseClient) return [];

    try {
      const { data, error } = await supabaseClient
        .from('reviews')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Failed to fetch reviews:', error);
        return [];
      }

      return data || [];
    } catch (err) {
      console.error('Error fetching reviews:', err);
      return [];
    }
  }
});