/* ============================================================
   CRM-SHELL.JS — Web Component: sidebar + topbar del CRM
   Uso en cada página protegida:

     <crm-shell page-title="Reservas">
       <div slot="topbar-actions">
         <button id="btn-new">...</button>
       </div>
       <main class="crm-content">...</main>
     </crm-shell>

   El componente usa light DOM (sin shadow DOM) para que:
   - crm.css aplique sin restriction
   - auth.js pueda acceder a #sidebar-avatar, #btn-logout, etc.
   - initSidebar() encuentre .crm-sidebar y .crm-main

   Orden de carga requerido en cada página:
     data.js → api.js → auth.js → utils.js → crm-shell.js → [page script]
   ============================================================ */

class CrmShell extends HTMLElement {
  connectedCallback() {
    const pageTitle = this.getAttribute('page-title') || '';

    // Extraer el slot de acciones antes de tocar innerHTML
    const actionsEl   = this.querySelector('[slot="topbar-actions"]');
    const actionsHTML = actionsEl ? actionsEl.innerHTML : '';

    // Recopilar nodos de contenido (todo excepto el slot de acciones)
    const contentEls = [...this.children].filter(
      el => el.getAttribute('slot') !== 'topbar-actions'
    );
    const contentFragment = document.createDocumentFragment();
    contentEls.forEach(el => contentFragment.appendChild(el.cloneNode(true)));

    // Inyectar la estructura completa del shell
    this.innerHTML = `
      <div class="crm-wrapper">

        <!-- SIDEBAR -->
        <aside class="crm-sidebar" id="crm-sidebar">
          <a href="dashboard.html" class="sidebar-brand">
            <div class="sidebar-brand-icon"><i class="fas fa-mug-hot"></i></div>
            <div class="sidebar-brand-text">Café de la Esquina<small>Panel de gestión</small></div>
          </a>
          <nav class="sidebar-nav">
            <a href="dashboard.html"   class="sidebar-link"><i class="sidebar-link-icon fas fa-tachometer-alt"></i><span class="sidebar-link-text">Dashboard</span></a>
            <a href="customers.html"   class="sidebar-link"><i class="sidebar-link-icon fas fa-users"></i><span class="sidebar-link-text">Clientes</span></a>
            <a href="reservations.html"class="sidebar-link"><i class="sidebar-link-icon fas fa-calendar-check"></i><span class="sidebar-link-text">Reservas</span></a>
            <a href="orders.html"      class="sidebar-link"><i class="sidebar-link-icon fas fa-box-open"></i><span class="sidebar-link-text">Pedidos</span></a>
            <a href="incidents.html"   class="sidebar-link"><i class="sidebar-link-icon fas fa-exclamation-triangle"></i><span class="sidebar-link-text">Incidencias</span></a>
            <a href="messages.html"    class="sidebar-link"><i class="sidebar-link-icon fas fa-comments"></i><span class="sidebar-link-text">Mensajes</span></a>
            <div class="sidebar-divider"></div>
            <a href="../index.html"    class="sidebar-link sidebar-link--muted"><i class="sidebar-link-icon fas fa-globe"></i><span class="sidebar-link-text">Ver sitio web</span></a>
          </nav>
          <div class="sidebar-footer">
            <div class="d-flex align-items-center gap-2">
              <div class="sidebar-user sidebar-user-footer">
                <div class="sidebar-avatar" id="sidebar-avatar">CA</div>
                <div class="sidebar-user-info">
                  <div class="sidebar-user-name" id="sidebar-user-name">Cargando…</div>
                  <div class="sidebar-user-role" id="sidebar-user-role">—</div>
                </div>
              </div>
              <button type="button" class="sidebar-collapse-btn" id="sidebar-collapse-btn" title="Colapsar menú" aria-label="Colapsar menú">
                <i class="fas fa-chevron-left"></i>
              </button>
            </div>
          </div>
        </aside>
        <div id="sidebar-overlay" class="sidebar-overlay"></div>

        <!-- MAIN -->
        <div class="crm-main" id="crm-main">

          <!-- TOPBAR -->
          <header class="crm-topbar">
            <button type="button" class="topbar-menu-btn" id="topbar-menu-btn" aria-label="Abrir menú">
              <i class="fas fa-bars"></i>
            </button>
            <div class="topbar-breadcrumb">
              <span class="topbar-breadcrumb-item">CRM</span>
              <span class="topbar-breadcrumb-sep">/</span>
              <span class="topbar-breadcrumb-current">${pageTitle}</span>
            </div>
            <div class="topbar-spacer"></div>
            <div class="topbar-actions">
              ${actionsHTML}
              <div class="topbar-user">
                <div class="topbar-avatar" id="topbar-avatar">CA</div>
                <span class="topbar-user-name" id="topbar-user-name">Usuario</span>
              </div>
              <button type="button" class="btn-crm btn-crm-secondary btn-crm-sm" id="btn-logout" title="Cerrar sesión" aria-label="Cerrar sesión">
                <i class="fas fa-sign-out-alt"></i>
              </button>
            </div>
          </header>

        </div><!-- /crm-main -->
      </div><!-- /crm-wrapper -->`;

    // Mover el contenido de la página dentro de crm-main
    const crmMain = this.querySelector('#crm-main');
    if (crmMain) crmMain.appendChild(contentFragment);
  }
}

customElements.define('crm-shell', CrmShell);
