/* incidents.js — Lógica de la página Incidencias */
Auth.requireAuth();

let allIncidents = [];


async function loadIncidents() {
  const status   = document.getElementById('filter-status').value;
  const priority = document.getElementById('filter-priority').value;
  const { data, error } = await DB.getIncidents({ status: status || null, priority: priority || null });
  if (error) { showToast('Error', 'No se pudieron cargar las incidencias.', 'error'); return; }
  allIncidents = data || [];
  renderStats();
  renderTable();
}

function renderStats() {
  document.getElementById('stat-abiertas').textContent  = allIncidents.filter(i => i.status === 'abierta').length;
  document.getElementById('stat-proceso').textContent   = allIncidents.filter(i => i.status === 'en_proceso').length;
  document.getElementById('stat-resueltas').textContent = allIncidents.filter(i => i.status === 'resuelta' || i.status === 'cerrada').length;
  document.getElementById('stat-alta').textContent      = allIncidents.filter(i => i.priority === 'alta').length;
}

function renderTable() {
  const tbody = document.getElementById('tbody-incidents');
  if (!allIncidents.length) { tableEmpty('tbody-incidents', 6, 'No hay incidencias.'); return; }
  tbody.innerHTML = allIncidents.map(i => `
    <tr>
      <td class="text-muted-sm">${formatDate(i.created_at, { time: true })}</td>
      <td>${i.customer ? customerCell(i.customer) : '<span class="text-muted-sm">—</span>'}</td>
      <td>
        <div style="font-weight:600;font-size:13px">${escapeHtml(i.title)}</div>
        ${i.description ? `<div class="text-muted-sm">${escapeHtml(i.description.substring(0, 60))}${i.description.length > 60 ? '…' : ''}</div>` : ''}
      </td>
      <td>${severityBadge(i.priority)}</td>
      <td>
        <select class="form-control-crm" style="width:130px;padding:5px 8px;font-size:12px" onchange="changeStatus('${i.id}', this.value)" title="Cambiar estado" aria-label="Cambiar estado">
          ${['abierta', 'en_proceso', 'resuelta', 'cerrada'].map(s =>
            `<option value="${s}" ${s === i.status ? 'selected' : ''}>${{ abierta: 'Abierta', en_proceso: 'En proceso', resuelta: 'Resuelta', cerrada: 'Cerrada' }[s]}</option>`
          ).join('')}
        </select>
      </td>
      <td>
        <div class="d-flex gap-1">
          <button type="button" class="btn-crm-icon" onclick="editIncident('${i.id}')" title="Editar" aria-label="Editar"><i class="fas fa-edit"></i></button>
        </div>
      </td>
    </tr>`).join('');
}

async function changeStatus(id, status) {
  const { error } = await DB.updateIncident(id, { status });
  if (error) { showToast('Error', 'No se pudo actualizar el estado.', 'error'); return; }
  showToast('Actualizado', 'Estado cambiado.', 'success');
  const idx = allIncidents.findIndex(i => i.id === id);
  if (idx !== -1) { allIncidents[idx].status = status; renderStats(); }
}

function editIncident(id) {
  const i = allIncidents.find(x => x.id === id);
  if (!i) return;
  document.getElementById('modal-inc-label').textContent = 'Editar incidencia';
  document.getElementById('f-id').value         = i.id;
  document.getElementById('f-title').value      = i.title || '';
  document.getElementById('f-desc').value       = i.description || '';
  document.getElementById('f-status').value     = i.status;
  document.getElementById('f-resolution').value = i.resolution || '';
  document.querySelector(`input[name="priority"][value="${i.priority}"]`).checked = true;
  populateCustomerSelect('f-customer', i.customer_id || '', '— Sin cliente asociado —');
  openModal('modal-inc');
}

document.addEventListener('DOMContentLoaded', () => {
  loadIncidents();

  document.getElementById('btn-new').addEventListener('click', () => {
    document.getElementById('modal-inc-label').textContent = 'Reportar incidencia';
    document.getElementById('form-inc').reset();
    document.getElementById('f-id').value = '';
    document.getElementById('p-baja').checked = true;
    populateCustomerSelect('f-customer', '', '— Sin cliente asociado —');
    openModal('modal-inc');
  });

  document.getElementById('filter-status').addEventListener('change', loadIncidents);
  document.getElementById('filter-priority').addEventListener('change', loadIncidents);

  document.getElementById('form-inc').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id   = document.getElementById('f-id').value;
    const data = {
      customer_id: document.getElementById('f-customer').value || null,
      title:       document.getElementById('f-title').value.trim(),
      description: document.getElementById('f-desc').value.trim(),
      priority:    document.querySelector('input[name="priority"]:checked').value,
      status:      document.getElementById('f-status').value,
      resolution:  document.getElementById('f-resolution').value.trim(),
    };
    if (!data.title) { showToast('Campo requerido', 'El título es obligatorio.', 'warning'); return; }

    const btn = document.getElementById('btn-save');
    btn.disabled = true;
    const result = id ? await DB.updateIncident(id, data) : await DB.createIncident(data);
    btn.disabled = false;

    if (result.error) { showToast('Error', 'No se pudo guardar.', 'error'); return; }
    showToast('Guardado', id ? 'Incidencia actualizada.' : 'Incidencia creada.', 'success');
    closeModal('modal-inc');
    loadIncidents();
  });

  if (new URLSearchParams(location.search).get('new') === '1') {
    setTimeout(() => document.getElementById('btn-new').click(), 300);
  }
});
