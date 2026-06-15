-- ============================================================
-- CRM CAFÉ DE LA ESQUINA — Schema v2.0
-- Compatible con Supabase (PostgreSQL 15+)
-- 6 tablas: users, customers, reservations, orders, incidents, messages
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── ENUMS ──────────────────────────────────────────────────
CREATE TYPE user_role          AS ENUM ('empleado', 'administrador');
CREATE TYPE reservation_status AS ENUM ('pendiente', 'confirmada', 'finalizada', 'cancelada');
CREATE TYPE order_status       AS ENUM ('pendiente', 'en_preparacion', 'listo', 'entregado', 'cancelado');
CREATE TYPE incident_priority  AS ENUM ('baja', 'media', 'alta');
CREATE TYPE incident_status    AS ENUM ('abierta', 'en_proceso', 'resuelta', 'cerrada');
CREATE TYPE message_direction  AS ENUM ('incoming', 'outgoing');

-- ── USERS ──────────────────────────────────────────────────
-- Extiende auth.users de Supabase con datos de perfil
CREATE TABLE users (
    id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name   VARCHAR(255) NOT NULL,
    role        user_role    NOT NULL DEFAULT 'empleado',
    is_active   BOOLEAN      DEFAULT TRUE,
    created_at  TIMESTAMPTZ  DEFAULT NOW(),
    updated_at  TIMESTAMPTZ  DEFAULT NOW()
);

-- ── CUSTOMERS ──────────────────────────────────────────────
CREATE TABLE customers (
    id          UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        VARCHAR(255) NOT NULL,
    surname     VARCHAR(255),
    email       VARCHAR(255) UNIQUE,
    phone       VARCHAR(50),
    birth_date  DATE,
    notes       TEXT,
    created_at  TIMESTAMPTZ  DEFAULT NOW(),
    updated_at  TIMESTAMPTZ  DEFAULT NOW()
);

-- ── RESERVATIONS ───────────────────────────────────────────
CREATE TABLE reservations (
    id               UUID               PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id      UUID               REFERENCES customers(id) ON DELETE SET NULL,
    reservation_date TIMESTAMPTZ        NOT NULL,
    guests           INTEGER            NOT NULL CHECK (guests > 0),
    status           reservation_status DEFAULT 'pendiente',
    notes            TEXT,
    created_by       UUID               REFERENCES users(id) ON DELETE SET NULL,
    created_at       TIMESTAMPTZ        DEFAULT NOW(),
    updated_at       TIMESTAMPTZ        DEFAULT NOW()
);

-- ── ORDERS ─────────────────────────────────────────────────
CREATE TABLE orders (
    id          UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID         REFERENCES customers(id) ON DELETE SET NULL,
    title       VARCHAR(255) NOT NULL,
    description TEXT,
    price       DECIMAL(10,2),
    status      order_status DEFAULT 'pendiente',
    pickup_date TIMESTAMPTZ,
    created_by  UUID         REFERENCES users(id) ON DELETE SET NULL,
    created_at  TIMESTAMPTZ  DEFAULT NOW(),
    updated_at  TIMESTAMPTZ  DEFAULT NOW()
);

-- ── INCIDENTS ──────────────────────────────────────────────
CREATE TABLE incidents (
    id          UUID              PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID              REFERENCES customers(id) ON DELETE SET NULL,
    title       VARCHAR(255)      NOT NULL,
    description TEXT,
    priority    incident_priority DEFAULT 'media',
    status      incident_status   DEFAULT 'abierta',
    resolution  TEXT,
    reported_by UUID              REFERENCES users(id) ON DELETE SET NULL,
    resolved_at TIMESTAMPTZ,
    created_at  TIMESTAMPTZ       DEFAULT NOW(),
    updated_at  TIMESTAMPTZ       DEFAULT NOW()
);

-- ── MESSAGES ───────────────────────────────────────────────
CREATE TABLE messages (
    id          UUID              PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID              NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    message     TEXT              NOT NULL,
    direction   message_direction NOT NULL,
    created_at  TIMESTAMPTZ       DEFAULT NOW()
);

-- ── ÍNDICES ────────────────────────────────────────────────
CREATE INDEX idx_reservations_date     ON reservations(reservation_date);
CREATE INDEX idx_reservations_customer ON reservations(customer_id);
CREATE INDEX idx_reservations_status   ON reservations(status);
CREATE INDEX idx_orders_customer       ON orders(customer_id);
CREATE INDEX idx_orders_status         ON orders(status);
CREATE INDEX idx_orders_pickup         ON orders(pickup_date);
CREATE INDEX idx_incidents_customer    ON incidents(customer_id);
CREATE INDEX idx_incidents_status      ON incidents(status);
CREATE INDEX idx_messages_customer     ON messages(customer_id);
CREATE INDEX idx_messages_created      ON messages(created_at DESC);
CREATE INDEX idx_customers_email       ON customers(email);

-- ── ROW LEVEL SECURITY ─────────────────────────────────────
ALTER TABLE users         ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers     ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations  ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders        ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents     ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages      ENABLE ROW LEVEL SECURITY;

-- Cualquier usuario autenticado puede leer y escribir
-- (el control de roles se maneja a nivel de aplicación)
CREATE POLICY "Usuarios autenticados" ON users
    FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

CREATE POLICY "Usuarios autenticados" ON customers
    FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

CREATE POLICY "Usuarios autenticados" ON reservations
    FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

CREATE POLICY "Usuarios autenticados" ON orders
    FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

CREATE POLICY "Usuarios autenticados" ON incidents
    FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

CREATE POLICY "Usuarios autenticados" ON messages
    FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

-- ── TRIGGERS: updated_at ───────────────────────────────────
CREATE OR REPLACE FUNCTION fn_update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;

CREATE TRIGGER trg_users_upd         BEFORE UPDATE ON users         FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at();
CREATE TRIGGER trg_customers_upd     BEFORE UPDATE ON customers     FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at();
CREATE TRIGGER trg_reservations_upd  BEFORE UPDATE ON reservations  FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at();
CREATE TRIGGER trg_orders_upd        BEFORE UPDATE ON orders        FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at();
CREATE TRIGGER trg_incidents_upd     BEFORE UPDATE ON incidents     FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at();

-- ── VISTA: reservas del día ────────────────────────────────
CREATE OR REPLACE VIEW vw_today_reservations AS
SELECT
    r.id,
    r.reservation_date,
    r.guests,
    r.status,
    r.notes,
    c.id       AS customer_id,
    c.name     AS customer_name,
    c.surname  AS customer_surname,
    c.phone    AS customer_phone,
    c.email    AS customer_email
FROM reservations r
LEFT JOIN customers c ON c.id = r.customer_id
WHERE DATE(r.reservation_date AT TIME ZONE 'America/Argentina/Buenos_Aires') = CURRENT_DATE
  AND r.status NOT IN ('cancelada')
ORDER BY r.reservation_date;

-- ── VISTA: KPIs del dashboard ──────────────────────────────
CREATE OR REPLACE VIEW vw_dashboard_kpis AS
SELECT
    (SELECT COUNT(*) FROM reservations
       WHERE DATE(reservation_date) = CURRENT_DATE
         AND status NOT IN ('cancelada'))         AS reservas_hoy,
    (SELECT COUNT(*) FROM orders
       WHERE status IN ('pendiente', 'en_preparacion')) AS pedidos_pendientes,
    (SELECT COUNT(*) FROM incidents
       WHERE status IN ('abierta', 'en_proceso'))  AS incidencias_abiertas,
    (SELECT COUNT(DISTINCT customer_id) FROM messages
       WHERE direction = 'incoming'
         AND created_at >= NOW() - INTERVAL '24 hours') AS mensajes_pendientes,
    (SELECT COUNT(*) FROM customers)               AS total_clientes;

-- ── INSTRUCCIONES DE CONFIGURACIÓN ────────────────────────
-- 1. Ejecutar este script en el SQL Editor de Supabase
-- 2. En Authentication > Providers, asegurarse de que Email esté habilitado
-- 3. Crear usuarios en Authentication > Users (o vía Auth API)
-- 4. Insertar fila en la tabla `users` con el mismo UUID que el auth.user:
--
--    INSERT INTO users (id, full_name, role)
--    VALUES ('<uuid-del-auth-user>', 'Nombre Completo', 'administrador');
--
-- 5. Actualizar SUPABASE_URL y SUPABASE_ANON_KEY en crm/js/supabase-config.js
