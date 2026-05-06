/* Auth utilities — multi-user with roles. Uses localStorage for users + sessionStorage for session. */
(function () {
  'use strict';

  const USERS_KEY = 'cbo_admin_users';
  const SESSION_KEY = 'cbo_admin_session';
  const SESSION_HOURS = 8;

  const ROLES = {
    owner: {
      key: 'owner',
      label: 'Owner',
      pages: ['dashboard','bookings','customers','revenue','suppliers','services','blog','users','settings'],
      can: { manageUsers: true, manageFinance: true, manageContent: true, manageBookings: true, manageBackend: true }
    },
    manager: {
      key: 'manager',
      label: 'Manager',
      pages: ['dashboard','bookings','customers','revenue','suppliers','services','blog','settings'],
      can: { manageUsers: false, manageFinance: true, manageContent: true, manageBookings: true, manageBackend: false }
    },
    staff: {
      key: 'staff',
      label: 'Staff',
      pages: ['dashboard','bookings','customers','services','blog','settings'],
      can: { manageUsers: false, manageFinance: false, manageContent: true, manageBookings: true, manageBackend: false }
    }
  };

  async function sha256(text) {
    const buf = new TextEncoder().encode(text);
    const digest = await crypto.subtle.digest('SHA-256', buf);
    return Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }

  function uid() {
    return 'U' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }

  async function ensureSeedUser() {
    let raw = localStorage.getItem(USERS_KEY);
    if (raw) {
      try {
        const list = JSON.parse(raw);
        if (Array.isArray(list) && list.length) return list;
      } catch (_) {}
    }
    const seed = [{
      id: uid(),
      username: 'admin',
      passwordHash: await sha256('catba2026'),
      name: 'Admin Catba',
      role: 'owner',
      email: 'admin@catbaoutdoors.vn',
      status: 'active',
      createdAt: new Date().toISOString(),
      lastLogin: null
    }];
    localStorage.setItem(USERS_KEY, JSON.stringify(seed));
    return seed;
  }

  function getUsersSync() {
    try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]'); } catch (_) { return []; }
  }

  function saveUsers(list) {
    localStorage.setItem(USERS_KEY, JSON.stringify(list));
  }

  async function login(username, password) {
    const users = await ensureSeedUser();
    const hash = await sha256(password);
    const user = users.find(
      (u) => u.username.toLowerCase() === (username || '').toLowerCase() &&
             u.passwordHash === hash &&
             u.status !== 'disabled'
    );
    if (!user) return { ok: false, error: 'Sai tên đăng nhập hoặc mật khẩu' };

    user.lastLogin = new Date().toISOString();
    saveUsers(users);

    const session = {
      id: user.id,
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
    } catch (_) { return null; }
  }

  function requireAuth() {
    const s = getSession();
    if (!s) { window.location.href = 'index.html'; return null; }
    return s;
  }

  function requirePage(page) {
    const s = requireAuth();
    if (!s) return null;
    const role = ROLES[s.role] || ROLES.staff;
    if (role.pages && !role.pages.includes(page)) {
      window.location.href = 'dashboard.html';
      return null;
    }
    return s;
  }

  function can(action) {
    const s = getSession();
    if (!s) return false;
    const role = ROLES[s.role];
    if (!role) return false;
    return !!(role.can && role.can[action]);
  }

  function listUsers() {
    return getUsersSync().map((u) => ({
      id: u.id, username: u.username, name: u.name, role: u.role,
      email: u.email, status: u.status, createdAt: u.createdAt, lastLogin: u.lastLogin
    }));
  }

  async function createUser({ username, password, name, role, email }) {
    const users = getUsersSync();
    if (users.some((u) => u.username.toLowerCase() === username.toLowerCase())) {
      return { ok: false, error: 'Tên đăng nhập đã tồn tại' };
    }
    if (!ROLES[role]) return { ok: false, error: 'Vai trò không hợp lệ' };
    if (!password || password.length < 6) return { ok: false, error: 'Mật khẩu cần ≥ 6 ký tự' };

    users.push({
      id: uid(),
      username: username.trim(),
      passwordHash: await sha256(password),
      name: (name || username).trim(),
      role,
      email: (email || '').trim(),
      status: 'active',
      createdAt: new Date().toISOString(),
      lastLogin: null
    });
    saveUsers(users);
    return { ok: true };
  }

  async function updateUser(id, { name, role, email, status, password }) {
    const users = getUsersSync();
    const idx = users.findIndex((u) => u.id === id);
    if (idx < 0) return { ok: false, error: 'Không tìm thấy user' };
    if (name !== undefined) users[idx].name = name;
    if (role !== undefined) {
      if (!ROLES[role]) return { ok: false, error: 'Vai trò không hợp lệ' };
      users[idx].role = role;
    }
    if (email !== undefined) users[idx].email = email;
    if (status !== undefined) users[idx].status = status;
    if (password) {
      if (password.length < 6) return { ok: false, error: 'Mật khẩu cần ≥ 6 ký tự' };
      users[idx].passwordHash = await sha256(password);
    }
    saveUsers(users);
    return { ok: true };
  }

  function removeUser(id) {
    const users = getUsersSync();
    const target = users.find((u) => u.id === id);
    if (!target) return { ok: false, error: 'Không tìm thấy' };
    if (target.role === 'owner' && users.filter((u) => u.role === 'owner').length <= 1) {
      return { ok: false, error: 'Không thể xoá Owner cuối cùng' };
    }
    saveUsers(users.filter((u) => u.id !== id));
    return { ok: true };
  }

  async function changePassword(id, currentPassword, newPassword) {
    const users = getUsersSync();
    const idx = users.findIndex((u) => u.id === id);
    if (idx < 0) return { ok: false, error: 'Không tìm thấy user' };
    if (currentPassword !== null) {
      const hash = await sha256(currentPassword);
      if (users[idx].passwordHash !== hash) return { ok: false, error: 'Mật khẩu hiện tại không đúng' };
    }
    if (!newPassword || newPassword.length < 6) return { ok: false, error: 'Mật khẩu mới cần ≥ 6 ký tự' };
    users[idx].passwordHash = await sha256(newPassword);
    saveUsers(users);
    return { ok: true };
  }

  async function updateProfile(id, { name, email }) {
    const result = await updateUser(id, { name, email });
    if (!result.ok) return result;
    const session = getSession();
    if (session && session.id === id) {
      if (name !== undefined) session.name = name;
      if (email !== undefined) session.email = email;
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    }
    return { ok: true };
  }

  window.Auth = {
    ROLES, login, logout, getSession, requireAuth, requirePage, can,
    listUsers, createUser, updateUser, removeUser, changePassword, updateProfile,
    ensureSeedUser
  };
})();
