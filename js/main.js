/* ===== CAT BA OUTDOORS - Main JS ===== */

/* -- Site-wide contact channels (single source of truth) -- */
const SITE_CONTACT = {
  phone: '+84327012901',
  phoneDisplay: '+84 327 012 901',
  zalo: 'https://zalo.me/0327012901',
  whatsapp: 'https://wa.me/84327012901',
  email: 'info@catbaoutdoors.vn'
};

document.addEventListener('DOMContentLoaded', () => {
  initFloatButtons();
  initNav();
  initFadeIn();
  initFAQ();
  initBookingForm();
  initMobileMenu();
  initSearchBox();
});

/* -- Floating contact plugins (Zalo / WhatsApp / Phone / Email) -- */
function initFloatButtons() {
  if (document.querySelector('.float-buttons')) return;

  const wa = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.768.967-.94 1.165-.173.198-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0 0 20.464 3.488"/></svg>`;
  const phone = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`;
  const mail = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22 6 12 13 2 6"/></svg>`;

  const wrap = document.createElement('div');
  wrap.className = 'float-buttons';
  wrap.innerHTML = `
    <a href="${SITE_CONTACT.zalo}" class="float-btn float-btn-zalo" target="_blank" rel="noopener" aria-label="Chat on Zalo" title="Chat on Zalo"><span class="float-btn-zalo-text">Zalo</span></a>
    <a href="${SITE_CONTACT.whatsapp}" class="float-btn float-btn-whatsapp" target="_blank" rel="noopener" aria-label="Chat on WhatsApp" title="Chat on WhatsApp">${wa}</a>
    <a href="tel:${SITE_CONTACT.phone}" class="float-btn float-btn-phone" aria-label="Call us" title="Call ${SITE_CONTACT.phoneDisplay}">${phone}</a>
    <a href="mailto:${SITE_CONTACT.email}" class="float-btn float-btn-email" aria-label="Email us" title="Email ${SITE_CONTACT.email}">${mail}</a>
  `;
  document.body.appendChild(wrap);
}

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

  // Honeypot anti-spam (hidden field; humans never fill it).
  if (!form.querySelector('input[name="website"]')) {
    const hp = document.createElement('input');
    hp.type = 'text';
    hp.name = 'website';
    hp.tabIndex = -1;
    hp.autocomplete = 'off';
    hp.style.cssText = 'position:absolute;left:-9999px;width:1px;height:1px;opacity:0;';
    hp.setAttribute('aria-hidden', 'true');
    form.appendChild(hp);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(form).entries());

    // Tour-detail page: pull title + booking counts + computed total.
    const tourTitle = document.querySelector('[data-tour-title]');
    if (tourTitle && tourTitle.dataset.tourTitle) data.tour = tourTitle.dataset.tourTitle;

    const adultsEl = document.getElementById('b-adults');
    const childrenEl = document.getElementById('b-children');
    const totalEl = document.getElementById('summary-total');
    if (adultsEl) data.adults = adultsEl.textContent.trim();
    if (childrenEl) data.children = childrenEl.textContent.trim();
    if (totalEl) data.total = totalEl.textContent.trim();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    try {
      const endpoint = window.BOOKING_ENDPOINT || '/api/booking';
      const r = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const body = await r.json().catch(() => ({}));
      if (!r.ok || body.ok === false) {
        throw new Error(body.error || `Request failed (${r.status})`);
      }
      showBookingSuccess(form, data);
    } catch (err) {
      console.error('Booking error:', err);
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      alert(`We couldn't send your booking right now. Please reach us directly via Zalo or WhatsApp.\n\n(${err.message})`);
    }
  });
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
    if (options.tag) {
      filtered = tours.filter(t => t.tags && t.tags.includes(options.tag));
    }
    if (options.limit) {
      filtered = filtered.slice(0, options.limit);
    }

    container.innerHTML = filtered.map(tour => tourCardHTML(tour)).join('');
    // Re-init fade-in observer for dynamically added cards
    initFadeIn();
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
        ${tour.tags ? `<div class="card-tags">${tour.tags.slice(0,3).map(t => `<span class="card-tag-pill">${t}</span>`).join('')}</div>` : ''}
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
