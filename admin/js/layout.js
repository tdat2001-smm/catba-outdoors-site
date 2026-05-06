/* Shared admin layout: sidebar, topbar, toast, modal helpers. */
(function () {
  'use strict';

  const NAV = [
    { id: 'dashboard', label: 'Tổng quan',         href: 'dashboard.html', icon: iconDashboard, group: 'Vận hành' },
    { id: 'bookings',  label: 'Đặt dịch vụ',       href: 'bookings.html',  icon: iconCalendar,  group: 'Vận hành' },
    { id: 'customers', label: 'Khách hàng',        href: 'customers.html', icon: iconUsers,     group: 'Vận hành' },
    { id: 'revenue',   label: 'Doanh thu',         href: 'revenue.html',   icon: iconChart,     group: 'Tài chính' },
    { id: 'suppliers', label: 'Công nợ NCC',       href: 'suppliers.html', icon: iconWallet,    group: 'Tài chính' },
    { id: 'services',  label: 'Tour & Dịch vụ',    href: 'services.html',  icon: iconBox,       group: 'Nội dung' },
    { id: 'blog',      label: 'Blog & Bài viết',   href: 'blog.html',      icon: iconBlog,      group: 'Nội dung' }
  ];

  function iconDashboard() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>';
  }
  function iconCalendar() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>';
  }
  function iconUsers() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>';
  }
  function iconChart() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>';
  }
  function iconWallet() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12V8H6a2 2 0 0 1 0-4h12v4"/><path d="M4 6v12a2 2 0 0 0 2 2h14v-4"/><path d="M18 12a2 2 0 0 0 0 4h4v-4z"/></svg>';
  }
  function iconBox() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>';
  }
  function iconBlog() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>';
  }
  function iconLogout() {
    return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>';
  }
  function iconMenu() {
    return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
  }

  function initials(name) {
    return name.split(' ').map((p) => p[0]).slice(-2).join('').toUpperCase();
  }

  function renderLayout(opts) {
    const session = Auth.requireAuth();
    if (!session) return null;
    Store.seed();

    const active = opts.active;
    const grouped = {};
    NAV.forEach((n) => {
      if (!grouped[n.group]) grouped[n.group] = [];
      grouped[n.group].push(n);
    });

    let navHtml = '';
    Object.keys(grouped).forEach((group) => {
      navHtml += `<div class="sidebar-section">${group}</div><ul class="sidebar-nav">`;
      grouped[group].forEach((n) => {
        navHtml += `<li><a href="${n.href}" class="${n.id === active ? 'active' : ''}">${n.icon()} <span>${n.label}</span></a></li>`;
      });
      navHtml += '</ul>';
    });

    const html = `
      <div class="app">
        <aside class="sidebar" id="sidebar">
          <div class="sidebar-brand">
            <div class="logo">🌊</div>
            <div class="name">Catba PMS<span>Admin Console</span></div>
          </div>
          ${navHtml}
          <div class="sidebar-foot">
            <div class="avatar">${initials(session.name)}</div>
            <div class="who">${session.name}<small>${session.role}</small></div>
            <button title="Đăng xuất" id="logoutBtn">${iconLogout()}</button>
          </div>
        </aside>
        <main class="main">
          <header class="topbar">
            <div>
              <h1>${opts.title}</h1>
              <div class="breadcrumb">${opts.breadcrumb || ''}</div>
            </div>
            <div class="actions">
              <button class="nav-toggle" id="navToggle">${iconMenu()}</button>
              ${opts.actions || ''}
            </div>
          </header>
          <section class="content" id="content">${opts.content || ''}</section>
        </main>
      </div>
      <div class="modal-overlay" id="modalOverlay"></div>
      <div class="toast" id="toast"></div>
    `;

    document.getElementById('app-root').innerHTML = html;

    document.getElementById('logoutBtn').addEventListener('click', () => Auth.logout());
    const toggle = document.getElementById('navToggle');
    if (toggle) toggle.addEventListener('click', () => {
      document.getElementById('sidebar').classList.toggle('open');
    });

    return session;
  }

  function toast(msg, type) {
    const el = document.getElementById('toast');
    if (!el) return;
    el.className = 'toast ' + (type || '');
    el.textContent = msg;
    requestAnimationFrame(() => el.classList.add('show'));
    setTimeout(() => el.classList.remove('show'), 2400);
  }

  function openModal({ title, body, footer, onClose }) {
    const overlay = document.getElementById('modalOverlay');
    overlay.innerHTML = `
      <div class="modal" role="dialog" aria-modal="true">
        <div class="modal-head">
          <h3>${title}</h3>
          <button class="modal-close" id="modalCloseBtn">×</button>
        </div>
        <div class="modal-body">${body || ''}</div>
        ${footer ? `<div class="modal-foot">${footer}</div>` : ''}
      </div>
    `;
    overlay.classList.add('open');
    const close = () => {
      overlay.classList.remove('open');
      overlay.innerHTML = '';
      if (onClose) onClose();
    };
    overlay.querySelector('#modalCloseBtn').addEventListener('click', close);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close();
    });
    return { close, root: overlay.querySelector('.modal') };
  }

  function escapeHtml(s) {
    if (s === null || s === undefined) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  window.AdminUI = { renderLayout, toast, openModal, escapeHtml };
})();
