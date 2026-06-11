/* ============================================================
   AUTH.JS — Gestión de sesión y autenticación CRM
   ============================================================ */

const Auth = {

  // Obtener usuario activo desde sesión
  getUser() {
    const s = this._getSession();
    return s?.user ?? null;
  },

  // Verificar si hay sesión activa; redirige a login si no
  requireAuth() {
    const user = this.getUser();
    if (!user) {
      window.location.href = 'index.html';
      return null;
    }
    return user;
  },

  // Verificar rol mínimo requerido
  requireRole(minRole) {
    const user = this.requireAuth();
    if (!user) return null;
    const roles = ['empleado','recepcionista','gerente','administrador'];
    const userLevel = roles.indexOf(user.role);
    const minLevel  = roles.indexOf(minRole);
    if (userLevel < minLevel) {
      showToast('Acceso denegado', 'No tenés permisos para esta sección.', 'error');
      setTimeout(() => { window.location.href = 'dashboard.html'; }, 1500);
      return null;
    }
    return user;
  },

  // Inicializar topbar con datos del usuario
  initTopbar() {
    const user = this.getUser();
    if (!user) return;

    // Inyectar nombre en topbar
    const nameEl = document.getElementById('topbar-user-name');
    if (nameEl) nameEl.textContent = user.full_name.split(' ')[0];

    const avatarEl = document.getElementById('topbar-avatar');
    if (avatarEl) avatarEl.textContent = this._initials(user.full_name);

    // Sidebar user
    const sidebarName = document.getElementById('sidebar-user-name');
    const sidebarRole = document.getElementById('sidebar-user-role');
    const sidebarAvatar = document.getElementById('sidebar-avatar');
    if (sidebarName)   sidebarName.textContent   = user.full_name;
    if (sidebarRole)   sidebarRole.textContent    = this._roleLabel(user.role);
    if (sidebarAvatar) sidebarAvatar.textContent  = this._initials(user.full_name);

    // Ocultar secciones según rol
    this._applyRoleVisibility(user.role);
  },

  // Login
  async login(email, password) {
    const { data, error } = await DB.login(email, password);
    if (error) return { error };
    return { data };
  },

  // Logout
  async logout() {
    await DB.logout();
    window.location.href = '../index.html';
  },

  // ── Internos ──
  _getSession() {
    try {
      const s = localStorage.getItem('crm_session');
      return s ? JSON.parse(s) : null;
    } catch { return null; }
  },

  _initials(name = '') {
    return name.split(' ').slice(0,2).map(w => w[0]).join('').toUpperCase();
  },

  _roleLabel(role) {
    const labels = {
      administrador: 'Administrador',
      gerente:       'Gerente',
      recepcionista: 'Recepcionista',
      empleado:      'Empleado',
    };
    return labels[role] || role;
  },

  _applyRoleVisibility(role) {
    const roles = ['empleado','recepcionista','gerente','administrador'];
    const level = roles.indexOf(role);

    // Secciones restringidas (solo admin/gerente)
    if (level < roles.indexOf('gerente')) {
      document.querySelectorAll('[data-min-role="gerente"]').forEach(el => el.remove());
    }
    if (level < roles.indexOf('administrador')) {
      document.querySelectorAll('[data-min-role="administrador"]').forEach(el => el.remove());
    }
  },
};

// Inicializar sidebar collapse
function initSidebar() {
  const sidebar = document.querySelector('.crm-sidebar');
  const main    = document.querySelector('.crm-main');
  const colBtn  = document.getElementById('sidebar-collapse-btn');
  const menuBtn = document.getElementById('topbar-menu-btn');
  const overlay = document.getElementById('sidebar-overlay');

  if (!sidebar) return;

  // Restaurar estado guardado
  const collapsed = localStorage.getItem('sidebar_collapsed') === 'true';
  if (collapsed) {
    sidebar.classList.add('collapsed');
    main?.classList.add('sidebar-collapsed');
  }

  colBtn?.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    main?.classList.toggle('sidebar-collapsed');
    localStorage.setItem('sidebar_collapsed', sidebar.classList.contains('collapsed'));
  });

  // Mobile
  const openMobileSidebar = () => {
    sidebar.classList.add('mobile-open');
    overlay?.classList.add('visible');
    document.body.style.overflow = 'hidden';
  };

  const closeMobileSidebar = () => {
    sidebar.classList.remove('mobile-open');
    overlay?.classList.remove('visible');
    document.body.style.overflow = '';
  };

  menuBtn?.addEventListener('click', openMobileSidebar);
  overlay?.addEventListener('click', closeMobileSidebar);

  // Cerrar sidebar al hacer click en un link (móvil)
  sidebar.querySelectorAll('.sidebar-link').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) closeMobileSidebar();
    });
  });
}

// Marcar link activo en sidebar
function setActiveSidebarLink() {
  const current = window.location.pathname.split('/').pop();
  document.querySelectorAll('.sidebar-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === current) link.classList.add('active');
  });
}

// Inicialización global en cada página protegida
document.addEventListener('DOMContentLoaded', () => {
  Auth.initTopbar();
  initSidebar();
  setActiveSidebarLink();

  // Logout button
  document.getElementById('btn-logout')?.addEventListener('click', async (e) => {
    e.preventDefault();
    await Auth.logout();
  });
});
