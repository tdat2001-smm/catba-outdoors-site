/* ===== CAT BA OUTDOORS - Main JS ===== */

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initFadeIn();
  initFAQ();
  initBookingForm();
  initMobileMenu();
  initSearchBox();
});

/* -- Navigation scroll effect -- */
function initNav() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  // Check if page has hero (home page)
  const hasHero = document.querySelector('.hero');

  if (!hasHero) {
    nav.classList.add('scrolled');
    return;
  }

  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });
}

/* -- Mobile menu -- */
function initMobileMenu() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
    toggle.classList.toggle('active');
  });

  // Close on link click
  links.querySelectorAll('a:not(.nav-dropdown > a)').forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.classList.remove('active');
    });
  });
}

/* -- Fade in on scroll -- */
function initFadeIn() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

/* -- FAQ accordion -- */
function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isActive = item.classList.contains('active');

      // Close all
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));

      // Toggle current
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* -- Booking form -- */
function initBookingForm() {
  const form = document.getElementById('bookingForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Add tour info if on tour detail page
    const tourTitle = document.querySelector('[data-tour-title]');
    if (tourTitle) {
      data.tour = tourTitle.dataset.tourTitle;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    try {
      // Send to Telegram (webhook URL to be configured)
      const webhookUrl = window.BOOKING_WEBHOOK_URL || '';

      if (webhookUrl) {
        const message = formatBookingMessage(data);
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: message })
        });
      }

      // Show success
      showBookingSuccess(form, data);
    } catch (err) {
      console.error('Booking error:', err);
      alert('There was an error submitting your booking. Please contact us via Zalo or WhatsApp.');
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
}

function formatBookingMessage(data) {
  return [
    '--- NEW BOOKING ---',
    `Tour: ${data.tour || 'General Inquiry'}`,
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone || 'N/A'}`,
    `Date: ${data.date || 'N/A'}`,
    `Guests: ${data.guests || 'N/A'}`,
    `Message: ${data.message || 'N/A'}`,
    `Time: ${new Date().toISOString()}`
  ].join('\n');
}

function showBookingSuccess(form, data) {
  form.innerHTML = `
    <div class="booking-success">
      <div style="font-size:3rem;margin-bottom:1rem;">&#10003;</div>
      <h3>Booking Request Sent!</h3>
      <p class="text-muted">Thank you, <strong>${data.name}</strong>. We've received your inquiry and will contact you within 2 hours.</p>
      <p class="text-muted mt-2">You can also reach us directly:</p>
      <div style="margin-top:1.5rem;display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;">
        <a href="https://zalo.me/0327012901" class="btn btn-sm btn-primary">Chat on Zalo</a>
        <a href="https://wa.me/84327012901" class="btn btn-sm btn-outline" style="border-color:var(--color-gray-200);color:var(--color-gray-800);">WhatsApp</a>
      </div>
    </div>
  `;
}

/* -- Modal -- */
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove('open');
  document.body.style.overflow = '';
}

// Close modal on overlay click
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('open');
    document.body.style.overflow = '';
  }
});

/* -- Load tours from JSON -- */
async function loadTours(containerId, options = {}) {
  try {
    const res = await fetch('/data/tours.json');
    const tours = await res.json();

    const container = document.getElementById(containerId);
    if (!container) return;

    let filtered = tours;
    if (options.featured) {
      filtered = tours.filter(t => t.featured);
    }
    if (options.category) {
      filtered = tours.filter(t => t.category === options.category);
    }
    if (options.limit) {
      filtered = filtered.slice(0, options.limit);
    }

    container.innerHTML = filtered.map(tour => tourCardHTML(tour)).join('');
  } catch (err) {
    console.error('Error loading tours:', err);
  }
}

function tourCardHTML(tour) {
  return `
    <a href="tour-detail.html#id=${tour.id}" class="card fade-in" style="text-decoration:none;color:inherit;">
      <div class="card-img img-placeholder" style="height:220px;position:relative;">
        ${tour.featured ? '<span class="card-badge">Featured</span>' : ''}
        <button class="card-heart" onclick="event.preventDefault();">&#9825;</button>
        ${tour.image ? `<img src="${tour.image}" alt="${tour.title}" onerror="this.style.display='none';this.parentElement.textContent='Photo: ${tour.title}'" style="width:100%;height:100%;object-fit:cover;">` : `Photo: ${tour.title}`}
      </div>
      <div class="card-body">
        <div class="card-location">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
          ${tour.location}
        </div>
        <h4 class="card-title">${tour.title}</h4>
        <div class="card-rating">
          <span class="card-rating-star">&#9733;</span>
          <span class="card-rating-score">${tour.rating || 5}</span>
          <span class="card-rating-count">(${tour.reviews || 0} Reviews)</span>
        </div>
        <div class="card-footer">
          <div>
            <span class="card-price-label">From</span>
            <span class="card-price-amount">$${tour.price}</span>
          </div>
          <div class="card-duration">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            ${tour.duration}
          </div>
        </div>
      </div>
    </a>
  `;
}

/* -- Load tour detail -- */
async function loadTourDetail() {
  const params = new URLSearchParams(window.location.search);
  const tourId = params.get('id');
  if (!tourId) return;

  try {
    const res = await fetch('/data/tours.json');
    const tours = await res.json();
    const tour = tours.find(t => t.id === tourId);

    if (!tour) {
      document.getElementById('tourContent').innerHTML = '<p>Tour not found.</p>';
      return;
    }

    // Update page
    document.title = `${tour.title} | Cat Ba Outdoors`;
    document.getElementById('tourTitle').textContent = tour.title;
    document.getElementById('tourTitle').dataset.tourTitle = tour.title;
    document.getElementById('tourSubtitle').textContent = tour.subtitle;
    document.getElementById('tourDesc').innerHTML = `<p>${tour.description}</p>`;
    document.getElementById('tourPrice').innerHTML = `$${tour.price} <small>/ person</small>`;
    document.getElementById('tourPriceVND').textContent = `~ ${tour.priceVND?.toLocaleString()} VND`;
    document.getElementById('tourDuration').textContent = tour.duration;
    document.getElementById('tourLocation').textContent = tour.location;
    document.getElementById('tourMaxGuests').textContent = `Max ${tour.maxGuests} guests`;
    document.getElementById('tourLanguages').textContent = tour.languages?.join(', ');

    // Highlights
    const highlightsList = document.getElementById('tourHighlights');
    if (highlightsList && tour.highlights) {
      highlightsList.innerHTML = tour.highlights.map(h => `<li>${h}</li>`).join('');
    }

    // Includes / Excludes
    const includesList = document.getElementById('tourIncludes');
    if (includesList && tour.includes) {
      includesList.innerHTML = tour.includes.map(i => `<li>&#10003; ${i}</li>`).join('');
    }

    const excludesList = document.getElementById('tourExcludes');
    if (excludesList && tour.excludes) {
      excludesList.innerHTML = tour.excludes.map(e => `<li>&#10007; ${e}</li>`).join('');
    }

    // Itinerary
    const itineraryEl = document.getElementById('tourItinerary');
    if (itineraryEl && tour.itinerary?.length) {
      itineraryEl.innerHTML = tour.itinerary.map(step => `
        <div style="display:flex;gap:1.5rem;padding:1rem 0;border-bottom:1px solid var(--color-gray-200);">
          <div style="font-weight:600;color:var(--color-accent);min-width:60px;">${step.time}</div>
          <div>${step.activity}</div>
        </div>
      `).join('');
    }

    // Set booking form tour name
    const bookingTourInput = document.getElementById('bookingTourName');
    if (bookingTourInput) bookingTourInput.value = tour.title;

    // Re-init fade in for new content
    initFadeIn();
  } catch (err) {
    console.error('Error loading tour:', err);
  }
}

/* -- Search Box -- */
const guestCounts = { adults: 1, infants: 0, children26: 0, children612: 0 };

function initSearchBox() {
  const toggle = document.getElementById('guestToggle');
  const dropdown = document.getElementById('guestDropdown');
  const field = document.querySelector('.search-field-guests');
  if (!toggle || !dropdown || !field) return;

  // Toggle guest dropdown
  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    field.classList.toggle('open');
  });

  // Close dropdown on outside click
  document.addEventListener('click', (e) => {
    if (!field.contains(e.target)) {
      field.classList.remove('open');
    }
  });

  // Set min date to today
  const today = new Date().toISOString().split('T')[0];
  const checkin = document.getElementById('searchCheckin');
  const checkout = document.getElementById('searchCheckout');
  if (checkin) {
    checkin.min = today;
    checkin.addEventListener('change', () => {
      if (checkout) checkout.min = checkin.value;
    });
  }

  updateGuestSummary();
}

function updateGuest(type, delta) {
  const min = type === 'adults' ? 1 : 0;
  const max = 20;
  guestCounts[type] = Math.max(min, Math.min(max, guestCounts[type] + delta));

  const countEl = document.getElementById(type + '-count');
  if (countEl) countEl.textContent = guestCounts[type];

  // Disable buttons at limits
  updateCounterButtons(type);
  updateGuestSummary();
}

function updateCounterButtons(type) {
  const min = type === 'adults' ? 1 : 0;
  const row = document.getElementById(type + '-count')?.closest('.guest-row');
  if (!row) return;
  const btns = row.querySelectorAll('.counter-btn');
  if (btns[0]) btns[0].disabled = guestCounts[type] <= min;
  if (btns[1]) btns[1].disabled = guestCounts[type] >= 20;
}

function updateGuestSummary() {
  const el = document.getElementById('guestSummary');
  if (!el) return;

  const { adults, infants, children26, children612 } = guestCounts;
  const totalChildren = infants + children26 + children612;

  let parts = [];
  parts.push(adults + (adults === 1 ? ' adult' : ' adults'));
  if (totalChildren > 0) {
    parts.push(totalChildren + (totalChildren === 1 ? ' child' : ' children'));
  }
  if (infants > 0) {
    parts.push(infants + (infants === 1 ? ' infant' : ' infants'));
  }

  el.textContent = parts.join(', ');

  // Update all counter buttons
  ['adults', 'infants', 'children26', 'children612'].forEach(updateCounterButtons);
}

function handleSearch() {
  const service = document.getElementById('searchService')?.value || '';
  const checkin = document.getElementById('searchCheckin')?.value || '';
  const checkout = document.getElementById('searchCheckout')?.value || '';
  const { adults, infants, children26, children612 } = guestCounts;

  // Build query string
  const params = new URLSearchParams();
  if (service) params.set('service', service);
  if (checkin) params.set('checkin', checkin);
  if (checkout) params.set('checkout', checkout);
  params.set('adults', adults);
  if (infants > 0) params.set('infants', infants);
  if (children26 > 0) params.set('children26', children26);
  if (children612 > 0) params.set('children612', children612);

  // Map service to page
  const stayServices = ['healing-camp', 'floating-homestay'];
  const serviceServices = ['transport', 'workshop', 'rental'];

  if (stayServices.includes(service)) {
    window.location.href = 'stays.html#' + service + '?' + params.toString();
  } else if (serviceServices.includes(service)) {
    window.location.href = 'services.html#' + service + '?' + params.toString();
  } else {
    window.location.href = 'tours.html?' + params.toString();
  }
}
