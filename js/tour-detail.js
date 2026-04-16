/* ===== TOUR DETAIL PAGE JS ===== */

let currentTour = null;
let bookingCounts = { adults: 2, children: 0 };

document.addEventListener('DOMContentLoaded', () => {
  loadTourDetailPage();
  initItineraryAccordion();
});

async function loadTourDetailPage() {
  // Support both ?id= and #id= for compatibility with static servers
  const params = new URLSearchParams(window.location.search);
  let tourId = params.get('id');
  if (!tourId && window.location.hash) {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    tourId = hashParams.get('id') || window.location.hash.substring(1);
  }
  if (!tourId) return;

  try {
    const res = await fetch('/data/tours.json');
    const tours = await res.json();
    currentTour = tours.find(t => t.id === tourId);

    if (!currentTour) {
      document.querySelector('.td-main').innerHTML = '<div class="container"><p>Tour not found. <a href="tours.html">Browse all tours</a></p></div>';
      return;
    }

    const t = currentTour;

    // Page title
    document.title = `${t.title} | Cat Ba Outdoors`;

    // Breadcrumb
    document.getElementById('breadcrumbTitle').textContent = t.title;

    // Title area
    document.getElementById('tourTitle').textContent = t.title;
    document.getElementById('tourTitle').dataset.tourTitle = t.title;
    document.getElementById('tourSubtitle').textContent = t.subtitle || '';
    document.getElementById('tourCategoryBadge').textContent = t.category;
    document.getElementById('tourLangBadge').textContent = t.languages?.[0] || 'English';

    // Location
    document.getElementById('tourLocation').textContent = t.location;
    document.getElementById('tourLocationSpec').textContent = t.location;

    // Price
    document.getElementById('tourPrice').textContent = `$${t.price}`;
    document.getElementById('tourPriceVND').textContent = t.priceVND ? `~ ${t.priceVND.toLocaleString()} VND` : '';
    document.getElementById('bookingPrice').textContent = `$${t.price}`;

    // Specs
    document.getElementById('tourDuration').textContent = t.durationDetail || t.duration;
    document.getElementById('tourMaxGuests').textContent = `Max ${t.maxGuests}`;
    document.getElementById('tourLanguages').textContent = t.languages?.join(', ') || 'English';

    // Update review scores if available
    const scoreEl = document.querySelector('.td-score-number');
    if (scoreEl && t.rating) scoreEl.textContent = t.rating === 5 ? '5.0' : t.rating.toFixed(1);
    const countEl = document.querySelector('.td-score-count');
    if (countEl && t.reviews) countEl.textContent = `Based on ${t.reviews}+ reviews`;

    // Packages table (if available, insert before description)
    if (t.packages?.length) {
      const packagesHTML = `
        <div class="td-section">
          <h2 class="td-section-title">Packages & Pricing</h2>
          <table class="td-packages-table">
            <thead><tr><th>Name Package</th><th>Price Adult</th><th>Price Children</th></tr></thead>
            <tbody>${t.packages.map(p => `<tr><td>${p.name}</td><td>$${p.priceAdult}</td><td>$${p.priceChild}</td></tr>`).join('')}</tbody>
          </table>
        </div>
      `;
      document.getElementById('tourDesc').insertAdjacentHTML('afterend', packagesHTML);
    }

    // Things to bring (if available)
    if (t.thingsToBring?.length) {
      const bringHTML = `
        <div class="td-section">
          <h2 class="td-section-title">Things to Bring</h2>
          <ul class="td-highlights">${t.thingsToBring.map(item => `<li>${item}</li>`).join('')}</ul>
        </div>
      `;
      // Insert after includes/excludes section
      const incExcSection = document.querySelector('.td-inc-exc')?.closest('.td-section');
      if (incExcSection) incExcSection.insertAdjacentHTML('afterend', bringHTML);
    }

    // Menu (if available)
    if (t.menu?.length) {
      const menuHTML = `
        <div class="td-section">
          <h2 class="td-section-title">Menu</h2>
          <div class="td-menu-grid">${t.menu.map(item => `<span class="td-menu-item">${item}</span>`).join('')}</div>
        </div>
      `;
      const itinSection = document.getElementById('tourItinerary')?.closest('.td-section');
      if (itinSection) itinSection.insertAdjacentHTML('afterend', menuHTML);
    }

    // Description
    document.getElementById('tourDesc').innerHTML = `
      <h2 class="td-section-title">About This Tour</h2>
      <p>${t.description}</p>
    `;

    // Highlights
    const highlightsList = document.getElementById('tourHighlights');
    if (highlightsList && t.highlights) {
      highlightsList.innerHTML = t.highlights.map(h => `<li>${h}</li>`).join('');
    }

    // Itinerary
    const itineraryEl = document.getElementById('tourItinerary');
    if (itineraryEl && t.itinerary?.length) {
      itineraryEl.innerHTML = t.itinerary.map((step, i) => `
        <div class="td-itinerary-item${i === 0 ? ' open' : ''}">
          <button class="td-itinerary-header" onclick="toggleItinerary(this)">
            <div class="td-itinerary-step">${i + 1}</div>
            <div class="td-itinerary-title">${step.activity}</div>
            <div class="td-itinerary-time">${step.time}</div>
            <div class="td-itinerary-toggle">&#9662;</div>
          </button>
          <div class="td-itinerary-body">
            <div class="td-itinerary-body-inner">
              <p>${step.activity}. Enjoy this part of the journey through the beautiful landscapes of Lan Ha Bay and Cat Ba Island.</p>
            </div>
          </div>
        </div>
      `).join('');
    } else {
      itineraryEl.innerHTML = '<p style="color:var(--color-gray-400);font-size:0.9rem;">Detailed itinerary will be provided upon booking.</p>';
    }

    // Includes / Excludes
    const includesList = document.getElementById('tourIncludes');
    if (includesList && t.includes) {
      includesList.innerHTML = t.includes.map(i => `<li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#27ae60" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> ${i}</li>`).join('');
    }

    const excludesList = document.getElementById('tourExcludes');
    if (excludesList && t.excludes) {
      excludesList.innerHTML = t.excludes.map(e => `<li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#e74c3c" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> ${e}</li>`).join('');
    }

    // Booking form tour name
    document.getElementById('bookingTourName').value = t.title;

    // Set min date
    const dateInput = document.querySelector('.td-booking-card input[type="date"]');
    if (dateInput) {
      dateInput.min = new Date().toISOString().split('T')[0];
    }

    // Update price summary
    document.getElementById('summary-price').textContent = `$${t.price}`;
    document.getElementById('summary-child-price').textContent = `$${t.priceChild || Math.round(t.price * 0.7)}`;
    updateBookingSummary();

    // Load related tours
    loadRelatedTours(tours, t);

  } catch (err) {
    console.error('Error loading tour:', err);
  }
}

/* Itinerary accordion */
function toggleItinerary(btn) {
  const item = btn.closest('.td-itinerary-item');
  const isOpen = item.classList.contains('open');

  // Close all
  document.querySelectorAll('.td-itinerary-item').forEach(i => i.classList.remove('open'));

  // Toggle current
  if (!isOpen) item.classList.add('open');
}

function initItineraryAccordion() {
  // Already handled by onclick
}

/* Booking counter */
function bookingCounter(id, delta) {
  const el = document.getElementById(id);
  if (!el) return;

  const key = id.replace('b-', '');
  const min = key === 'adults' ? 1 : 0;
  bookingCounts[key] = Math.max(min, Math.min(20, (bookingCounts[key] || 0) + delta));
  el.textContent = bookingCounts[key];

  updateBookingSummary();
}

function updateBookingSummary() {
  if (!currentTour) return;

  const price = currentTour.price;
  const childPrice = currentTour.priceChild || Math.round(price * 0.7);
  const { adults, children } = bookingCounts;

  document.getElementById('summary-adults').textContent = adults;
  document.getElementById('summary-adults-total').textContent = `$${adults * price}`;

  const childRow = document.getElementById('summary-children-row');
  if (children > 0) {
    childRow.style.display = 'flex';
    document.getElementById('summary-children').textContent = children;
    document.getElementById('summary-children-total').textContent = `$${children * childPrice}`;
  } else {
    childRow.style.display = 'none';
  }

  const total = (adults * price) + (children * childPrice);
  document.getElementById('summary-total').textContent = `$${total}`;
}

/* Related tours */
function loadRelatedTours(tours, current) {
  const container = document.getElementById('relatedTours');
  if (!container) return;

  const related = tours.filter(t => t.id !== current.id).slice(0, 3);
  container.innerHTML = related.map(tour => tourCardHTML(tour)).join('');

  // Trigger fade-in
  document.querySelectorAll('.fade-in').forEach(el => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.1 });
    observer.observe(el);
  });
}
