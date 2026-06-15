/* ============================================================
   SUPABASE-CONFIG.JS — CRM Cafetería
   Configurar con credenciales de supabase.com
   ============================================================ */

// ── CONFIGURACIÓN ─────────────────────────────────────────
// Reemplazar con los valores de tu proyecto en supabase.com
const SUPABASE_URL      = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

let supabase = null;
const _supabaseConfigured = (SUPABASE_URL !== 'YOUR_SUPABASE_URL');
if (_supabaseConfigured && typeof window !== 'undefined' && window.supabase) {
  try {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: true, autoRefreshToken: true }
    });
  } catch(e) {
    console.warn('[CRM] No se pudo inicializar Supabase, usando modo demo:', e.message);
  }
}

const DEMO_MODE = !supabase;

// ── DEMO DATA ─────────────────────────────────────────────

const DEMO_USERS = [
  { id: 'u1', full_name: 'Carlos Administrador', email: 'admin@demo.com',    password: 'demo123', role: 'administrador' },
  { id: 'u2', full_name: 'Ana Flores',            email: 'empleado@demo.com', password: 'demo123', role: 'empleado' },
];

const DEMO_CUSTOMERS = [
  { id:'c01', name:'María',     surname:'González',  email:'maria@email.com',   phone:'+54 9 11 1234-5678', birth_date:'1985-03-15', notes:'Le gusta sentarse cerca de la ventana.',      created_at:'2024-01-10T10:00:00Z' },
  { id:'c02', name:'Carlos',   surname:'Rodríguez', email:'carlos@email.com',  phone:'+54 9 11 2345-6789', birth_date:'1978-07-22', notes:'Prefiere mesa tranquila para reuniones.',     created_at:'2024-02-14T11:30:00Z' },
  { id:'c03', name:'Ana',      surname:'López',     email:'ana@email.com',     phone:'+54 9 11 3456-7890', birth_date:'1992-11-08', notes:'',                                            created_at:'2024-03-05T09:15:00Z' },
  { id:'c04', name:'Juan',     surname:'Martínez',  email:'juan@email.com',    phone:'+54 9 11 4567-8901', birth_date:'1988-05-30', notes:'Reserva siempre el último viernes del mes.',  created_at:'2024-04-20T14:00:00Z' },
  { id:'c05', name:'Sofía',    surname:'Hernández', email:'sofia@email.com',   phone:'+54 9 11 5678-9012', birth_date:'1995-09-14', notes:'',                                            created_at:'2024-05-08T16:45:00Z' },
  { id:'c06', name:'Pedro',    surname:'García',    email:'pedro@email.com',   phone:'+54 9 11 6789-0123', birth_date:'1972-01-25', notes:'Cliente frecuente. Organiza cenas de empresa.',created_at:'2024-06-01T10:00:00Z' },
  { id:'c07', name:'Valentina',surname:'Flores',    email:'vale@email.com',    phone:'+54 9 11 7890-1234', birth_date:'1990-12-03', notes:'',                                            created_at:'2024-07-12T13:20:00Z' },
  { id:'c08', name:'Diego',    surname:'Torres',    email:'diego@email.com',   phone:'+54 9 11 8901-2345', birth_date:'1983-08-19', notes:'',                                            created_at:'2024-08-25T11:00:00Z' },
  { id:'c09', name:'Camila',   surname:'Ramírez',   email:'camila@email.com',  phone:'+54 9 11 9012-3456', birth_date:'1997-04-27', notes:'',                                            created_at:'2025-01-03T09:00:00Z' },
  { id:'c10', name:'Martín',   surname:'Sánchez',   email:'martin@email.com',  phone:'+54 9 11 0123-4567', birth_date:'1975-02-11', notes:'Recomienda el café activamente.',              created_at:'2025-03-18T15:30:00Z' },
];

const _today = new Date();
const _fmt = (d, h, m) => { const x = new Date(d); x.setHours(h,m,0,0); return x.toISOString(); };
const _tomorrow = new Date(_today.getTime() + 86400000);
const _in2days  = new Date(_today.getTime() + 172800000);

const DEMO_RESERVATIONS = [
  { id:'r01', customer_id:'c01', reservation_date: _fmt(_today,12,0),  guests:2, status:'confirmada', notes:'Aniversario. Decorar mesa.', created_at: new Date(Date.now()-2*86400000).toISOString() },
  { id:'r02', customer_id:'c06', reservation_date: _fmt(_today,13,30), guests:8, status:'confirmada', notes:'Almuerzo de negocios.',      created_at: new Date(Date.now()-1*86400000).toISOString() },
  { id:'r03', customer_id:'c04', reservation_date: _fmt(_today,20,0),  guests:4, status:'pendiente',  notes:'',                          created_at: new Date(Date.now()-3600000).toISOString() },
  { id:'r04', customer_id:'c10', reservation_date: _fmt(_today,21,0),  guests:2, status:'confirmada', notes:'Mesa tranquila preferida.',  created_at: new Date(Date.now()-7200000).toISOString() },
  { id:'r05', customer_id:'c02', reservation_date: _fmt(_today,21,30), guests:6, status:'pendiente',  notes:'',                          created_at: new Date(Date.now()-900000).toISOString() },
  { id:'r06', customer_id:'c07', reservation_date: _fmt(_today,12,30), guests:3, status:'confirmada', notes:'',                          created_at: new Date(Date.now()-86400000).toISOString() },
  { id:'r07', customer_id:'c03', reservation_date: _fmt(_today,13,0),  guests:1, status:'cancelada',  notes:'Canceló por enfermedad.',   created_at: new Date(Date.now()-86400000).toISOString() },
  { id:'r08', customer_id:'c08', reservation_date: _fmt(_tomorrow,20,0),  guests:2, status:'pendiente',  notes:'',                      created_at: new Date(Date.now()-3600000).toISOString() },
  { id:'r09', customer_id:'c05', reservation_date: _fmt(_tomorrow,21,30), guests:4, status:'confirmada', notes:'Cumpleaños.',           created_at: new Date(Date.now()-7200000).toISOString() },
  { id:'r10', customer_id:'c09', reservation_date: _fmt(_in2days,19,30),  guests:2, status:'pendiente',  notes:'',                      created_at: new Date(Date.now()-1800000).toISOString() },
];

const DEMO_ORDERS = [
  { id:'o01', customer_id:'c01', title:'Torta de cumpleaños',        description:'Torta de chocolate 3 pisos con decoración personalizada.', price:4500, status:'entregado',      pickup_date: _fmt(new Date(Date.now()-2*86400000),16,0), created_at: new Date(Date.now()-3*86400000).toISOString() },
  { id:'o02', customer_id:'c06', title:'Box desayuno para empresa',  description:'10 medialunas, 5 budines, café en termo grande.',          price:8200, status:'listo',          pickup_date: _fmt(_today,9,0),  created_at: new Date(Date.now()-86400000).toISOString() },
  { id:'o03', customer_id:'c04', title:'Cheesecake de frutos rojos', description:'Porción entera, sin TACC.',                                price:2800, status:'en_preparacion', pickup_date: _fmt(_today,14,0), created_at: new Date(Date.now()-3600000).toISOString() },
  { id:'o04', customer_id:'c10', title:'Café de especialidad x5',    description:'Blend etíope. Molienda media. Para filtro.',               price:3600, status:'pendiente',      pickup_date: _fmt(_tomorrow,10,0), created_at: new Date(Date.now()-1800000).toISOString() },
  { id:'o05', customer_id:'c07', title:'Tabla de quesos y fiambres', description:'Tabla para 4 personas con acompañamientos.',               price:5500, status:'pendiente',      pickup_date: _fmt(_tomorrow,20,0), created_at: new Date(Date.now()-900000).toISOString() },
  { id:'o06', customer_id:'c03', title:'Alfajores artesanales x12',  description:'6 de maicena + 6 de chocolate. Con logo del café.',       price:1800, status:'cancelado',      pickup_date: _fmt(_today,17,0), created_at: new Date(Date.now()-2*86400000).toISOString() },
];

const DEMO_INCIDENTS = [
  { id:'inc01', customer_id:'c03', title:'Demora excesiva en pedido',      description:'Cliente esperó más de 40 min por su pedido principal. Se molestó.', priority:'media', status:'resuelta',   resolution:'Se ofreció postre de cortesía. Cliente conforme.',                    created_at: new Date(Date.now()-1*86400000).toISOString() },
  { id:'inc02', customer_id:'c08', title:'Error en la cuenta',             description:'Se cobró un ítem que no pidió. Diferencia de $1.200.',              priority:'baja',  status:'cerrada',    resolution:'Se realizó la devolución. Cliente agradeció la atención.',           created_at: new Date(Date.now()-3*86400000).toISOString() },
  { id:'inc03', customer_id:'c06', title:'Problema con reserva grupal',    description:'La mesa asignada no tenía suficiente capacidad para el grupo de 8.', priority:'alta',  status:'en_proceso', resolution:'Se está reorganizando la disposición de mesas para grupos grandes.', created_at: new Date().toISOString() },
];

const DEMO_MESSAGES = [
  { id:'m01', customer_id:'c01', message:'Buenas tardes, quisiera reservar para el sábado a las 21hs para dos personas.', direction:'incoming', created_at: new Date(Date.now()-2*86400000-3600000).toISOString() },
  { id:'m02', customer_id:'c01', message:'¡Hola María! Claro, tenemos disponibilidad. ¿Necesitás algún pedido especial?', direction:'outgoing', created_at: new Date(Date.now()-2*86400000-3000000).toISOString() },
  { id:'m03', customer_id:'c01', message:'Sería el aniversario, si pueden decorar la mesa estaría buenísimo.',            direction:'incoming', created_at: new Date(Date.now()-2*86400000-2400000).toISOString() },
  { id:'m04', customer_id:'c01', message:'Con gusto lo hacemos. Quedó registrado. ¡Hasta el sábado!',                    direction:'outgoing', created_at: new Date(Date.now()-2*86400000-1800000).toISOString() },
  { id:'m05', customer_id:'c06', message:'Necesito un presupuesto para un almuerzo de empresa para 10 personas.',         direction:'incoming', created_at: new Date(Date.now()-86400000-7200000).toISOString() },
  { id:'m06', customer_id:'c06', message:'Pedro, le enviamos el menú ejecutivo por email. Son $1.800 por persona con bebidas incluidas.', direction:'outgoing', created_at: new Date(Date.now()-86400000-3600000).toISOString() },
  { id:'m07', customer_id:'c06', message:'Perfecto. Confirmamos para el jueves al mediodía.',                             direction:'incoming', created_at: new Date(Date.now()-86400000-1800000).toISOString() },
  { id:'m08', customer_id:'c04', message:'Hola! ¿Tienen disponibilidad para el viernes a la noche para 4 personas?',     direction:'incoming', created_at: new Date(Date.now()-3600000*3).toISOString() },
  { id:'m09', customer_id:'c04', message:'¡Hola Juan! Sí tenemos lugar. ¿A qué hora preferís?',                          direction:'outgoing', created_at: new Date(Date.now()-3600000*2).toISOString() },
  { id:'m10', customer_id:'c04', message:'A las 21hs si pueden.',                                                         direction:'incoming', created_at: new Date(Date.now()-3600000).toISOString() },
];

// ── API WRAPPER ────────────────────────────────────────────

const DB = {

  async getSession() {
    if (DEMO_MODE) {
      const s = localStorage.getItem('crm_session');
      return s ? JSON.parse(s) : null;
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
      const reservasHoy       = DEMO_RESERVATIONS.filter(r => new Date(r.reservation_date).toDateString() === todayStr && r.status !== 'cancelada').length;
      const pedidosPendientes = DEMO_ORDERS.filter(o => o.status === 'pendiente' || o.status === 'en_preparacion').length;
      const incidenciasAbiertas = DEMO_INCIDENTS.filter(i => i.status === 'abierta' || i.status === 'en_proceso').length;
      const mensajesPendientes = (() => {
        const customerIds = [...new Set(DEMO_MESSAGES.map(m => m.customer_id))];
        return customerIds.filter(cid => {
          const msgs = DEMO_MESSAGES.filter(m => m.customer_id === cid).sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
          return msgs[0]?.direction === 'incoming';
        }).length;
      })();
      const totalClientes = DEMO_CUSTOMERS.length;
      return { data: { reservasHoy, pedidosPendientes, incidenciasAbiertas, mensajesPendientes, totalClientes }, error: null };
    }
    // Implementar con Supabase queries
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
      data.sort((a,b) => a.name.localeCompare(b.name));
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
      data.sort((a,b) => new Date(a.reservation_date) - new Date(b.reservation_date));
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
      data.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
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
      data.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
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
          .sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
        return {
          customer: DEMO_CUSTOMERS.find(c => c.id === cid) || null,
          last_message: msgs[0] || null,
          unread: msgs[0]?.direction === 'incoming' ? 1 : 0,
          count: msgs.length,
        };
      });
      data.sort((a,b) => new Date(b.last_message?.created_at) - new Date(a.last_message?.created_at));
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
        .sort((a,b) => new Date(a.created_at) - new Date(b.created_at));
      return { data, error: null };
    }
    return await supabase.from('messages')
      .select('*')
      .eq('customer_id', customer_id)
      .order('created_at');
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
