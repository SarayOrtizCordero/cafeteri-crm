/* ============================================================
   UTILS.JS — Utilidades compartidas del CRM
   ============================================================ */

// ── HTML ESCAPE ───────────────────────────────────────────
function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── TOAST NOTIFICATIONS ───────────────────────────────────
function showToast(title, message = '', type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const icons = { success:'fa-check-circle', error:'fa-times-circle', warning:'fa-exclamation-triangle', info:'fa-info-circle' };
  const toast = document.createElement('div');
  toast.className = `crm-toast ${type}`;
  toast.innerHTML = `
    <i class="fas ${icons[type] || icons.info} toast-icon"></i>
    <div class="toast-body">
      <div class="toast-title">${escapeHtml(title)}</div>
      ${message ? `<div class="toast-msg">${escapeHtml(message)}</div>` : ''}
    </div>
    <button class="toast-close" onclick="this.closest('.crm-toast').remove()">
      <i class="fas fa-times"></i>
    </button>`;

  container.appendChild(toast);
  setTimeout(() => toast.remove(), 4500);
}

// ── FORMATTERS ────────────────────────────────────────────
function formatDate(isoStr, { time = false, relative = false } = {}) {
  if (!isoStr) return '—';
  const d = new Date(isoStr);
  if (isNaN(d)) return '—';

  if (relative) {
    const diff = Date.now() - d.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1)  return 'ahora';
    if (mins < 60) return `hace ${mins} min`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24)  return `hace ${hrs}h`;
    const days = Math.floor(hrs / 24);
    if (days < 7)  return `hace ${days}d`;
  }

  const opts = { day:'2-digit', month:'2-digit', year:'numeric' };
  if (time) { opts.hour = '2-digit'; opts.minute = '2-digit'; }
  return d.toLocaleDateString('es-AR', opts);
}

function formatTime(isoStr) {
  if (!isoStr) return '—';
  return new Date(isoStr).toLocaleTimeString('es-AR', { hour:'2-digit', minute:'2-digit' });
}

function formatCurrency(amount, currency = 'ARS') {
  if (amount === null || amount === undefined) return '—';
  return new Intl.NumberFormat('es-AR', { style:'currency', currency, minimumFractionDigits:0 }).format(amount);
}

function formatNumber(n) {
  return new Intl.NumberFormat('es-AR').format(n);
}

// ── STATUS BADGES ─────────────────────────────────────────
function reservationBadge(status) {
  const labels = {
    pendiente:  'Pendiente',
    confirmada: 'Confirmada',
    finalizada: 'Finalizada',
    cancelada:  'Cancelada',
  };
  return `<span class="badge-status badge-${status}">${labels[status] || status}</span>`;
}

function orderStatusBadge(status) {
  const map = {
    pendiente:      { cls:'badge-pendiente',      label:'Pendiente' },
    en_preparacion: { cls:'badge-confirmada',     label:'En preparación' },
    listo:          { cls:'badge-listo',          label:'Listo' },
    entregado:      { cls:'badge-finalizada',     label:'Entregado' },
    cancelado:      { cls:'badge-cancelada',      label:'Cancelado' },
  };
  const m = map[status] || { cls:'', label: status };
  return `<span class="badge-status ${m.cls}">${m.label}</span>`;
}

function severityBadge(severity) {
  const labels = { baja:'Baja', media:'Media', alta:'Alta' };
  return `<span class="badge-status badge-severity-${severity}">${labels[severity] || severity}</span>`;
}

function incidentStatusBadge(status) {
  const map = {
    abierta:    { cls:'badge-cancelada',  label:'Abierta' },
    en_proceso: { cls:'badge-pendiente',  label:'En proceso' },
    resuelta:   { cls:'badge-confirmada', label:'Resuelta' },
    cerrada:    { cls:'badge-finalizada', label:'Cerrada' },
  };
  const m = map[status] || { cls:'', label: status };
  return `<span class="badge-status ${m.cls}">${m.label}</span>`;
}

// ── STAR RATING ───────────────────────────────────────────
function starRating(rating, max = 5) {
  let html = '<span class="star-rating">';
  for (let i = 1; i <= max; i++) {
    html += `<i class="fas fa-star star ${i <= rating ? 'filled' : ''}"></i>`;
  }
  html += '</span>';
  return html;
}

// ── CUSTOMER AVATAR ───────────────────────────────────────
const AVATAR_COLORS = ['#A06A3F','#3B82F6','#10B981','#8B5CF6','#EF4444','#F59E0B','#06B6D4','#EC4899'];

function avatarColor(name = '') {
  let hash = 0;
  for (const c of name) hash = c.charCodeAt(0) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function customerAvatar(name = '', size = 36) {
  const initials = name.split(' ').slice(0,2).map(w=>w[0]?.toUpperCase()).join('');
  const color = avatarColor(name);
  return `<div class="customer-avatar" style="width:${size}px;height:${size}px;background:${color};font-size:${Math.round(size*0.36)}px">${escapeHtml(initials)}</div>`;
}

// ── CUSTOMER CELL ─────────────────────────────────────────
function customerCell(customer) {
  if (!customer) return '<span class="text-muted-sm">—</span>';
  const fullName = `${customer.name} ${customer.surname || ''}`.trim();
  return `
    <div class="td-customer">
      ${customerAvatar(fullName)}
      <div>
        <div class="customer-name">${escapeHtml(fullName)}</div>
        <div class="customer-email">${escapeHtml(customer.email || customer.phone || '')}</div>
      </div>
    </div>`;
}

// ── MODAL HELPERS ─────────────────────────────────────────
function openModal(modalId) {
  const el = document.getElementById(modalId);
  if (!el) return;
  const modal = bootstrap.Modal.getOrCreateInstance(el);
  modal.show();
}

function closeModal(modalId) {
  const el = document.getElementById(modalId);
  if (!el) return;
  const modal = bootstrap.Modal.getInstance(el);
  modal?.hide();
}

// ── CONFIRM DIALOG ────────────────────────────────────────
function confirmAction(message, onConfirm, { danger = true } = {}) {
  if (confirm(message)) onConfirm();
}

// ── TABLE HELPERS ─────────────────────────────────────────
function tableEmpty(tbodyId, colSpan, message = 'No hay datos para mostrar.') {
  const tbody = document.getElementById(tbodyId);
  if (!tbody) return;
  tbody.innerHTML = `
    <tr>
      <td colspan="${colSpan}" class="text-center py-5">
        <div class="text-muted-sm">
          <i class="fas fa-inbox d-block mb-2" style="font-size:2rem;opacity:.3"></i>
          ${message}
        </div>
      </td>
    </tr>`;
}

function tableLoading(tbodyId, colSpan) {
  const tbody = document.getElementById(tbodyId);
  if (!tbody) return;
  tbody.innerHTML = `
    <tr>
      <td colspan="${colSpan}" class="text-center py-4">
        <div class="spinner mx-auto" style="width:28px;height:28px"></div>
      </td>
    </tr>`;
}

// ── FORM HELPERS ──────────────────────────────────────────
function formToObject(formEl) {
  const data = {};
  new FormData(formEl).forEach((val, key) => { data[key] = val; });
  return data;
}

function populateForm(formEl, data) {
  if (!formEl || !data) return;
  Object.entries(data).forEach(([key, val]) => {
    const el = formEl.querySelector(`[name="${key}"]`);
    if (!el) return;
    if (el.type === 'checkbox') el.checked = !!val;
    else el.value = val !== null && val !== undefined ? val : '';
  });
}

function clearForm(formEl) {
  if (!formEl) return;
  formEl.reset();
}

// ── DATE HELPERS ──────────────────────────────────────────
function todayISO() {
  return new Date().toISOString().split('T')[0];
}

function dateForInput(isoStr) {
  if (!isoStr) return '';
  return isoStr.split('T')[0];
}

function dateTimeForInput(isoStr) {
  if (!isoStr) return '';
  const d = new Date(isoStr);
  const pad = n => String(n).padStart(2,'0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// ── CUSTOMER SELECT ───────────────────────────────────────
async function populateCustomerSelect(selectId, selectedId = '', placeholder = '— Seleccionar cliente —') {
  const sel = document.getElementById(selectId);
  if (!sel) return;
  const { data } = await DB.getCustomers();
  const opts = (data || []).map(c =>
    `<option value="${c.id}" ${c.id === selectedId ? 'selected' : ''}>${c.name} ${c.surname || ''}</option>`
  ).join('');
  sel.innerHTML = `<option value="">${placeholder}</option>` + opts;
}

// ── SEARCH DEBOUNCE ───────────────────────────────────────
function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// ── EXPORT CSV ────────────────────────────────────────────
function exportCSV(headers, rows, filename = 'export.csv') {
  const escape = v => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const csv = [headers.join(','), ...rows.map(r => r.map(escape).join(','))].join('\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

