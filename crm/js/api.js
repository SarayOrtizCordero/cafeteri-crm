/* ============================================================
   API.JS — Capa de datos del CRM
   Para conectar Supabase real: reemplazá SUPABASE_URL y
   SUPABASE_ANON_KEY con los valores de tu proyecto en
   supabase.com y cargá el SDK via CDN en cada página CRM.
   ============================================================ */

// ── CONFIGURACIÓN ─────────────────────────────────────────────
// Reemplazá estos valores con los de tu proyecto en supabase.com
// (Settings → API → Project URL y anon/public key).
// Sin credenciales válidas el CRM opera en modo demo (sin persistencia).
const SUPABASE_URL      = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

let supabase = null;
const _supabaseConfigured = (SUPABASE_URL !== 'YOUR_SUPABASE_URL');
if (_supabaseConfigured && typeof window !== 'undefined' && window.supabase) {
  try {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: true, autoRefreshToken: true },
    });
  } catch (e) {
    console.warn('[CRM] No se pudo inicializar Supabase, usando modo demo:', e.message);
  }
}

// true cuando no hay cliente Supabase configurado
const DEMO_MODE = !supabase;

// ── OBJETO DB ─────────────────────────────────────────────────
// Punto de acceso único a los datos. En DEMO_MODE opera sobre
// los arrays de data.js; en producción delega en Supabase.

const DB = {

  async getSession() {
    if (DEMO_MODE) {
      const s = localStorage.getItem('crm_session');
      if (!s) return null;
      try {
        const session = JSON.parse(s);
        if (session?.expires_at && session.expires_at < Date.now()) {
          localStorage.removeItem('crm_session');
          return null;
        }
        return session;
      } catch { return null; }
    }
    const { data } = await supabase.auth.getSession();
    return data?.session ?? null;
  },

  async login(email, password) {
    if (DEMO_MODE) {
      const user = DEMO_USERS.find(u => u.email === email && u.password === password);
      if (!user) return { error: 'Credenciales incorrectas.' };
      const session = { user, expires_at: Date.now() + 3600000 };
      localStorage.setItem('crm_session', JSON.stringify(session));
      return { data: session };
    }
    return await supabase.auth.signInWithPassword({ email, password });
  },

  async logout() {
    if (DEMO_MODE) {
      localStorage.removeItem('crm_session');
      return { error: null };
    }
    return await supabase.auth.signOut();
  },

  // ── DASHBOARD ──
  async getDashboardData() {
    if (DEMO_MODE) {
      const todayStr = new Date().toDateString();
      const reservasHoy         = DEMO_RESERVATIONS.filter(r => new Date(r.reservation_date).toDateString() === todayStr && r.status !== 'cancelada').length;
      const pedidosPendientes   = DEMO_ORDERS.filter(o => o.status === 'pendiente' || o.status === 'en_preparacion').length;
      const incidenciasAbiertas = DEMO_INCIDENTS.filter(i => i.status === 'abierta' || i.status === 'en_proceso').length;
      const mensajesPendientes  = (() => {
        const customerIds = [...new Set(DEMO_MESSAGES.map(m => m.customer_id))];
        return customerIds.filter(cid => {
          const msgs = DEMO_MESSAGES.filter(m => m.customer_id === cid).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
          return msgs[0]?.direction === 'incoming';
        }).length;
      })();
      const totalClientes = DEMO_CUSTOMERS.length;
      return { data: { reservasHoy, pedidosPendientes, incidenciasAbiertas, mensajesPendientes, totalClientes }, error: null };
    }
    return { data: null, error: 'No implementado' };
  },

  // ── CUSTOMERS ──
  async getCustomers({ search = '' } = {}) {
    if (DEMO_MODE) {
      let data = [...DEMO_CUSTOMERS];
      if (search) {
        const q = search.toLowerCase();
        data = data.filter(c =>
          c.name.toLowerCase().includes(q) ||
          c.surname.toLowerCase().includes(q) ||
          (c.email || '').toLowerCase().includes(q) ||
          (c.phone || '').includes(q)
        );
      }
      data.sort((a, b) => a.name.localeCompare(b.name));
      return { data, error: null };
    }
    let q = supabase.from('customers').select('*').order('name');
    if (search) q = q.or(`name.ilike.%${search}%,surname.ilike.%${search}%,email.ilike.%${search}%`);
    return await q;
  },

  async getCustomer(id) {
    if (DEMO_MODE) {
      const data = DEMO_CUSTOMERS.find(c => c.id === id);
      return { data: data || null, error: data ? null : 'No encontrado' };
    }
    return await supabase.from('customers').select('*').eq('id', id).single();
  },

  async createCustomer(customer) {
    if (DEMO_MODE) {
      const newC = { ...customer, id: 'c' + Date.now(), created_at: new Date().toISOString() };
      DEMO_CUSTOMERS.push(newC);
      return { data: newC, error: null };
    }
    return await supabase.from('customers').insert(customer).select().single();
  },

  async updateCustomer(id, updates) {
    if (DEMO_MODE) {
      const idx = DEMO_CUSTOMERS.findIndex(c => c.id === id);
      if (idx === -1) return { error: 'No encontrado' };
      DEMO_CUSTOMERS[idx] = { ...DEMO_CUSTOMERS[idx], ...updates };
      return { data: DEMO_CUSTOMERS[idx], error: null };
    }
    return await supabase.from('customers').update(updates).eq('id', id).select().single();
  },

  async deleteCustomer(id) {
    if (DEMO_MODE) {
      const idx = DEMO_CUSTOMERS.findIndex(c => c.id === id);
      if (idx !== -1) DEMO_CUSTOMERS.splice(idx, 1);
      return { error: null };
    }
    return await supabase.from('customers').delete().eq('id', id);
  },

  // ── RESERVATIONS ──
  async getReservations({ date = null, status = null, search = '' } = {}) {
    if (DEMO_MODE) {
      let data = DEMO_RESERVATIONS.map(r => ({
        ...r,
        customer: DEMO_CUSTOMERS.find(c => c.id === r.customer_id) || null,
      }));
      if (date) {
        const d = new Date(date).toDateString();
        data = data.filter(r => new Date(r.reservation_date).toDateString() === d);
      }
      if (status) data = data.filter(r => r.status === status);
      if (search) {
        const q = search.toLowerCase();
        data = data.filter(r =>
          r.customer?.name.toLowerCase().includes(q) ||
          r.customer?.surname.toLowerCase().includes(q)
        );
      }
      data.sort((a, b) => new Date(a.reservation_date) - new Date(b.reservation_date));
      return { data, error: null };
    }
    let q = supabase.from('reservations').select('*, customer:customers(*)').order('reservation_date');
    if (date) q = q.gte('reservation_date', date + 'T00:00:00').lte('reservation_date', date + 'T23:59:59');
    if (status) q = q.eq('status', status);
    return await q;
  },

  async createReservation(res) {
    if (DEMO_MODE) {
      const newR = { ...res, id: 'r' + Date.now(), created_at: new Date().toISOString() };
      DEMO_RESERVATIONS.push(newR);
      return { data: newR, error: null };
    }
    return await supabase.from('reservations').insert(res).select().single();
  },

  async updateReservation(id, updates) {
    if (DEMO_MODE) {
      const idx = DEMO_RESERVATIONS.findIndex(r => r.id === id);
      if (idx === -1) return { error: 'No encontrado' };
      DEMO_RESERVATIONS[idx] = { ...DEMO_RESERVATIONS[idx], ...updates };
      return { data: DEMO_RESERVATIONS[idx], error: null };
    }
    return await supabase.from('reservations').update(updates).eq('id', id).select().single();
  },

  async deleteReservation(id) {
    if (DEMO_MODE) {
      const idx = DEMO_RESERVATIONS.findIndex(r => r.id === id);
      if (idx !== -1) DEMO_RESERVATIONS.splice(idx, 1);
      return { error: null };
    }
    return await supabase.from('reservations').delete().eq('id', id);
  },

  // ── ORDERS ──
  async getOrders({ status = null, search = '' } = {}) {
    if (DEMO_MODE) {
      let data = DEMO_ORDERS.map(o => ({
        ...o,
        customer: DEMO_CUSTOMERS.find(c => c.id === o.customer_id) || null,
      }));
      if (status) data = data.filter(o => o.status === status);
      if (search) {
        const q = search.toLowerCase();
        data = data.filter(o =>
          o.title.toLowerCase().includes(q) ||
          o.customer?.name.toLowerCase().includes(q) ||
          o.customer?.surname.toLowerCase().includes(q)
        );
      }
      data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      return { data, error: null };
    }
    let q = supabase.from('orders').select('*, customer:customers(*)').order('created_at', { ascending: false });
    if (status) q = q.eq('status', status);
    return await q;
  },

  async createOrder(order) {
    if (DEMO_MODE) {
      const newO = { ...order, id: 'o' + Date.now(), created_at: new Date().toISOString() };
      DEMO_ORDERS.push(newO);
      return { data: newO, error: null };
    }
    return await supabase.from('orders').insert(order).select().single();
  },

  async updateOrder(id, updates) {
    if (DEMO_MODE) {
      const idx = DEMO_ORDERS.findIndex(o => o.id === id);
      if (idx === -1) return { error: 'No encontrado' };
      DEMO_ORDERS[idx] = { ...DEMO_ORDERS[idx], ...updates };
      return { data: DEMO_ORDERS[idx], error: null };
    }
    return await supabase.from('orders').update(updates).eq('id', id).select().single();
  },

  async deleteOrder(id) {
    if (DEMO_MODE) {
      const idx = DEMO_ORDERS.findIndex(o => o.id === id);
      if (idx !== -1) DEMO_ORDERS.splice(idx, 1);
      return { error: null };
    }
    return await supabase.from('orders').delete().eq('id', id);
  },

  // ── INCIDENTS ──
  async getIncidents({ status = null, priority = null } = {}) {
    if (DEMO_MODE) {
      let data = DEMO_INCIDENTS.map(i => ({
        ...i,
        customer: DEMO_CUSTOMERS.find(c => c.id === i.customer_id) || null,
      }));
      if (status)   data = data.filter(i => i.status === status);
      if (priority) data = data.filter(i => i.priority === priority);
      data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      return { data, error: null };
    }
    let q = supabase.from('incidents').select('*, customer:customers(*)').order('created_at', { ascending: false });
    if (status)   q = q.eq('status', status);
    if (priority) q = q.eq('priority', priority);
    return await q;
  },

  async createIncident(inc) {
    if (DEMO_MODE) {
      const newI = { ...inc, id: 'inc' + Date.now(), status: inc.status || 'abierta', created_at: new Date().toISOString() };
      DEMO_INCIDENTS.push(newI);
      return { data: newI, error: null };
    }
    return await supabase.from('incidents').insert(inc).select().single();
  },

  async updateIncident(id, updates) {
    if (DEMO_MODE) {
      const idx = DEMO_INCIDENTS.findIndex(i => i.id === id);
      if (idx === -1) return { error: 'No encontrado' };
      DEMO_INCIDENTS[idx] = { ...DEMO_INCIDENTS[idx], ...updates };
      return { data: DEMO_INCIDENTS[idx], error: null };
    }
    return await supabase.from('incidents').update(updates).eq('id', id).select().single();
  },

  // ── MESSAGES ──
  async getConversations() {
    if (DEMO_MODE) {
      const customerIds = [...new Set(DEMO_MESSAGES.map(m => m.customer_id))];
      const data = customerIds.map(cid => {
        const msgs = DEMO_MESSAGES.filter(m => m.customer_id === cid)
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        return {
          customer:     DEMO_CUSTOMERS.find(c => c.id === cid) || null,
          last_message: msgs[0] || null,
          unread:       msgs[0]?.direction === 'incoming' ? 1 : 0,
          count:        msgs.length,
        };
      });
      data.sort((a, b) => new Date(b.last_message?.created_at) - new Date(a.last_message?.created_at));
      return { data, error: null };
    }
    const { data, error } = await supabase.from('messages')
      .select('customer_id, created_at, direction')
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async getMessages(customer_id) {
    if (DEMO_MODE) {
      const data = DEMO_MESSAGES
        .filter(m => m.customer_id === customer_id)
        .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      return { data, error: null };
    }
    return await supabase.from('messages').select('*').eq('customer_id', customer_id).order('created_at');
  },

  async createMessage({ customer_id, message, direction }) {
    if (DEMO_MODE) {
      const newM = { id: 'm' + Date.now(), customer_id, message, direction, created_at: new Date().toISOString() };
      DEMO_MESSAGES.push(newM);
      return { data: newM, error: null };
    }
    return await supabase.from('messages').insert({ customer_id, message, direction }).select().single();
  },
};
