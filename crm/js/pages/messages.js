/* messages.js — Lógica de la página Mensajes */
Auth.requireAuth();

let activeCustomerId   = null;
let activeCustomerData = null;
let conversations      = [];

async function loadConversations(filter = '') {
  const { data, error } = await DB.getConversations();
  if (error) { showToast('Error', 'No se pudieron cargar los mensajes.', 'error'); return; }
  conversations = data || [];

  const filtered = filter
    ? conversations.filter(c => {
        const name = `${c.customer?.name || ''} ${c.customer?.surname || ''}`.toLowerCase();
        return name.includes(filter.toLowerCase());
      })
    : conversations;

  const listEl = document.getElementById('conv-list');
  if (!filtered.length) {
    listEl.innerHTML = '<p class="text-muted-sm text-center py-4">Sin conversaciones.</p>';
    return;
  }

  listEl.innerHTML = filtered.map(c => {
    const fullName   = `${c.customer?.name || ''} ${c.customer?.surname || ''}`.trim() || 'Desconocido';
    const rawPreview = c.last_message?.message || '';
    const preview    = rawPreview.substring(0, 40) + (rawPreview.length > 40 ? '…' : '');
    const time       = c.last_message ? formatDate(c.last_message.created_at, { relative: true }) : '';
    const isActive   = c.customer?.id === activeCustomerId ? 'active' : '';
    return `
      <div class="conversation-item ${isActive}" onclick="openConversation('${c.customer?.id}')">
        ${customerAvatar(escapeHtml(fullName), 40)}
        <div class="conversation-item-info">
          <div class="conversation-item-name">${escapeHtml(fullName)}</div>
          <div class="conversation-item-preview">${c.last_message?.direction === 'incoming' ? '← ' : '→ '}${escapeHtml(preview)}</div>
        </div>
        <div class="conversation-item-meta">
          <span class="conversation-item-time">${time}</span>
          ${c.unread ? `<span class="conversation-unread">${c.unread}</span>` : ''}
        </div>
      </div>`;
  }).join('');
}

async function openConversation(customerId) {
  activeCustomerId = customerId;
  const conv = conversations.find(c => c.customer?.id === customerId);
  activeCustomerData = conv?.customer || null;

  document.querySelectorAll('.conversation-item').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.conversation-item').forEach(el => {
    if (el.getAttribute('onclick')?.includes(customerId)) el.classList.add('active');
  });

  document.getElementById('conv-empty').classList.add('d-none');
  document.getElementById('conv-header').classList.remove('d-none');
  document.getElementById('conv-messages').classList.remove('d-none');
  document.getElementById('conv-input-area').classList.remove('d-none');

  document.getElementById('messages-layout').classList.add('panel-open');

  const fullName = `${activeCustomerData?.name || ''} ${activeCustomerData?.surname || ''}`.trim();
  document.getElementById('conv-header-avatar').innerHTML = customerAvatar(fullName, 40);
  document.getElementById('conv-header-name').textContent = fullName;
  document.getElementById('conv-header-sub').textContent  = activeCustomerData?.email || activeCustomerData?.phone || '';
  document.getElementById('conv-header-link').href = 'customers.html';

  await renderMessages(customerId);
  document.getElementById('msg-input').focus();
}

async function renderMessages(customerId) {
  const messagesEl = document.getElementById('conv-messages');
  messagesEl.innerHTML = '<div class="text-center py-3"><div class="spinner mx-auto" style="width:24px;height:24px"></div></div>';

  const { data, error } = await DB.getMessages(customerId);
  if (error || !data) { messagesEl.innerHTML = '<p class="text-muted-sm text-center py-4">No se pudieron cargar los mensajes.</p>'; return; }

  if (!data.length) {
    messagesEl.innerHTML = '<p class="text-muted-sm text-center py-4">Aún no hay mensajes en esta conversación.</p>';
    return;
  }

  messagesEl.innerHTML = data.map(m => `
    <div class="message-row ${m.direction}">
      <div>
        <div class="message-bubble ${m.direction}">${escapeHtml(m.message)}</div>
        <div class="message-time ${m.direction}">${formatDate(m.created_at, { time: true })}</div>
      </div>
    </div>`).join('');

  messagesEl.scrollTop = messagesEl.scrollHeight;
}

async function sendMessage(direction) {
  const input = document.getElementById('msg-input');
  const text  = input.value.trim();
  if (!text || !activeCustomerId) return;

  const { error } = await DB.createMessage({ customer_id: activeCustomerId, message: text, direction });
  if (error) { showToast('Error', 'No se pudo enviar el mensaje.', 'error'); return; }

  input.value = '';
  await renderMessages(activeCustomerId);
  await loadConversations(document.getElementById('conv-search').value);
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadConversations();

  document.getElementById('conv-search').addEventListener('input', debounce((e) => {
    loadConversations(e.target.value);
  }, 300));

  document.getElementById('btn-send-out').addEventListener('click', () => sendMessage('outgoing'));
  document.getElementById('btn-send-in').addEventListener('click',  () => sendMessage('incoming'));

  document.getElementById('msg-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage('outgoing');
    }
  });

  document.getElementById('btn-new-conv').addEventListener('click', async () => {
    const sel = document.getElementById('new-conv-customer');
    const { data } = await DB.getCustomers();
    const opts = (data || []).map(c =>
      `<option value="${c.id}">${c.name} ${c.surname || ''}</option>`
    ).join('');
    sel.innerHTML = '<option value="">— Seleccioná un cliente —</option>' + opts;
    openModal('modal-new-conv');
  });

  document.getElementById('btn-start-conv').addEventListener('click', async () => {
    const customerId = document.getElementById('new-conv-customer').value;
    if (!customerId) { showToast('Atención', 'Seleccioná un cliente.', 'warning'); return; }
    closeModal('modal-new-conv');

    const exists = conversations.find(c => c.customer?.id === customerId);
    if (!exists) {
      const { data: customer } = await DB.getCustomer(customerId);
      if (customer) conversations.unshift({ customer, last_message: null, unread: 0, count: 0 });
    }
    loadConversations().then(() => openConversation(customerId));
  });
});
