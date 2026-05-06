/* Optional Supabase backend adapter — uses REST API directly (no SDK).
   When connected, can pull/push data between localStorage and Supabase. */
(function () {
  'use strict';

  const CFG_KEY = 'cbo_admin_backend_cfg';
  const TABLES = ['tours','stays','customers','suppliers','payables','bookings','blog'];

  const StoreKeys = {
    tours: 'cbo_admin_tours',
    stays: 'cbo_admin_stays',
    customers: 'cbo_admin_customers',
    suppliers: 'cbo_admin_suppliers',
    payables: 'cbo_admin_payables',
    bookings: 'cbo_admin_bookings',
    blog: 'cbo_admin_blog'
  };

  function getConfig() {
    try { return JSON.parse(localStorage.getItem(CFG_KEY) || 'null'); } catch (_) { return null; }
  }
  function setConfig(cfg) {
    if (!cfg) localStorage.removeItem(CFG_KEY);
    else localStorage.setItem(CFG_KEY, JSON.stringify(cfg));
  }
  function isConnected() {
    const cfg = getConfig();
    return !!(cfg && cfg.url && cfg.anonKey);
  }

  function headers(cfg, extra) {
    return Object.assign({
      apikey: cfg.anonKey,
      Authorization: 'Bearer ' + cfg.anonKey,
      'Content-Type': 'application/json',
      Prefer: 'return=representation'
    }, extra || {});
  }

  async function ping(url, anonKey) {
    if (!url || !anonKey) return { ok: false, error: 'Cần URL và anon key' };
    try {
      const u = url.replace(/\/+$/, '') + '/rest/v1/';
      const res = await fetch(u, { headers: { apikey: anonKey, Authorization: 'Bearer ' + anonKey } });
      if (!res.ok) return { ok: false, error: 'HTTP ' + res.status };
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e.message || 'Không kết nối được' };
    }
  }

  async function fetchTable(cfg, table) {
    const url = cfg.url.replace(/\/+$/, '') + '/rest/v1/' + table + '?select=*';
    const res = await fetch(url, { headers: headers(cfg) });
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(table + ': HTTP ' + res.status + ' ' + txt.slice(0, 200));
    }
    return await res.json();
  }

  async function upsertTable(cfg, table, rows) {
    if (!rows || !rows.length) return { ok: true, count: 0 };
    const url = cfg.url.replace(/\/+$/, '') + '/rest/v1/' + table;
    const res = await fetch(url, {
      method: 'POST',
      headers: headers(cfg, { Prefer: 'resolution=merge-duplicates,return=minimal' }),
      body: JSON.stringify(rows)
    });
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(table + ': HTTP ' + res.status + ' ' + txt.slice(0, 200));
    }
    return { ok: true, count: rows.length };
  }

  async function clearTable(cfg, table) {
    const url = cfg.url.replace(/\/+$/, '') + '/rest/v1/' + table + '?id=neq.__never__';
    const res = await fetch(url, { method: 'DELETE', headers: headers(cfg) });
    if (!res.ok && res.status !== 404) {
      const txt = await res.text();
      throw new Error(table + ': HTTP ' + res.status + ' ' + txt.slice(0, 200));
    }
  }

  function dataAsRows(table) {
    const raw = localStorage.getItem(StoreKeys[table]);
    if (!raw) return [];
    try {
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    } catch (_) { return []; }
  }

  function setData(table, rows) {
    localStorage.setItem(StoreKeys[table], JSON.stringify(rows || []));
  }

  async function pullAll() {
    const cfg = getConfig();
    if (!cfg) return { ok: false, error: 'Chưa kết nối Supabase' };
    const summary = {};
    for (const t of TABLES) {
      try {
        const rows = await fetchTable(cfg, t);
        setData(t, rows);
        summary[t] = rows.length;
      } catch (e) {
        return { ok: false, error: 'Lỗi pull ' + t + ': ' + e.message, summary };
      }
    }
    return { ok: true, summary };
  }

  async function pushAll() {
    const cfg = getConfig();
    if (!cfg) return { ok: false, error: 'Chưa kết nối Supabase' };
    const summary = {};
    for (const t of TABLES) {
      try {
        const rows = dataAsRows(t);
        await upsertTable(cfg, t, rows);
        summary[t] = rows.length;
      } catch (e) {
        return { ok: false, error: 'Lỗi push ' + t + ': ' + e.message, summary };
      }
    }
    return { ok: true, summary };
  }

  window.Backend = { getConfig, setConfig, isConnected, ping, pullAll, pushAll, TABLES };
})();
