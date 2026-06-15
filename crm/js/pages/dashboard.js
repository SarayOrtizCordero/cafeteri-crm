/* dashboard.js — Lógica de la página Dashboard */
Auth.requireAuth();

document.addEventListener('DOMContentLoaded', async () => {

  document.getElementById('dash-date').textContent =
    new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  // KPIs
  const { data: kpis } = await DB.getDashboardData();
  if (kpis) {
    document.getElementById('kpi-reservas').textContent    = kpis.reservasHoy;
    document.getElementById('kpi-pedidos').textContent     = kpis.pedidosPendientes;
    document.getElementById('kpi-incidencias').textContent = kpis.incidenciasAbiertas;
    document.getElementById('kpi-mensajes').textContent    = kpis.mensajesPendientes;
    document.getElementById('kpi-clientes').textContent    = kpis.totalClientes;
  }

  // Reservas de hoy
  const todayStr = new Date().toISOString().split('T')[0];
  const { data: reservas } = await DB.getReservations({ date: todayStr });
  const tbody = document.getElementById('tbody-reservas');
  if (!reservas || reservas.length === 0) {
    tableEmpty('tbody-reservas', 5, 'No hay reservas para hoy.');
  } else {
    tbody.innerHTML = reservas
      .filter(r => r.status !== 'cancelada')
      .map(r => `
        <tr>
          <td><strong>${formatTime(r.reservation_date)}</strong></td>
          <td>${customerCell(r.customer)}</td>
          <td><i class="fas fa-users text-muted me-1"></i>${r.guests}</td>
          <td>${reservationBadge(r.status)}</td>
          <td class="text-muted-sm">${r.notes ? escapeHtml(r.notes.substring(0, 40)) + (r.notes.length > 40 ? '…' : '') : '—'}</td>
        </tr>`).join('');
    if (tbody.innerHTML === '') tableEmpty('tbody-reservas', 5, 'No hay reservas para hoy.');
  }

  // Pedidos activos
  const { data: orders } = await DB.getOrders();
  const listPedidos = document.getElementById('list-pedidos');
  const activos = (orders || []).filter(o => o.status === 'pendiente' || o.status === 'en_preparacion');
  if (activos.length === 0) {
    listPedidos.innerHTML = '<p class="text-muted-sm text-center py-4">No hay pedidos activos.</p>';
  } else {
    listPedidos.innerHTML = activos.map(o => `
      <div style="display:flex;align-items:center;gap:10px;padding:12px 16px;border-bottom:1px solid var(--border)">
        <div style="flex:1;min-width:0">
          <div style="font-size:13px;font-weight:600">${escapeHtml(o.title)}</div>
          <div style="font-size:12px;color:var(--text-muted)">${o.customer ? escapeHtml(o.customer.name) + ' ' + escapeHtml(o.customer.surname || '') : '—'}</div>
        </div>
        ${orderStatusBadge(o.status)}
      </div>`).join('');
  }

});
