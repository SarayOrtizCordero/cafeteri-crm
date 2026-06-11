/* ============================================================
   SUPABASE-CONFIG.JS — CRM Restaurante
   Configurar con credenciales de supabase.com
   ============================================================ */

// ── CONFIGURACIÓN ─────────────────────────────────────────
// Reemplazar con los valores de tu proyecto en supabase.com
const SUPABASE_URL      = 'https://flhmbcikboybrybmpgnn.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_IpYP6_0SM5Hgr8t8tGvwPw_njjpjq_3';

// Inicializar cliente Supabase (si el SDK está cargado y las credenciales son válidas)
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

// Modo demo: se activa cuando el cliente no está disponible
// Para forzar demo mode, dejar SUPABASE_URL = 'YOUR_SUPABASE_URL'
const DEMO_MODE = !supabase;

// ── DEMO DATA ─────────────────────────────────────────────
const DEMO_RESTAURANT_ID = 'rest-demo-001';

const DEMO_USERS = [
  { id: 'u1', full_name: 'Carlos Administrador', email: 'admin@demo.com',      password: 'demo123', role: 'administrador', restaurant_id: DEMO_RESTAURANT_ID },
  { id: 'u2', full_name: 'Laura Rodríguez',       email: 'gerente@demo.com',    password: 'demo123', role: 'gerente',       restaurant_id: DEMO_RESTAURANT_ID },
  { id: 'u3', full_name: 'Pablo Medina',           email: 'recepcion@demo.com', password: 'demo123', role: 'recepcionista', restaurant_id: DEMO_RESTAURANT_ID },
  { id: 'u4', full_name: 'Ana Flores',             email: 'empleado@demo.com',  password: 'demo123', role: 'empleado',      restaurant_id: DEMO_RESTAURANT_ID },
];

const DEMO_TABLES = [
  { id: 't01', table_number:'T01', capacity:2, location:'interior',  status:'libre',    position_x:1,  position_y:1 },
  { id: 't02', table_number:'T02', capacity:4, location:'interior',  status:'ocupada',  position_x:3,  position_y:1 },
  { id: 't03', table_number:'T03', capacity:4, location:'interior',  status:'reservada',position_x:5,  position_y:1 },
  { id: 't04', table_number:'T04', capacity:6, location:'interior',  status:'libre',    position_x:7,  position_y:1 },
  { id: 't05', table_number:'T05', capacity:2, location:'interior',  status:'libre',    position_x:1,  position_y:4 },
  { id: 't06', table_number:'T06', capacity:4, location:'interior',  status:'ocupada',  position_x:3,  position_y:4 },
  { id: 't07', table_number:'T07', capacity:4, location:'interior',  status:'libre',    position_x:5,  position_y:4 },
  { id: 't08', table_number:'T08', capacity:6, location:'interior',  status:'reservada',position_x:7,  position_y:4 },
  { id: 't09', table_number:'T09', capacity:2, location:'terraza',   status:'libre',    position_x:10, position_y:1 },
  { id: 't10', table_number:'T10', capacity:4, location:'terraza',   status:'libre',    position_x:10, position_y:3 },
  { id: 't11', table_number:'T11', capacity:4, location:'terraza',   status:'ocupada',  position_x:10, position_y:5 },
  { id: 't12', table_number:'T12', capacity:6, location:'terraza',   status:'libre',    position_x:10, position_y:7 },
  { id: 'b01', table_number:'B01', capacity:2, location:'barra',     status:'libre',    position_x:1,  position_y:8 },
  { id: 'b02', table_number:'B02', capacity:2, location:'barra',     status:'ocupada',  position_x:3,  position_y:8 },
  { id: 'p01', table_number:'P01', capacity:12,location:'privado',   status:'libre',    position_x:5,  position_y:8 },
];

const DEMO_CUSTOMERS = [
  { id:'c01', name:'María',     surname:'González',   email:'maria@email.com',    phone:'+54 9 11 1234-5678', birth_date:'1985-03-15', vip_status:true,  total_visits:24, average_ticket:4800, last_visit:'2026-06-08', allergies:['gluten'],        dietary_preferences:['vegetariano'], notes:'Le gusta sentarse en la terraza. Cliente desde 2020.' },
  { id:'c02', name:'Carlos',    surname:'Rodríguez',  email:'carlos@email.com',   phone:'+54 9 11 2345-6789', birth_date:'1978-07-22', vip_status:true,  total_visits:18, average_ticket:6200, last_visit:'2026-06-05', allergies:[],                dietary_preferences:[],              notes:'Prefiere mesa privada para reuniones. Coleccionista de vinos.' },
  { id:'c03', name:'Ana',       surname:'López',      email:'ana@email.com',       phone:'+54 9 11 3456-7890', birth_date:'1992-11-08', vip_status:false, total_visits:7,  average_ticket:2800, last_visit:'2026-05-20', allergies:['lactosa'],       dietary_preferences:[],              notes:'' },
  { id:'c04', name:'Juan',      surname:'Martínez',   email:'juan@email.com',      phone:'+54 9 11 4567-8901', birth_date:'1988-05-30', vip_status:false, total_visits:12, average_ticket:3500, last_visit:'2026-06-01', allergies:[],                dietary_preferences:['vegano'],      notes:'Reserva siempre el último viernes del mes.' },
  { id:'c05', name:'Sofía',     surname:'Hernández',  email:'sofia@email.com',     phone:'+54 9 11 5678-9012', birth_date:'1995-09-14', vip_status:false, total_visits:3,  average_ticket:2200, last_visit:'2026-04-15', allergies:[],                dietary_preferences:[],              notes:'' },
  { id:'c06', name:'Pedro',     surname:'García',     email:'pedro@email.com',     phone:'+54 9 11 6789-0123', birth_date:'1972-01-25', vip_status:true,  total_visits:31, average_ticket:7500, last_visit:'2026-06-10', allergies:['mariscos'],      dietary_preferences:[],              notes:'CEO empresa local. Organiza cenas anuales de empresa.' },
  { id:'c07', name:'Valentina', surname:'Flores',     email:'vale@email.com',      phone:'+54 9 11 7890-1234', birth_date:'1990-12-03', vip_status:false, total_visits:9,  average_ticket:3100, last_visit:'2026-06-07', allergies:[],                dietary_preferences:[],              notes:'' },
  { id:'c08', name:'Diego',     surname:'Torres',     email:'diego@email.com',     phone:'+54 9 11 8901-2345', birth_date:'1983-08-19', vip_status:false, total_visits:5,  average_ticket:2600, last_visit:'2026-05-28', allergies:[],                dietary_preferences:[],              notes:'' },
  { id:'c09', name:'Camila',    surname:'Ramírez',    email:'camila@email.com',    phone:'+54 9 11 9012-3456', birth_date:'1997-04-27', vip_status:false, total_visits:2,  average_ticket:1900, last_visit:'2026-06-03', allergies:[],                dietary_preferences:[],              notes:'' },
  { id:'c10', name:'Martín',    surname:'Sánchez',    email:'martin@email.com',    phone:'+54 9 11 0123-4567', birth_date:'1975-02-11', vip_status:true,  total_visits:22, average_ticket:5800, last_visit:'2026-06-09', allergies:[],                dietary_preferences:[],              notes:'Fan de la cata de vinos. Recomienda el restaurante activamente.' },
  { id:'c11', name:'Lucía',     surname:'Fernández',  email:'lucia@email.com',     phone:'+54 9 11 1111-2222', birth_date:'1993-06-30', vip_status:false, total_visits:4,  average_ticket:2400, last_visit:'2026-05-10', allergies:['nueces'],        dietary_preferences:[],              notes:'' },
  { id:'c12', name:'Roberto',   surname:'Álvarez',    email:'roberto@email.com',   phone:'+54 9 11 2222-3333', birth_date:'1968-10-05', vip_status:false, total_visits:1,  average_ticket:1800, last_visit:'2026-06-11', allergies:[],                dietary_preferences:[],              notes:'Primera visita hoy.' },
];

const today = new Date();
const fmt = (d, h, m) => { const x = new Date(d); x.setHours(h,m,0,0); return x.toISOString(); };

const DEMO_RESERVATIONS = [
  { id:'r01', customer_id:'c01', table_id:'t03', reservation_date: fmt(today,12,0),  guests:2, status:'confirmada',  notes:'Aniversario de bodas. Decorar mesa.', source:'web' },
  { id:'r02', customer_id:'c06', table_id:'p01', reservation_date: fmt(today,13,30), guests:8, status:'sentado',     notes:'Almuerzo de negocios. Pedir menú ejecutivo.', source:'teléfono' },
  { id:'r03', customer_id:'c04', table_id:'t07', reservation_date: fmt(today,20,0),  guests:4, status:'pendiente',   notes:'', source:'web' },
  { id:'r04', customer_id:'c10', table_id:'t02', reservation_date: fmt(today,21,0),  guests:2, status:'confirmada',  notes:'Cliente VIP. Reservar Malbec Achaval Ferrer.', source:'manual' },
  { id:'r05', customer_id:'c02', table_id:'t08', reservation_date: fmt(today,21,30), guests:6, status:'pendiente',   notes:'', source:'web' },
  { id:'r06', customer_id:'c07', table_id:'t11', reservation_date: fmt(today,12,30), guests:3, status:'confirmada',  notes:'', source:'web' },
  { id:'r07', customer_id:'c03', table_id:'t05', reservation_date: fmt(today,13,0),  guests:1, status:'cancelada',   notes:'Canceló por enfermedad.', source:'teléfono' },
  { id:'r08', customer_id:'c08', table_id:'t09', reservation_date: fmt(new Date(today.getTime()+86400000),20,0), guests:2, status:'pendiente', notes:'', source:'web' },
  { id:'r09', customer_id:'c05', table_id:'t04', reservation_date: fmt(new Date(today.getTime()+86400000),21,30),guests:4, status:'confirmada', notes:'Cumpleaños. Pastel de chocolate.', source:'web' },
  { id:'r10', customer_id:'c11', table_id:'t01', reservation_date: fmt(new Date(today.getTime()+172800000),19,30),guests:2, status:'pendiente', notes:'', source:'web' },
];

const DEMO_WAITING = [
  { id:'w01', customer_id:'c12', party_size:2, arrival_time: new Date(Date.now()-15*60000).toISOString(), status:'esperando', notes:'' },
  { id:'w02', customer_id:'c09', party_size:4, arrival_time: new Date(Date.now()-5*60000).toISOString(),  status:'esperando', notes:'Prefieren terraza.' },
];

const DEMO_EVENTS = [
  { id:'e01', title:'Cata de Vinos Mendocinos',      description:'Recorremos los mejores terroirs de Mendoza. 5 vinos premium con maridaje.', event_date: fmt(new Date(today.getTime()+7*86400000),20,0),  capacity:20, current_attendees:14, price:4500, status:'activo' },
  { id:'e02', title:'Noche de Tapas Españolas',       description:'Menú especial de tapas con sangría ilimitada. Música en vivo.', event_date: fmt(new Date(today.getTime()+14*86400000),20,30), capacity:30, current_attendees:22, price:3800, status:'activo' },
  { id:'e03', title:'Cena de Empresa Navideña',       description:'Menú especial de fin de año. Precio por persona, mínimo 20 personas.', event_date: fmt(new Date('2026-12-23'),21,0), capacity:60, current_attendees:35, price:8000, status:'activo' },
  { id:'e04', title:'Brunch San Valentín',             description:'Menú romántico para dos. Flores y champagne incluidos.', event_date: fmt(new Date('2026-02-14'),12,0), capacity:15, current_attendees:15, price:5500, status:'completo' },
];

const DEMO_LOYALTY = [
  { id:'l01', customer_id:'c01', points:850,  level:'oro',     total_earned:950, total_redeemed:100 },
  { id:'l02', customer_id:'c02', points:620,  level:'oro',     total_earned:720, total_redeemed:100 },
  { id:'l03', customer_id:'c06', points:1240, level:'premium', total_earned:1400,total_redeemed:160 },
  { id:'l04', customer_id:'c10', points:980,  level:'oro',     total_earned:1100,total_redeemed:120 },
  { id:'l05', customer_id:'c04', points:380,  level:'plata',   total_earned:430, total_redeemed:50  },
  { id:'l06', customer_id:'c07', points:210,  level:'plata',   total_earned:210, total_redeemed:0   },
  { id:'l07', customer_id:'c03', points:95,   level:'bronce',  total_earned:95,  total_redeemed:0   },
  { id:'l08', customer_id:'c08', points:120,  level:'bronce',  total_earned:120, total_redeemed:0   },
];

const DEMO_PROMOTIONS = [
  { id:'pr01', title:'Descuento Cumpleaños',      description:'10% de descuento en toda la cuenta el día del cumpleaños.', discount_type:'percentage', discount_value:10, code:'CUMPLE10',  start_date:'2026-01-01', end_date:'2026-12-31', usage_limit:null, usage_count:47, is_active:true },
  { id:'pr02', title:'Happy Hour 2x1',            description:'2x1 en cócteles y vinos de lunes a jueves de 17 a 19hs.', discount_type:'fixed',      discount_value:0,  code:'HAPPY2X1',  start_date:'2026-06-01', end_date:'2026-08-31', usage_limit:null, usage_count:89, is_active:true },
  { id:'pr03', title:'Menú Degustación -15%',     description:'15% off en el menú degustación reservando con 48hs de anticipación.', discount_type:'percentage', discount_value:15, code:'DEGU15',    start_date:'2026-06-15', end_date:'2026-07-15', usage_limit:50,  usage_count:12, is_active:true },
  { id:'pr04', title:'Primera Visita Bienvenida', description:'Copa de vino de cortesía para clientes nuevos.', discount_type:'free_item',  discount_value:0,  code:'BIENVENIDO',start_date:'2026-01-01', end_date:'2026-12-31', usage_limit:null, usage_count:38, is_active:true },
  { id:'pr05', title:'Invierno Romántico',        description:'Postre incluido para parejas que reserven cena. Válido en invierno.', discount_type:'free_item',  discount_value:0,  code:'ROMANCE',   start_date:'2026-06-21', end_date:'2026-09-22', usage_limit:30,  usage_count:0,  is_active:false },
];

const DEMO_CAMPAIGNS = [
  { id:'cm01', title:'Bienvenida Nuevos Clientes', subject:'¡Bienvenido/a al Café de la Esquina!', content:'<p>Hola {{nombre}}, es un placer tenerte como nuevo cliente...</p>', template:'bienvenida', status:'enviada', recipient_count:38, open_rate:72.4, click_rate:34.2, sent_at: new Date(Date.now()-7*86400000).toISOString() },
  { id:'cm02', title:'Campaña Cumpleaños Junio',   subject:'🎂 ¡Feliz cumpleaños! Un regalo especial para vos', content:'<p>Hola {{nombre}}, en tu mes especial queremos celebrarte...</p>', template:'cumpleanos', status:'enviada', recipient_count:12, open_rate:91.7, click_rate:58.3, sent_at: new Date(Date.now()-2*86400000).toISOString() },
  { id:'cm03', title:'Cata de Vinos - Invitación', subject:'🍷 Cata de vinos mendocinos – Plazas limitadas', content:'<p>Estimado/a {{nombre}}, te invitamos a una velada única...</p>', template:'evento', status:'programada', recipient_count:85, open_rate:0, click_rate:0, scheduled_at: new Date(Date.now()+2*86400000).toISOString() },
  { id:'cm04', title:'Clientes Inactivos Julio',   subject:'¡Te extrañamos! Volvé con un 10% de descuento', content:'<p>Hola {{nombre}}, hace un tiempo que no te vemos...</p>', template:'reactivacion', status:'borrador', recipient_count:0, open_rate:0, click_rate:0 },
];

const DEMO_REVIEWS = [
  { id:'rv01', customer_id:'c01', rating:5, food_rating:5, service_rating:5, ambiance_rating:4, comment:'Excelente experiencia como siempre. El risotto de hongos estaba increíble. El personal muy atento.', response:'¡Gracias María! Es un placer recibirte siempre. El próximo risotto tiene una sorpresa especial 😊', created_at: new Date(Date.now()-2*86400000).toISOString() },
  { id:'rv02', customer_id:'c04', rating:4, food_rating:4, service_rating:5, ambiance_rating:4, comment:'Muy buen servicio y ambiente. La comida muy rica, aunque esperé un poco para que salga.', response:null, created_at: new Date(Date.now()-5*86400000).toISOString() },
  { id:'rv03', customer_id:'c07', rating:5, food_rating:5, service_rating:4, ambiance_rating:5, comment:'Lugar hermoso. La terraza de noche es mágica. El vino recomendado por el sommelier fue perfecto.', response:'¡Gracias Valentina! La terraza es nuestra joya. Hasta pronto 🌟', created_at: new Date(Date.now()-8*86400000).toISOString() },
  { id:'rv04', customer_id:'c08', rating:3, food_rating:4, service_rating:2, ambiance_rating:4, comment:'La comida estaba bien pero el servicio fue muy lento. Tuvimos que pedir tres veces el menú.', response:null, created_at: new Date(Date.now()-10*86400000).toISOString() },
  { id:'rv05', customer_id:'c10', rating:5, food_rating:5, service_rating:5, ambiance_rating:5, comment:'El mejor restaurante del barrio sin dudas. La cata de vinos fue una experiencia memorable.', response:'Martín, gracias por tus palabras. ¡Hasta la próxima cata!', created_at: new Date(Date.now()-1*86400000).toISOString() },
  { id:'rv06', customer_id:'c03', rating:4, food_rating:5, service_rating:4, ambiance_rating:3, comment:'Muy buena comida. Me adaptaron el plato por mi intolerancia a la lactosa sin problema.', response:null, created_at: new Date(Date.now()-15*86400000).toISOString() },
];

const DEMO_INCIDENTS = [
  { id:'inc01', reservation_id:'r07', description:'Cliente canceló sin previo aviso y mesa quedó reservada 30 min.', severity:'baja',  status:'cerrada',    resolution:'Se liberó la mesa y se contactó al cliente.', created_at: new Date(Date.now()-3*86400000).toISOString() },
  { id:'inc02', reservation_id:'r02', description:'Demora excesiva en la salida del plato principal (40 min). Cliente molesto.', severity:'media', status:'resuelta',   resolution:'Se ofreció postre de cortesía. Cliente conforme.', created_at: new Date(Date.now()-1*86400000).toISOString() },
  { id:'inc03', reservation_id:'r06', description:'Error en el pedido: salió plato con nueces siendo cliente alérgico.', severity:'alta',  status:'en_proceso', resolution:'Se reemplazó el plato inmediatamente. Documentando para evitar recurrencia.', created_at: new Date().toISOString() },
];

// ── API WRAPPER ────────────────────────────────────────────
// Centraliza todas las operaciones de datos, usando Supabase o demo data

const DB = {

  // Obtener sesión actual
  async getSession() {
    if (DEMO_MODE) {
      const s = localStorage.getItem('crm_session');
      return s ? JSON.parse(s) : null;
    }
    const { data } = await supabase.auth.getSession();
    return data?.session ?? null;
  },

  // Login
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

  // Logout
  async logout() {
    if (DEMO_MODE) {
      localStorage.removeItem('crm_session');
      return { error: null };
    }
    return await supabase.auth.signOut();
  },

  // ── CUSTOMERS ──
  async getCustomers({ search = '', vip = null } = {}) {
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
      if (vip !== null) data = data.filter(c => c.vip_status === vip);
      return { data, error: null };
    }
    let q = supabase.from('customers').select('*').order('name');
    if (search) q = q.or(`name.ilike.%${search}%,surname.ilike.%${search}%,email.ilike.%${search}%`);
    if (vip !== null) q = q.eq('vip_status', vip);
    return await q;
  },

  async getCustomer(id) {
    if (DEMO_MODE) {
      const data = DEMO_CUSTOMERS.find(c => c.id === id);
      return { data, error: data ? null : 'No encontrado' };
    }
    return await supabase.from('customers').select('*').eq('id', id).single();
  },

  async createCustomer(customer) {
    if (DEMO_MODE) {
      const newC = { ...customer, id: 'c' + Date.now(), total_visits: 0, average_ticket: 0, created_at: new Date().toISOString() };
      DEMO_CUSTOMERS.push(newC);
      return { data: newC, error: null };
    }
    return await supabase.from('customers').insert(customer).select().single();
  },

  async updateCustomer(id, updates) {
    if (DEMO_MODE) {
      const idx = DEMO_CUSTOMERS.findIndex(c => c.id === id);
      if (idx === -1) return { error: 'No encontrado' };
      DEMO_CUSTOMERS[idx] = { ...DEMO_CUSTOMERS[idx], ...updates, updated_at: new Date().toISOString() };
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
        customer: DEMO_CUSTOMERS.find(c => c.id === r.customer_id),
        table:    DEMO_TABLES.find(t => t.id === r.table_id),
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
    let q = supabase.from('reservations').select(`*, customer:customers(*), table:tables(*)`).order('reservation_date');
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

  // ── TABLES ──
  async getTables() {
    if (DEMO_MODE) return { data: DEMO_TABLES, error: null };
    return await supabase.from('tables').select('*').order('table_number');
  },

  async updateTableStatus(id, status) {
    if (DEMO_MODE) {
      const t = DEMO_TABLES.find(t => t.id === id);
      if (t) t.status = status;
      return { data: t, error: null };
    }
    return await supabase.from('tables').update({ status }).eq('id', id).select().single();
  },

  // ── WAITING LIST ──
  async getWaitingList() {
    if (DEMO_MODE) {
      const data = DEMO_WAITING.map(w => ({
        ...w,
        customer: DEMO_CUSTOMERS.find(c => c.id === w.customer_id),
      }));
      return { data, error: null };
    }
    return await supabase.from('waiting_list').select('*, customer:customers(*)').order('arrival_time');
  },

  async addToWaiting(entry) {
    if (DEMO_MODE) {
      const newW = { ...entry, id: 'w' + Date.now(), arrival_time: new Date().toISOString(), status: 'esperando' };
      DEMO_WAITING.push(newW);
      return { data: newW, error: null };
    }
    return await supabase.from('waiting_list').insert(entry).select().single();
  },

  async updateWaiting(id, updates) {
    if (DEMO_MODE) {
      const idx = DEMO_WAITING.findIndex(w => w.id === id);
      if (idx !== -1) DEMO_WAITING[idx] = { ...DEMO_WAITING[idx], ...updates };
      return { data: DEMO_WAITING[idx], error: null };
    }
    return await supabase.from('waiting_list').update(updates).eq('id', id).select().single();
  },

  // ── EVENTS ──
  async getEvents() {
    if (DEMO_MODE) return { data: DEMO_EVENTS, error: null };
    return await supabase.from('events').select('*').order('event_date');
  },

  async createEvent(ev) {
    if (DEMO_MODE) {
      const newEv = { ...ev, id: 'e' + Date.now(), current_attendees: 0, created_at: new Date().toISOString() };
      DEMO_EVENTS.push(newEv);
      return { data: newEv, error: null };
    }
    return await supabase.from('events').insert(ev).select().single();
  },

  async updateEvent(id, updates) {
    if (DEMO_MODE) {
      const idx = DEMO_EVENTS.findIndex(e => e.id === id);
      if (idx !== -1) DEMO_EVENTS[idx] = { ...DEMO_EVENTS[idx], ...updates };
      return { data: DEMO_EVENTS[idx], error: null };
    }
    return await supabase.from('events').update(updates).eq('id', id).select().single();
  },

  async deleteEvent(id) {
    if (DEMO_MODE) {
      const idx = DEMO_EVENTS.findIndex(e => e.id === id);
      if (idx !== -1) DEMO_EVENTS.splice(idx, 1);
      return { error: null };
    }
    return await supabase.from('events').delete().eq('id', id);
  },

  // ── LOYALTY ──
  async getLoyaltyPoints({ search = '' } = {}) {
    if (DEMO_MODE) {
      let data = DEMO_LOYALTY.map(l => ({
        ...l,
        customer: DEMO_CUSTOMERS.find(c => c.id === l.customer_id),
      }));
      if (search) {
        const q = search.toLowerCase();
        data = data.filter(l =>
          l.customer?.name.toLowerCase().includes(q) ||
          l.customer?.surname.toLowerCase().includes(q)
        );
      }
      return { data, error: null };
    }
    let q = supabase.from('loyalty_points').select('*, customer:customers(*)').order('points', { ascending: false });
    return await q;
  },

  async updateLoyaltyPoints(customerId, points, reason = '') {
    if (DEMO_MODE) {
      let lp = DEMO_LOYALTY.find(l => l.customer_id === customerId);
      if (!lp) {
        lp = { id: 'l' + Date.now(), customer_id: customerId, points: 0, level: 'bronce', total_earned: 0, total_redeemed: 0 };
        DEMO_LOYALTY.push(lp);
      }
      lp.points += points;
      if (points > 0) lp.total_earned += points;
      else lp.total_redeemed += Math.abs(points);
      if (lp.points >= 1000) lp.level = 'premium';
      else if (lp.points >= 500) lp.level = 'oro';
      else if (lp.points >= 200) lp.level = 'plata';
      else lp.level = 'bronce';
      return { data: lp, error: null };
    }
    const { data: current } = await supabase.from('loyalty_points').select('*').eq('customer_id', customerId).single();
    const newPoints = (current?.points || 0) + points;
    return await supabase.from('loyalty_points').upsert({ customer_id: customerId, points: newPoints }).select().single();
  },

  // ── PROMOTIONS ──
  async getPromotions() {
    if (DEMO_MODE) return { data: DEMO_PROMOTIONS, error: null };
    return await supabase.from('promotions').select('*').order('created_at', { ascending: false });
  },

  async createPromotion(promo) {
    if (DEMO_MODE) {
      const newP = { ...promo, id: 'pr' + Date.now(), usage_count: 0, created_at: new Date().toISOString() };
      DEMO_PROMOTIONS.push(newP);
      return { data: newP, error: null };
    }
    return await supabase.from('promotions').insert(promo).select().single();
  },

  async updatePromotion(id, updates) {
    if (DEMO_MODE) {
      const idx = DEMO_PROMOTIONS.findIndex(p => p.id === id);
      if (idx !== -1) DEMO_PROMOTIONS[idx] = { ...DEMO_PROMOTIONS[idx], ...updates };
      return { data: DEMO_PROMOTIONS[idx], error: null };
    }
    return await supabase.from('promotions').update(updates).eq('id', id).select().single();
  },

  // ── CAMPAIGNS ──
  async getCampaigns() {
    if (DEMO_MODE) return { data: DEMO_CAMPAIGNS, error: null };
    return await supabase.from('email_campaigns').select('*').order('created_at', { ascending: false });
  },

  async createCampaign(camp) {
    if (DEMO_MODE) {
      const newC = { ...camp, id: 'cm' + Date.now(), recipient_count: 0, open_rate: 0, click_rate: 0, created_at: new Date().toISOString() };
      DEMO_CAMPAIGNS.push(newC);
      return { data: newC, error: null };
    }
    return await supabase.from('email_campaigns').insert(camp).select().single();
  },

  // ── REVIEWS ──
  async getReviews() {
    if (DEMO_MODE) {
      const data = DEMO_REVIEWS.map(r => ({
        ...r,
        customer: DEMO_CUSTOMERS.find(c => c.id === r.customer_id),
      }));
      data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      return { data, error: null };
    }
    return await supabase.from('reviews').select('*, customer:customers(*)').order('created_at', { ascending: false });
  },

  async updateReview(id, updates) {
    if (DEMO_MODE) {
      const idx = DEMO_REVIEWS.findIndex(r => r.id === id);
      if (idx !== -1) DEMO_REVIEWS[idx] = { ...DEMO_REVIEWS[idx], ...updates };
      return { data: DEMO_REVIEWS[idx], error: null };
    }
    return await supabase.from('reviews').update(updates).eq('id', id).select().single();
  },

  // ── INCIDENTS ──
  async getIncidents() {
    if (DEMO_MODE) {
      const data = DEMO_INCIDENTS.map(i => ({
        ...i,
        reservation: DEMO_RESERVATIONS.find(r => r.id === i.reservation_id),
      }));
      data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      return { data, error: null };
    }
    return await supabase.from('incidents').select('*, reservation:reservations(*, customer:customers(*))').order('created_at', { ascending: false });
  },

  async createIncident(inc) {
    if (DEMO_MODE) {
      const newI = { ...inc, id: 'inc' + Date.now(), status: 'abierta', created_at: new Date().toISOString() };
      DEMO_INCIDENTS.push(newI);
      return { data: newI, error: null };
    }
    return await supabase.from('incidents').insert(inc).select().single();
  },

  async updateIncident(id, updates) {
    if (DEMO_MODE) {
      const idx = DEMO_INCIDENTS.findIndex(i => i.id === id);
      if (idx !== -1) DEMO_INCIDENTS[idx] = { ...DEMO_INCIDENTS[idx], ...updates };
      return { data: DEMO_INCIDENTS[idx], error: null };
    }
    return await supabase.from('incidents').update(updates).eq('id', id).select().single();
  },

  // ── ANALYTICS ──
  async getAnalyticsData() {
    if (DEMO_MODE) {
      const reservations = DEMO_RESERVATIONS;
      const customers = DEMO_CUSTOMERS;
      const reviews = DEMO_REVIEWS;

      const totalReservations = reservations.length;
      const cancelaciones     = reservations.filter(r => r.status === 'cancelada').length;
      const newCustomers      = customers.filter(c => new Date(c.last_visit) >= new Date(Date.now() - 30*86400000)).length;
      const avgRating         = reviews.reduce((s,r) => s + r.rating, 0) / (reviews.length || 1);
      const vipCustomers      = customers.filter(c => c.vip_status).length;
      const avgTicket         = customers.reduce((s,c) => s + c.average_ticket, 0) / (customers.length || 1);
      const occupancyRate     = Math.round((DEMO_TABLES.filter(t => t.status === 'ocupada').length / DEMO_TABLES.length) * 100);

      // Reservas por día (últimos 7 días)
      const resByDay = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(Date.now() - i * 86400000);
        const label = d.toLocaleDateString('es-AR', { weekday:'short', day:'numeric' });
        const count = Math.floor(Math.random() * 12) + 4;
        resByDay.push({ label, count });
      }

      // Reservas por hora
      const byHour = [
        { hour:'12hs', count:8 },{ hour:'13hs', count:12 },{ hour:'14hs', count:6 },
        { hour:'15hs', count:3 },{ hour:'16hs', count:2 },{ hour:'17hs', count:4 },
        { hour:'18hs', count:6 },{ hour:'19hs', count:10 },{ hour:'20hs', count:18 },
        { hour:'21hs', count:22 },{ hour:'22hs', count:14 },{ hour:'23hs', count:8 },
      ];

      // Top clientes
      const topCustomers = [...customers]
        .sort((a,b) => b.total_visits - a.total_visits)
        .slice(0, 5)
        .map(c => ({ name: c.name + ' ' + c.surname, visits: c.total_visits, ticket: c.average_ticket }));

      return {
        data: { totalReservations, cancelaciones, newCustomers, avgRating, vipCustomers, avgTicket, occupancyRate, resByDay, byHour, topCustomers },
        error: null
      };
    }
    // Implementar consultas reales a Supabase
    return { data: null, error: 'Supabase analytics not implemented' };
  },
};
