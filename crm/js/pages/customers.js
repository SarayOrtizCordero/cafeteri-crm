/* customers.js — Lógica de la página Clientes */
Auth.requireAuth();

const PAGE_SIZE = 15;
let allCustomers     = [];
let currentPage      = 1;
let detailCustomerId = null;

async function loadCustomers() {
  const search = document.getElementById('input-search').value.trim();
  const { data, error } = await DB.getCustomers({ search });
  if (error) { showToast('Error', 'No se pudieron cargar los clientes.', 'error'); return; }
  allCustomers = data || [];
  currentPage  = 1;
  renderStats();
  renderTable();
}

function renderStats() {
  const total    = allCustomers.length;
  const thisMonth = new Date(); thisMonth.setDate(1); thisMonth.setHours(0, 0, 0, 0);
  const newMonth  = allCustomers.filter(c => new Date(c.created_at) >= thisMonth).length;
  const withEmail = allCustomers.filter(c => c.email).length;
  const withPhone = allCustomers.filter(c => c.phone).length;
  document.getElementById('stat-total').textContent = total;
  document.getElementById('stat-mes').textContent   = newMonth;
  document.getElementById('stat-email').textContent = withEmail;
  document.getElementById('stat-phone').textContent = withPhone;
}

function renderTable() {
  const tbody = document.getElementById('tbody-customers');
  const total = allCustomers.length;
  const pages = Math.ceil(total / PAGE_SIZE) || 1;
  if (currentPage > pages) currentPage = pages;
  const slice = allCustomers.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  if (slice.length === 0) {
    tableEmpty('tbody-customers', 5, 'No se encontraron clientes.');
  } else {
    tbody.innerHTML = slice.map(c => `
      <tr>
        <td>${customerCell(c)}</td>
        <td>${c.phone ? escapeHtml(c.phone) : '<span class="text-muted-sm">—</span>'}</td>
        <td>${c.email ? escapeHtml(c.email) : '<span class="text-muted-sm">—</span>'}</td>
        <td class="text-muted-sm">${formatDate(c.created_at)}</td>
        <td>
          <div class="d-flex gap-1">
            <button type="button" class="btn-crm-icon" onclick="viewCustomer('${c.id}')" title="Ver detalle" aria-label="Ver detalle"><i class="fas fa-eye"></i></button>
            <button type="button" class="btn-crm-icon" onclick="editCustomer('${c.id}')" title="Editar" aria-label="Editar"><i class="fas fa-edit"></i></button>
            <button type="button" class="btn-crm-icon" onclick="deleteCustomer('${c.id}')" title="Eliminar" aria-label="Eliminar" style="color:var(--clr-danger)"><i class="fas fa-trash"></i></button>
          </div>
        </td>
      </tr>`).join('');
  }

  document.getElementById('pagination-info').textContent =
    `Mostrando ${Math.min((currentPage - 1) * PAGE_SIZE + 1, total)}–${Math.min(currentPage * PAGE_SIZE, total)} de ${total}`;

  const btns = document.getElementById('pagination-btns');
  btns.innerHTML = '';
  if (pages > 1) {
    const prev = document.createElement('button');
    prev.type = 'button'; prev.className = 'btn-crm btn-crm-secondary btn-crm-sm';
    prev.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prev.disabled = currentPage === 1;
    prev.onclick = () => { currentPage--; renderTable(); };
    btns.appendChild(prev);

    const next = document.createElement('button');
    next.type = 'button'; next.className = 'btn-crm btn-crm-secondary btn-crm-sm';
    next.innerHTML = '<i class="fas fa-chevron-right"></i>';
    next.disabled = currentPage === pages;
    next.onclick = () => { currentPage++; renderTable(); };
    btns.appendChild(next);
  }
}

function viewCustomer(id) {
  const c = allCustomers.find(x => x.id === id);
  if (!c) return;
  detailCustomerId = id;
  const fullName = `${c.name} ${c.surname || ''}`.trim();
  document.getElementById('modal-detail-body').innerHTML = `
    <div class="d-flex align-items-center gap-3 mb-4">
      ${customerAvatar(fullName, 56)}
      <div>
        <h4 class="ff-heading mb-0">${escapeHtml(fullName)}</h4>
        <div class="text-muted-sm">Cliente desde ${formatDate(c.created_at)}</div>
      </div>
    </div>
    <div class="row g-3">
      <div class="col-md-6">
        <div class="crm-card p-3">
          <div class="crm-card-title mb-3"><i class="fas fa-address-card text-brand me-2"></i>Contacto</div>
          <div class="d-flex flex-column gap-2 text-muted-sm">
            <span><i class="fas fa-envelope me-2 text-muted"></i>${escapeHtml(c.email || 'Sin email')}</span>
            <span><i class="fas fa-phone me-2 text-muted"></i>${escapeHtml(c.phone || 'Sin teléfono')}</span>
            <span><i class="fas fa-birthday-cake me-2 text-muted"></i>${c.birth_date ? formatDate(c.birth_date) : 'No registrado'}</span>
          </div>
        </div>
      </div>
      ${c.notes ? `
      <div class="col-md-6">
        <div class="crm-card p-3">
          <div class="crm-card-title mb-3"><i class="fas fa-sticky-note text-brand me-2"></i>Notas internas</div>
          <p class="text-muted-sm mb-0">${escapeHtml(c.notes)}</p>
        </div>
      </div>` : ''}
    </div>`;
  openModal('modal-detail');
}

function editCustomer(id) {
  const c = allCustomers.find(x => x.id === id);
  if (!c) return;
  closeModal('modal-detail');
  document.getElementById('modal-customer-label').textContent = 'Editar cliente';
  document.getElementById('f-id').value      = c.id;
  document.getElementById('f-name').value    = c.name || '';
  document.getElementById('f-surname').value = c.surname || '';
  document.getElementById('f-email').value   = c.email || '';
  document.getElementById('f-phone').value   = c.phone || '';
  document.getElementById('f-birth').value   = c.birth_date || '';
  document.getElementById('f-notes').value   = c.notes || '';
  openModal('modal-customer');
}

async function deleteCustomer(id) {
  const c = allCustomers.find(x => x.id === id);
  confirmAction(`¿Eliminar a ${c?.name} ${c?.surname || ''}? Esta acción no se puede deshacer.`, async () => {
    const { error } = await DB.deleteCustomer(id);
    if (error) { showToast('Error', 'No se pudo eliminar.', 'error'); return; }
    showToast('Eliminado', 'Cliente eliminado correctamente.', 'success');
    loadCustomers();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadCustomers();

  document.getElementById('btn-new').addEventListener('click', () => {
    document.getElementById('modal-customer-label').textContent = 'Nuevo cliente';
    document.getElementById('form-customer').reset();
    document.getElementById('f-id').value = '';
    openModal('modal-customer');
  });

  document.getElementById('input-search').addEventListener('input', debounce(loadCustomers, 350));
  document.getElementById('btn-clear').addEventListener('click', () => {
    document.getElementById('input-search').value = '';
    loadCustomers();
  });

  document.getElementById('form-customer').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id   = document.getElementById('f-id').value;
    const data = {
      name:       document.getElementById('f-name').value.trim(),
      surname:    document.getElementById('f-surname').value.trim(),
      email:      document.getElementById('f-email').value.trim(),
      phone:      document.getElementById('f-phone').value.trim(),
      birth_date: document.getElementById('f-birth').value || null,
      notes:      document.getElementById('f-notes').value.trim(),
    };
    if (!data.name) { showToast('Campo requerido', 'El nombre es obligatorio.', 'warning'); return; }

    const btn = document.getElementById('btn-save');
    btn.disabled = true;
    const result = id ? await DB.updateCustomer(id, data) : await DB.createCustomer(data);
    btn.disabled = false;

    if (result.error) { showToast('Error', 'No se pudo guardar.', 'error'); return; }
    showToast('Guardado', id ? 'Cliente actualizado.' : 'Cliente creado.', 'success');
    closeModal('modal-customer');
    loadCustomers();
  });

  document.getElementById('btn-detail-edit').addEventListener('click', () => {
    if (detailCustomerId) editCustomer(detailCustomerId);
  });

  document.getElementById('btn-export').addEventListener('click', () => {
    const headers = ['Nombre', 'Apellido', 'Email', 'Teléfono', 'Nacimiento', 'Notas', 'Alta'];
    const rows = allCustomers.map(c => [c.name, c.surname, c.email, c.phone, c.birth_date, c.notes, c.created_at]);
    exportCSV(headers, rows, 'clientes.csv');
  });

  if (new URLSearchParams(location.search).get('new') === '1') {
    setTimeout(() => document.getElementById('btn-new').click(), 300);
  }
});
