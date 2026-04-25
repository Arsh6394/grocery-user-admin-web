// Browser-side helper for talking to /api/admin/* with JWT auth.
(function () {
  const TOKEN_KEY = 'adminToken';
  const ADMIN_KEY = 'adminInfo';

  function getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  function getAdmin() {
    try { return JSON.parse(localStorage.getItem(ADMIN_KEY) || 'null'); } catch { return null; }
  }

  function clear() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ADMIN_KEY);
  }

  async function request(path, opts = {}) {
    const token = getToken();
    const headers = Object.assign(
      { 'Content-Type': 'application/json' },
      opts.headers || {},
      token ? { Authorization: 'Bearer ' + token } : {}
    );
    const res = await fetch(path, { ...opts, headers });
    if (res.status === 401) {
      clear();
      if (!path.endsWith('/login')) window.location = 'admin-login.html';
      throw new Error('Unauthorized');
    }
    const ct = res.headers.get('content-type') || '';
    const body = ct.includes('application/json') ? await res.json() : await res.text();
    if (!res.ok) {
      const msg = (body && body.error) || res.statusText || 'Request failed';
      throw new Error(msg);
    }
    return body;
  }

  async function login(email, password) {
    const data = await request('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(ADMIN_KEY, JSON.stringify(data.admin));
    return data;
  }

  function logout() {
    clear();
    window.location = 'admin-login.html';
  }

  function requireAuth() {
    if (!getToken()) {
      window.location = 'admin-login.html';
      return false;
    }
    return true;
  }

  window.AdminAPI = {
    getToken,
    getAdmin,
    login,
    logout,
    requireAuth,
    stats: () => request('/api/admin/stats'),
    products: {
      list: () => request('/api/admin/products'),
      create: (p) => request('/api/admin/products', { method: 'POST', body: JSON.stringify(p) }),
      update: (p) => request('/api/admin/products', { method: 'PUT', body: JSON.stringify(p) }),
      remove: (id) => request('/api/admin/products?id=' + encodeURIComponent(id), { method: 'DELETE' })
    },
    orders: {
      list: () => request('/api/admin/orders'),
      update: (o) => request('/api/admin/orders', { method: 'PUT', body: JSON.stringify(o) })
    },
    users: {
      list: () => request('/api/admin/users')
    }
  };
})();
