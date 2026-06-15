/* orders.js — Lógica de la página Pedidos */
Auth.requireAuth();

let allOrders = [];


async function loadOrders() {
  const search = document.getElementById('input-search').value.trim();
  const status = document.getElementById('filter-status').value;
  const { data, error } = await DB.getOrders({ status: status || null, search });
  if (error) { showToast('Error', 'No se pudieron cargar los pedidos.', 'error'); return; }
  allOrders = data || [];
  renderStats();
  renderTable();
}

function renderStats() {
  const todayStr = new Date().toDateString();
  document.getElementById('stat-total').textContent       = allOrders.length;
  document.getElementById('stat-pendiente').textContent   = allOrders.filter(o => o.status === 'pendiente').length;
  document.getElementById('stat-preparacion').textContent = allOrders.filter(o => o.status === 'en_preparacion').length;
  document.getElementById('stat-entregados').textContent  = allOrders.filter(o => o.status === 'entregado' && new Date(o.pickup_date).toDateString() === todayStr).length;
}

function renderTable() {
  const tbody = document.getElementById('tbody-orders');
  if (!allOrders.length) { tableEmpty('tbody-orders', 7, 'No hay pedidos.'); return; }
  tbody.innerHTML = allOrders.map(o => `
    <tr>
      <td class="text-muted-sm">${formatDate(o.created_at)}</td>
      <td>${o.customer ? customerCell(o.customer) : '<span class="text-muted-sm">—</span>'}</td>
      <td>
        <div class="td-title-main">${escapeHtml(o.title)}</div>
        ${o.description ? `<div class="td-title-sub">${escapeHtml(o.description.substring(0, 50))}${o.description.length > 50 ? '…' : ''}</div>` : ''}
      </td>
      <td>${o.price ? formatCurrency(o.price) : '<span class="text-muted-sm">—</span>'}</td>
      <td class="text-muted-sm">${o.pickup_date ? formatDate(o.pickup_date, { time: true }) : '—'}</td>
      <td>
        <select class="form-control-crm inline-select" onchange="changeStatus('${o.id}', this.value)" title="Cambiar estado" aria-label="Cambiar estado">
          ${['pendiente', 'en_preparacion', 'listo', 'entregado', 'cancelado'].map(s =>
            `<option value="${s}" ${s === o.status ? 'selected' : ''}>${{ pendiente: 'Pendiente', en_preparacion: 'En preparación', listo: 'Listo', entregado: 'Entregado', cancelado: 'Cancelado' }[s]}</option>`
          ).join('')}
        </select>
      </td>
      <td>
        <div class="d-flex gap-1">
          <button type="button" class="btn-crm-icon" onclick="editOrder('${o.id}')" title="Editar" aria-label="Editar"><i class="fas fa-edit"></i></button>
          <button type="button" class="btn-crm-icon" onclick="deleteOrder('${o.id}')" title="Eliminar" aria-label="Eliminar" style="color:var(--clr-danger)"><i class="fas fa-trash"></i></button>
        </div>
      </td>
    </tr>`).join('');
}

async function changeStatus(id, status) {
  const { error } = await DB.updateOrder(id, { status });
  if (error) { showToast('Error', 'No se pudo actualizar.', 'error'); return; }
  showToast('Actualizado', 'Estado cambiado.', 'success');
  const idx = allOrders.findIndex(o => o.id === id);
  if (idx !== -1) { allOrders[idx].status = status; renderStats(); }
}

function editOrder(id) {
  const o = allOrders.find(x => x.id === id);
  if (!o) return;
  document.getElementById('modal-order-label').textContent = 'Editar pedido';
  document.getElementById('f-id').value     = o.id;
  document.getElementById('f-title').value  = o.title || '';
  document.getElementById('f-desc').value   = o.description || '';
  document.getElementById('f-price').value  = o.price || '';
  document.getElementById('f-status').value = o.status;
  document.getElementById('f-pickup').value = o.pickup_date ? dateTimeForInput(o.pickup_date) : '';
  populateCustomerSelect('f-customer', o.customer_id || '', '— Sin cliente asociado —');
  openModal('modal-order');
}

async function deleteOrder(id) {
  confirmAction('¿Eliminar este pedido? Esta acción no se puede deshacer.', async () => {
    const { error } = await DB.deleteOrder(id);
    if (error) { showToast('Error', 'No se pudo eliminar.', 'error'); return; }
    showToast('Eliminado', 'Pedido eliminado.', 'success');
    loadOrders();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadOrders();

  document.getElementById('btn-new').addEventListener('click', () => {
    document.getElementById('modal-order-label').textContent = 'Nuevo pedido';
    document.getElementById('form-order').reset();
    document.getElementById('f-id').value = '';
    populateCustomerSelect('f-customer', '', '— Sin cliente asociado —');
    openModal('modal-order');
  });

  document.getElementById('input-search').addEventListener('input', debounce(loadOrders, 350));
  document.getElementById('filter-status').addEventListener('change', loadOrders);
  document.getElementById('btn-clear').addEventListener('click', () => {
    document.getElementById('input-search').value  = '';
    document.getElementById('filter-status').value = '';
    loadOrders();
  });

  document.getElementById('form-order').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id     = document.getElementById('f-id').value;
    const pickup = document.getElementById('f-pickup').value;
    const data   = {
      customer_id:  document.getElementById('f-customer').value || null,
      title:        document.getElementById('f-title').value.trim(),
      description:  document.getElementById('f-desc').value.trim(),
      price:        parseFloat(document.getElementById('f-price').value) || null,
      status:       document.getElementById('f-status').value,
      pickup_date:  pickup ? new Date(pickup).toISOString() : null,
    };
    if (!data.title) { showToast('Campo requerido', 'El nombre del pedido es obligatorio.', 'warning'); return; }

    const btn = document.getElementById('btn-save');
    btn.disabled = true;
    const result = id ? await DB.updateOrder(id, data) : await DB.createOrder(data);
    btn.disabled = false;

    if (result.error) { showToast('Error', 'No se pudo guardar.', 'error'); return; }
    showToast('Guardado', id ? 'Pedido actualizado.' : 'Pedido creado.', 'success');
    closeModal('modal-order');
    loadOrders();
  });

  if (new URLSearchParams(location.search).get('new') === '1') {
    setTimeout(() => document.getElementById('btn-new').click(), 300);
  }
});
