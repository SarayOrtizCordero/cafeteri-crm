# Café de la Esquina — Template Web + CRM

Plantilla completa para una cafetería: sitio web estático de una página + CRM de gestión de restaurante. Todo en HTML, CSS y JavaScript vanilla. Sin build step, sin framework, sin gestor de paquetes.

---

## Contenido del repositorio

```
/
├── index.html              # Sitio web (single-page)
├── css/styles.css          # Estilos del sitio web
├── js/script.js            # Interacciones del sitio web
├── favicon.svg
└── crm/
    ├── index.html          # Login CRM
    ├── dashboard.html
    ├── customers.html
    ├── reservations.html
    ├── orders.html
    ├── incidents.html
    ├── messages.html
    ├── css/crm.css
    ├── js/
    │   ├── api.js          # Capa de datos (Supabase / modo demo)
    │   ├── auth.js         # Autenticación y control de roles
    │   ├── crm-shell.js    # Web Component: sidebar + topbar
    │   ├── data.js         # Datos demo en memoria
    │   ├── utils.js        # Helpers: toasts, formatos, badges
    │   └── pages/          # Un script por página del CRM
    └── sql/schema.sql      # Esquema PostgreSQL para Supabase
```

---

## Sitio web

Single-page con secciones ancladas: hero, nosotros, carta, galería, ubicación y contacto.

- Mobile-first. CSS custom properties, sin clases utilitarias.
- Interacciones: header sticky, hamburger menu, filtro de carta por categoría, lightbox de galería, scroll spy.
- El numero de telefono se centraliza en el atributo `data-phone` del `<body>`. El script lo propaga automáticamente a todos los enlaces `wa.me/` y `tel:`.
- Sin dependencias JavaScript locales. Solo CDN: Google Fonts y Font Awesome 6.4.2.

**Paleta de colores**

| Variable              | Valor     | Uso                        |
|-----------------------|-----------|----------------------------|
| `--clr-primary`       | `#A06A3F` | Caramelo — CTAs y acentos  |
| `--clr-primary-dark`  | `#6F4A2A` | Moca — estados hover       |
| `--clr-dark`          | `#2B2018` | Espresso — textos y header |
| `--clr-bg`            | `#FAF4EC` | Crema latte — fondo        |

**Tipografía**

- Titulares: Playfair Display (`--font-heading`)
- Hero / display: Cormorant Garamond (`--font-display`)
- Cuerpo: Lato (`--font-body`)

---

## CRM

Panel de gestión interna para el equipo del restaurante. Funciona en **modo demo sin conexion** (sin necesidad de Supabase) o conectado a un proyecto Supabase real.

### Módulos

| Módulo        | Descripción                                                       |
|---------------|-------------------------------------------------------------------|
| Dashboard     | Métricas del día: reservas, pedidos, ingresos, clientes nuevos    |
| Clientes      | Directorio con historial de visitas y preferencias                |
| Reservas      | Agenda con estados: pendiente, confirmada, finalizada, cancelada  |
| Pedidos       | Seguimiento de pedidos con estados de preparación                 |
| Incidencias   | Registro de incidentes con prioridad y estado de resolución       |
| Mensajes      | Bandeja de mensajes entrantes y salientes                         |

### Roles y permisos

Jerarquía de menor a mayor acceso: `empleado < recepcionista < gerente < administrador`.

Cada página del CRM llama a `Auth.requireAuth()` o `Auth.requireRole('rol')` al inicio para redirigir usuarios no autorizados antes de renderizar.

### Cuentas demo

| Email                  | Contraseña | Rol              |
|------------------------|------------|------------------|
| admin@demo.com         | demo123    | administrador    |
| gerente@demo.com       | demo123    | gerente          |
| recepcion@demo.com     | demo123    | recepcionista    |
| empleado@demo.com      | demo123    | empleado         |

Las mutaciones en modo demo (crear, editar, eliminar) solo afectan los arrays en memoria de `data.js`. Los cambios se pierden al recargar la página, por diseño.

---

## Ejecutar el proyecto

El sitio web abre directamente en el navegador sin servidor. Para el CRM se recomienda un servidor local para evitar problemas CORS con Supabase:

```bash
# Opción 1
npx serve .

# Opción 2
python -m http.server 8080
```

Luego acceder a `http://localhost:8080`.

---

## Conectar Supabase (produccion)

1. Crear un proyecto en [supabase.com](https://supabase.com).
2. Ejecutar `crm/sql/schema.sql` en el SQL Editor de Supabase.
3. Editar `crm/js/api.js` y reemplazar:

```js
const SUPABASE_URL  = 'https://tu-proyecto.supabase.co';
const SUPABASE_ANON_KEY = 'tu-anon-key';
```

4. Agregar el SDK de Supabase via CDN en cada página del CRM (antes de `api.js`):

```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
```

Al detectar credenciales validas, `DEMO_MODE` se desactiva automaticamente y todas las operaciones pasan a la base de datos real.

---

## Personalizar el sitio

- **Nombre y datos del negocio**: editar el contenido en `index.html` y el JSON-LD de Schema.org en el `<head>`.
- **Telefono**: cambiar el valor de `data-phone` en el `<body>` de `index.html` (formato internacional sin `+`, ej. `5491112345678`).
- **Colores**: modificar las custom properties en `:root` dentro de `css/styles.css`.
- **Carta**: editar las tarjetas dentro de la seccion `#menu` en `index.html`.
- **Galería**: reemplazar las URLs de imagen en la seccion `#gallery`.

---

## Stack

- HTML5, CSS3, JavaScript ES6+ (vanilla)
- Bootstrap 5.3.2 (solo CRM, via CDN)
- Google Fonts, Font Awesome 6.4.2 (via CDN)
- Supabase (opcional, base de datos en produccion)
- Schema.org JSON-LD para SEO estructurado

---

## Licencia

MIT
