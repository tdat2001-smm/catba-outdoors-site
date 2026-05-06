/* Auth utilities — client-side. Uses sessionStorage for session, localStorage for users. */
(function () {
  'use strict';

  const USERS_KEY = 'cbo_admin_users';
  const SESSION_KEY = 'cbo_admin_session';
  const SESSION_HOURS = 8;

  // Default user seeded on first visit
  const DEFAULT_USER = {
    username: 'admin',
    // sha-256 of 'catba2026'
    passwordHash: '',
    name: 'Admin Catba',
    role: 'Owner',
    email: 'admin@catbaoutdoors.vn'
  };

  async function sha256(text) {
    const buf = new TextEncoder().encode(text);
    const digest = await crypto.subtle.digest('SHA-256', buf);
    return Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }

  async function getUsers() {
    const raw = localStorage.getItem(USERS_KEY);
    if (raw) return JSON.parse(raw);
    const u = { ...DEFAULT_USER };
    u.passwordHash = await sha256('catba2026');
    const arr = [u];
    localStorage.setItem(USERS_KEY, JSON.stringify(arr));
    return arr;
  }

  async function login(username, password) {
    const users = await getUsers();
    const hash = await sha256(password);
    const user = users.find(
      (u) => u.username.toLowerCase() === username.toLowerCase() && u.passwordHash === hash
    );
    if (!user) return { ok: false, error: 'Sai tên đăng nhập hoặc mật khẩu' };
    const session = {
      username: user.username,
      name: user.name,
      role: user.role,
      email: user.email,
      expires: Date.now() + SESSION_HOURS * 3600 * 1000
    };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return { ok: true, user: session };
  }

  function logout() {
    sessionStorage.removeItem(SESSION_KEY);
    window.location.href = 'index.html';
  }

  function getSession() {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      const s = JSON.parse(raw);
      if (Date.now() > s.expires) {
        sessionStorage.removeItem(SESSION_KEY);
        return null;
      }
      return s;
    } catch (_) {
      return null;
    }
  }

  function requireAuth() {
    const s = getSession();
    if (!s) {
      window.location.href = 'index.html';
      return null;
    }
    return s;
  }

  window.Auth = { login, logout, getSession, requireAuth };
})();
