/* Admin data store. Uses localStorage with fallback to seed data. */
(function () {
  'use strict';

  const KEYS = {
    bookings: 'cbo_admin_bookings',
    customers: 'cbo_admin_customers',
    suppliers: 'cbo_admin_suppliers',
    payables: 'cbo_admin_payables',
    blog: 'cbo_admin_blog',
    tours: 'cbo_admin_tours',
    stays: 'cbo_admin_stays',
    seeded: 'cbo_admin_seeded_v1'
  };

  // ---------- Seed data ----------
  const TOUR_SEED = [
    { id: 'full-day-cruise-and-kayak', title: 'Full Day Cruise and Kayak', price: 35, priceVND: 860000, location: 'Lan Ha Bay', category: 'adventure', status: 'active', featured: true },
    { id: 'night-kayaking-glowing-plankton', title: 'Night Kayaking with Glowing Plankton', price: 29, priceVND: 700000, location: 'Lan Ha Bay', category: 'adventure', status: 'active', featured: true },
    { id: 'full-day-trekking-national-park', title: 'Full Day Trekking National Park', price: 45, priceVND: 1100000, location: 'Cat Ba National Park', category: 'adventure', status: 'active', featured: true },
    { id: 'half-day-trekking-cat-ba', title: 'Half Day Trekking Cat Ba', price: 25, priceVND: 620000, location: 'Cat Ba National Park', category: 'adventure', status: 'active', featured: false },
    { id: 'eco-day-cruise-kayaking-lan-ha-bay', title: 'Eco Day Cruise & Kayaking', price: 35, priceVND: 860000, location: 'Lan Ha Bay', category: 'adventure', status: 'active', featured: true }
  ];

  const STAY_SEED = [
    { id: 'the-healing-camp', title: 'The Healing Camp', priceFrom: 500000, location: 'Cat Ba Island', status: 'active' },
    { id: 'lan-ha-floating-homestay', title: 'Lan Ha Floating Homestay', priceFrom: 800000, location: 'Lan Ha Bay', status: 'active' }
  ];

  const CUSTOMERS_SEED = [
    { id: 'C001', name: 'Nguyen Minh Anh',  email: 'minhanh@gmail.com',  phone: '0901234567', country: 'Vietnam',  bookings: 3, totalSpent: 3200000, joined: '2025-09-12' },
    { id: 'C002', name: 'James Walker',     email: 'james.w@outlook.com', phone: '+44 7700 900123', country: 'UK',     bookings: 1, totalSpent: 1700000, joined: '2025-10-04' },
    { id: 'C003', name: 'Sophie Tremblay',  email: 'sophie.t@gmail.com',  phone: '+1 514 555 0199', country: 'Canada', bookings: 2, totalSpent: 2580000, joined: '2025-11-21' },
    { id: 'C004', name: 'Tran Quoc Bao',    email: 'baotran@gmail.com',   phone: '0987654321', country: 'Vietnam',  bookings: 5, totalSpent: 6800000, joined: '2025-07-02' },
    { id: 'C005', name: 'Hannah Müller',    email: 'hannahm@web.de',      phone: '+49 151 23456789', country: 'Germany',bookings: 1, totalSpent: 920000,  joined: '2026-01-15' },
    { id: 'C006', name: 'Le Thi Huong',     email: 'huongle@yahoo.com',   phone: '0912345678', country: 'Vietnam',  bookings: 2, totalSpent: 2240000, joined: '2026-02-09' },
    { id: 'C007', name: 'Akira Tanaka',     email: 'a.tanaka@jp.com',     phone: '+81 80 1234 5678', country: 'Japan',  bookings: 1, totalSpent: 1500000, joined: '2026-03-03' },
    { id: 'C008', name: 'Emma Johnson',     email: 'emma.j@gmail.com',    phone: '+1 415 555 0142', country: 'USA',    bookings: 4, totalSpent: 5400000, joined: '2025-08-19' },
    { id: 'C009', name: 'Pham Van Hung',    email: 'phamhung@vnn.vn',     phone: '0934567812', country: 'Vietnam',  bookings: 1, totalSpent: 700000,  joined: '2026-04-12' },
    { id: 'C010', name: 'Olivia Martin',    email: 'olivia.m@gmail.com',  phone: '+33 6 12 34 56 78', country: 'France', bookings: 2, totalSpent: 2860000, joined: '2026-04-21' }
  ];

  function bookingsSeed() {
    const tours = TOUR_SEED;
    const guests = [
      { customerId: 'C001', name: 'Nguyen Minh Anh', email: 'minhanh@gmail.com', phone: '0901234567' },
      { customerId: 'C002', name: 'James Walker',    email: 'james.w@outlook.com', phone: '+44 7700 900123' },
      { customerId: 'C003', name: 'Sophie Tremblay', email: 'sophie.t@gmail.com', phone: '+1 514 555 0199' },
      { customerId: 'C004', name: 'Tran Quoc Bao',   email: 'baotran@gmail.com', phone: '0987654321' },
      { customerId: 'C005', name: 'Hannah Müller',   email: 'hannahm@web.de', phone: '+49 151 23456789' },
      { customerId: 'C006', name: 'Le Thi Huong',    email: 'huongle@yahoo.com', phone: '0912345678' },
      { customerId: 'C007', name: 'Akira Tanaka',    email: 'a.tanaka@jp.com', phone: '+81 80 1234 5678' },
      { customerId: 'C008', name: 'Emma Johnson',    email: 'emma.j@gmail.com', phone: '+1 415 555 0142' },
      { customerId: 'C009', name: 'Pham Van Hung',   email: 'phamhung@vnn.vn', phone: '0934567812' },
      { customerId: 'C010', name: 'Olivia Martin',   email: 'olivia.m@gmail.com', phone: '+33 6 12 34 56 78' }
    ];
    const statuses = ['confirmed','pending','completed','cancelled','confirmed','completed','confirmed'];
    const channels = ['Direct','Booking.com','Klook','TripAdvisor','Viator','Direct'];
    const out = [];
    let id = 1001;
    const today = new Date('2026-05-06');
    for (let i = 0; i < 60; i++) {
      const tour = tours[i % tours.length];
      const guest = guests[i % guests.length];
      const dayOffset = Math.round((Math.random() - 0.45) * 80); // most past, some upcoming
      const d = new Date(today);
      d.setDate(d.getDate() + dayOffset);
      const guestsCount = 1 + Math.floor(Math.random() * 5);
      const total = tour.priceVND * guestsCount;
      const paid = Math.random() < 0.7 ? total : Math.floor(total * (Math.random() * 0.7 + 0.3));
      out.push({
        id: 'BK' + (id++),
        date: d.toISOString().slice(0,10),
        createdAt: d.toISOString(),
        type: 'tour',
        productId: tour.id,
        productTitle: tour.title,
        customerId: guest.customerId,
        customerName: guest.name,
        email: guest.email,
        phone: guest.phone,
        guests: guestsCount,
        total,
        paid,
        status: statuses[Math.floor(Math.random()*statuses.length)],
        channel: channels[Math.floor(Math.random()*channels.length)]
      });
    }
    return out.sort((a,b) => b.date.localeCompare(a.date));
  }

  const SUPPLIERS_SEED = [
    { id: 'S01', name: 'Boat Operator – Anh Tuan', category: 'Boat / Cruise', contact: 'Mr. Tuan', phone: '0905 111 222', email: 'tuan.boat@catba.vn', terms: 'Net 15' },
    { id: 'S02', name: 'Kayak Rental Co.',         category: 'Equipment',     contact: 'Ms. Lan',  phone: '0905 333 444', email: 'lan.kayak@catba.vn',  terms: 'Net 30' },
    { id: 'S03', name: 'Viet Hai Village Lunch',   category: 'F&B',           contact: 'Mr. Tho',  phone: '0905 555 666', email: 'tho@viethai.vn',      terms: 'Net 7' },
    { id: 'S04', name: 'Transfer Bus – Hai Phong', category: 'Transport',     contact: 'Mr. Hung', phone: '0905 777 888', email: 'hung.bus@hp.vn',      terms: 'Net 30' },
    { id: 'S05', name: 'National Park Guides',     category: 'Guides',        contact: 'Mr. Khoa', phone: '0905 999 000', email: 'khoa.guide@catba.vn', terms: 'Net 15' },
    { id: 'S06', name: 'Healing Camp Linen',       category: 'Housekeeping',  contact: 'Ms. Mai',  phone: '0904 123 456', email: 'mai@linen.vn',        terms: 'Net 30' }
  ];

  function payablesSeed() {
    const list = [];
    let id = 5001;
    const today = new Date('2026-05-06');
    SUPPLIERS_SEED.forEach((s, idx) => {
      const count = 1 + Math.floor(Math.random()*3);
      for (let i = 0; i < count; i++) {
        const issued = new Date(today);
        issued.setDate(issued.getDate() - (10 + Math.floor(Math.random()*60)));
        const due = new Date(issued);
        due.setDate(due.getDate() + parseInt(s.terms.replace(/\D/g,''), 10));
        const amount = (1 + Math.floor(Math.random()*9)) * 1000000;
        const paid = Math.random() < 0.5 ? amount : Math.floor(amount * Math.random() * 0.8);
        const status = paid >= amount ? 'paid' : (due < today ? 'overdue' : 'open');
        list.push({
          id: 'INV-' + (id++),
          supplierId: s.id,
          supplierName: s.name,
          issued: issued.toISOString().slice(0,10),
          due: due.toISOString().slice(0,10),
          amount, paid, status,
          note: ['Tháng ' + (issued.getMonth()+1) + ' — dịch vụ định kỳ', 'Đặt nhóm tour', 'Bữa trưa Viet Hai', 'Đưa đón Hà Nội', 'Hướng dẫn viên'][idx % 5]
        });
      }
    });
    return list.sort((a,b) => a.due.localeCompare(b.due));
  }

  const BLOG_SEED = [
    {
      id: 'B001',
      title: 'Cẩm nang du lịch Cát Bà mùa hè 2026',
      slug: 'cam-nang-du-lich-cat-ba-2026',
      author: 'Admin Catba',
      category: 'Guideline',
      status: 'published',
      published: '2026-04-12',
      excerpt: 'Mọi thứ bạn cần biết khi đến Cát Bà và Lan Hạ mùa hè này — từ phương tiện đến tour & nơi lưu trú.',
      content: 'Nội dung bài blog đầy đủ ở đây — chỉnh sửa trong trang Blog của admin.'
    },
    {
      id: 'B002',
      title: 'Top 5 trải nghiệm chèo kayak ở vịnh Lan Hạ',
      slug: 'top-5-kayak-lan-ha',
      author: 'Admin Catba',
      category: 'Adventure',
      status: 'published',
      published: '2026-03-22',
      excerpt: 'Từ kayak đêm với sinh vật phát quang đến hang Sáng / hang Tối — đây là 5 cung kayak đẹp nhất.',
      content: 'Nội dung bài blog đầy đủ ở đây.'
    },
    {
      id: 'B003',
      title: 'Vì sao bạn nên ở Healing Camp ít nhất 1 đêm',
      slug: 'healing-camp-mot-dem',
      author: 'Admin Catba',
      category: 'Stays',
      status: 'draft',
      published: '',
      excerpt: 'Một đêm không sóng wifi, chỉ có gió biển, đồ ăn lành và những giấc ngủ sâu.',
      content: 'Nội dung bài blog đầy đủ ở đây.'
    }
  ];

  // ---------- Storage helpers ----------
  function load(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (_) {
      return fallback;
    }
  }
  function save(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function seedIfNeeded() {
    if (localStorage.getItem(KEYS.seeded)) return;
    save(KEYS.tours, TOUR_SEED);
    save(KEYS.stays, STAY_SEED);
    save(KEYS.customers, CUSTOMERS_SEED);
    save(KEYS.suppliers, SUPPLIERS_SEED);
    save(KEYS.payables, payablesSeed());
    save(KEYS.bookings, bookingsSeed());
    save(KEYS.blog, BLOG_SEED);
    localStorage.setItem(KEYS.seeded, '1');
  }

  // ---------- Public API ----------
  const Store = {
    seed: seedIfNeeded,

    bookings: {
      all: () => load(KEYS.bookings, []),
      save: (list) => save(KEYS.bookings, list),
      update: (id, patch) => {
        const list = Store.bookings.all();
        const idx = list.findIndex((b) => b.id === id);
        if (idx >= 0) {
          list[idx] = { ...list[idx], ...patch };
          save(KEYS.bookings, list);
        }
        return list[idx];
      },
      remove: (id) => {
        const list = Store.bookings.all().filter((b) => b.id !== id);
        save(KEYS.bookings, list);
      }
    },

    customers: {
      all: () => load(KEYS.customers, []),
      save: (list) => save(KEYS.customers, list),
      get: (id) => Store.customers.all().find((c) => c.id === id)
    },

    suppliers: {
      all: () => load(KEYS.suppliers, []),
      save: (list) => save(KEYS.suppliers, list),
      add: (s) => {
        const list = Store.suppliers.all();
        list.push(s);
        save(KEYS.suppliers, list);
      },
      update: (id, patch) => {
        const list = Store.suppliers.all();
        const idx = list.findIndex((s) => s.id === id);
        if (idx >= 0) {
          list[idx] = { ...list[idx], ...patch };
          save(KEYS.suppliers, list);
        }
      },
      remove: (id) => {
        save(KEYS.suppliers, Store.suppliers.all().filter((s) => s.id !== id));
      }
    },

    payables: {
      all: () => load(KEYS.payables, []),
      save: (list) => save(KEYS.payables, list),
      add: (p) => {
        const list = Store.payables.all();
        list.push(p);
        save(KEYS.payables, list);
      },
      update: (id, patch) => {
        const list = Store.payables.all();
        const idx = list.findIndex((s) => s.id === id);
        if (idx >= 0) {
          list[idx] = { ...list[idx], ...patch };
          save(KEYS.payables, list);
        }
      },
      remove: (id) => {
        save(KEYS.payables, Store.payables.all().filter((p) => p.id !== id));
      }
    },

    blog: {
      all: () => load(KEYS.blog, []),
      save: (list) => save(KEYS.blog, list),
      add: (b) => {
        const list = Store.blog.all();
        list.unshift(b);
        save(KEYS.blog, list);
      },
      update: (id, patch) => {
        const list = Store.blog.all();
        const idx = list.findIndex((s) => s.id === id);
        if (idx >= 0) {
          list[idx] = { ...list[idx], ...patch };
          save(KEYS.blog, list);
        }
      },
      remove: (id) => {
        save(KEYS.blog, Store.blog.all().filter((b) => b.id !== id));
      }
    },

    tours: {
      all: () => load(KEYS.tours, []),
      save: (list) => save(KEYS.tours, list),
      update: (id, patch) => {
        const list = Store.tours.all();
        const idx = list.findIndex((s) => s.id === id);
        if (idx >= 0) {
          list[idx] = { ...list[idx], ...patch };
          save(KEYS.tours, list);
        }
      },
      remove: (id) => {
        save(KEYS.tours, Store.tours.all().filter((t) => t.id !== id));
      },
      add: (t) => {
        const list = Store.tours.all();
        list.unshift(t);
        save(KEYS.tours, list);
      }
    },

    stays: {
      all: () => load(KEYS.stays, []),
      save: (list) => save(KEYS.stays, list),
      update: (id, patch) => {
        const list = Store.stays.all();
        const idx = list.findIndex((s) => s.id === id);
        if (idx >= 0) {
          list[idx] = { ...list[idx], ...patch };
          save(KEYS.stays, list);
        }
      },
      remove: (id) => {
        save(KEYS.stays, Store.stays.all().filter((s) => s.id !== id));
      },
      add: (s) => {
        const list = Store.stays.all();
        list.unshift(s);
        save(KEYS.stays, list);
      }
    },

    reset: () => {
      Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
      seedIfNeeded();
    }
  };

  // ---------- Helpers ----------
  const Fmt = {
    vnd: (n) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(n || 0),
    num: (n) => new Intl.NumberFormat('vi-VN').format(n || 0),
    date: (s) => {
      if (!s) return '—';
      try {
        return new Date(s).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
      } catch (_) { return s; }
    }
  };

  window.Store = Store;
  window.Fmt = Fmt;
})();
