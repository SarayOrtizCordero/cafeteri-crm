/* reservations.js — Lógica de la página Reservas */
Auth.requireAuth();

let allReservations = [];


async function loadReservations() {
  const search = document.getElementById('input-search').value.trim();
  const date   = document.getElementById('filter-date').value;
  const status = document.getElementById('filter-status').value;
  const { data, error } = await DB.getReservations({ date: date || null, status: status || null, search });
  if (error) { showToast('Error', 'No se pudieron cargar las reservas.', 'error'); return; }
  allReservations = data || [];
  renderStats();
  renderTable();
}

function renderStats() {
  const todayStr = new Date().toDateString();
  document.getElementById('stat-hoy').textContent       = allReservations.filter(r => new Date(r.reservation_date).toDateString() === todayStr && r.status !== 'cancelada').length;
  document.getElementById('stat-pendiente').textContent  = allReservations.filter(r => r.status === 'pendiente').length;
  document.getElementById('stat-confirmada').textContent = allReservations.filter(r => r.status === 'confirmada').length;
  document.getElementById('stat-cancelada').textContent  = allReservations.filter(r => r.status === 'cancelada').length;
}

function renderTable() {
  const tbody = document.getElementById('tbody-reservations');
  if (!allReservations.length) { tableEmpty('tbody-reservations', 6, 'No hay reservas.'); return; }
  tbody.innerHTML = allReservations.map(r => `
    <tr>
      <td><strong>${formatDate(r.reservation_date, { time: true })}</strong></td>
      <td>${customerCell(r.customer)}</td>
      <td><i class="fas fa-users text-muted me-1"></i>${r.guests}</td>
      <td>${reservationBadge(r.status)}</td>
      <td class="text-muted-sm">${r.notes ? r.notes.substring(0, 45) + (r.notes.length > 45 ? '…' : '') : '—'}</td>
      <td>
        <div class="d-flex gap-1">
          <button type="button" class="btn-crm-icon" onclick="editReservation('${r.id}')" title="Editar" aria-label="Editar"><i class="fas fa-edit"></i></button>
          <button type="button" class="btn-crm-icon" onclick="deleteReservation('${r.id}')" title="Eliminar" aria-label="Eliminar" style="color:var(--clr-danger)"><i class="fas fa-trash"></i></button>
        </div>
      </td>
    </tr>`).join('');
}

function editReservation(id) {
  const r = allReservations.find(x => x.id === id);
  if (!r) return;
  document.getElementById('modal-res-label').textContent = 'Editar reserva';
  document.getElementById('f-id').value     = r.id;
  document.getElementById('f-date').value   = dateTimeForInput(r.reservation_date);
  document.getElementById('f-guests').value = r.guests;
  document.getElementById('f-status').value = r.status;
  document.getElementById('f-notes').value  = r.notes || '';
  populateCustomerSelect('f-customer', r.customer_id);
  openModal('modal-res');
}

async function deleteReservation(id) {
  const r = allReservations.find(x => x.id === id);
  confirmAction(`¿Eliminar la reserva de ${r?.customer?.name || ''}? Esta acción no se puede deshacer.`, async () => {
    const { error } = await DB.deleteReservation(id);
    if (error) { showToast('Error', 'No se pudo eliminar.', 'error'); return; }
    showToast('Eliminada', 'Reserva eliminada.', 'success');
    loadReservations();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadReservations();

  document.getElementById('btn-new').addEventListener('click', () => {
    document.getElementById('modal-res-label').textContent = 'Nueva reserva';
    document.getElementById('form-res').reset();
    document.getElementById('f-id').value = '';
    const d = new Date(); d.setHours(20, 0, 0, 0);
    document.getElementById('f-date').value = dateTimeForInput(d.toISOString());
    populateCustomerSelect('f-customer');
    openModal('modal-res');
  });

  document.getElementById('input-search').addEventListener('input', debounce(loadReservations, 350));
  document.getElementById('filter-date').addEventListener('change', loadReservations);
  document.getElementById('filter-status').addEventListener('change', loadReservations);
  document.getElementById('btn-clear').addEventListener('click', () => {
    document.getElementById('input-search').value  = '';
    document.getElementById('filter-date').value   = '';
    document.getElementById('filter-status').value = '';
    loadReservations();
  });

  document.getElementById('form-res').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id   = document.getElementById('f-id').value;
    const data = {
      customer_id:      document.getElementById('f-customer').value,
      reservation_date: new Date(document.getElementById('f-date').value).toISOString(),
      guests:           parseInt(document.getElementById('f-guests').value),
      status:           document.getElementById('f-status').value,
      notes:            document.getElementById('f-notes').value.trim(),
    };
    if (!data.customer_id) { showToast('Campo requerido', 'Seleccioná un cliente.', 'warning'); return; }
    if (!data.reservation_date || isNaN(new Date(data.reservation_date))) { showToast('Campo requerido', 'La fecha es obligatoria.', 'warning'); return; }

    const btn = document.getElementById('btn-save');
    btn.disabled = true;
    const result = id ? await DB.updateReservation(id, data) : await DB.createReservation(data);
    btn.disabled = false;

    if (result.error) { showToast('Error', 'No se pudo guardar.', 'error'); return; }
    showToast('Guardado', id ? 'Reserva actualizada.' : 'Reserva creada.', 'success');
    closeModal('modal-res');
    loadReservations();
  });

  if (new URLSearchParams(location.search).get('new') === '1') {
    setTimeout(() => document.getElementById('btn-new').click(), 300);
  }
});
