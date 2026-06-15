/* ============================================================
   DATA.JS — Datos demo del CRM
   Solo se usa cuando DEMO_MODE = true (sin Supabase configurado).
   Las mutaciones (crear/editar/eliminar) modifican estos arrays
   en memoria; los cambios se pierden al recargar la página.
   ============================================================ */

const DEMO_USERS = [
  { id: 'u1', full_name: 'Carlos Administrador', email: 'admin@demo.com',       password: 'demo123', role: 'administrador' },
  { id: 'u2', full_name: 'Gabriela Méndez',      email: 'gerente@demo.com',     password: 'demo123', role: 'gerente' },
  { id: 'u3', full_name: 'Laura Recepción',      email: 'recepcion@demo.com',   password: 'demo123', role: 'recepcionista' },
  { id: 'u4', full_name: 'Ana Flores',           email: 'empleado@demo.com',    password: 'demo123', role: 'empleado' },
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

const _today    = new Date();
const _fmt      = (d, h, m) => { const x = new Date(d); x.setHours(h, m, 0, 0); return x.toISOString(); };
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
