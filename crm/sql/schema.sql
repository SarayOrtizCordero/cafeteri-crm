-- ============================================================
-- CRM RESTAURANTE - SCHEMA COMPLETO v1.0
-- Compatible con Supabase (PostgreSQL 15+)
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── ENUMS ──────────────────────────────────────────────────
CREATE TYPE user_role          AS ENUM ('administrador','gerente','recepcionista','empleado');
CREATE TYPE reservation_status AS ENUM ('pendiente','confirmada','sentado','finalizada','cancelada','no_presentado');
CREATE TYPE table_status       AS ENUM ('libre','reservada','ocupada','fuera_de_servicio');
CREATE TYPE table_location     AS ENUM ('interior','terraza','barra','privado');
CREATE TYPE waiting_status     AS ENUM ('esperando','asignado','cancelado');
CREATE TYPE event_status       AS ENUM ('activo','completo','cancelado');
CREATE TYPE loyalty_level      AS ENUM ('bronce','plata','oro','premium');
CREATE TYPE campaign_status    AS ENUM ('borrador','programada','enviada','cancelada');
CREATE TYPE incident_severity  AS ENUM ('baja','media','alta');
CREATE TYPE incident_status    AS ENUM ('abierta','en_proceso','resuelta','cerrada');

-- ── RESTAURANTS (multi-tenant) ─────────────────────────────
CREATE TABLE restaurants (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        VARCHAR(255) NOT NULL,
    address     TEXT,
    phone       VARCHAR(50),
    email       VARCHAR(255),
    timezone    VARCHAR(50)  DEFAULT 'America/Argentina/Buenos_Aires',
    logo_url    TEXT,
    settings    JSONB        DEFAULT '{}',
    created_at  TIMESTAMPTZ  DEFAULT NOW(),
    updated_at  TIMESTAMPTZ  DEFAULT NOW()
);

-- ── USERS ──────────────────────────────────────────────────
CREATE TABLE users (
    id             UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    restaurant_id  UUID         REFERENCES restaurants(id) ON DELETE CASCADE,
    full_name      VARCHAR(255) NOT NULL,
    role           user_role    NOT NULL DEFAULT 'empleado',
    phone          VARCHAR(50),
    avatar_url     TEXT,
    is_active      BOOLEAN      DEFAULT TRUE,
    last_login     TIMESTAMPTZ,
    created_at     TIMESTAMPTZ  DEFAULT NOW(),
    updated_at     TIMESTAMPTZ  DEFAULT NOW()
);

-- ── CUSTOMERS ──────────────────────────────────────────────
CREATE TABLE customers (
    id                  UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id       UUID         NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    name                VARCHAR(255) NOT NULL,
    surname             VARCHAR(255),
    email               VARCHAR(255),
    phone               VARCHAR(50),
    birth_date          DATE,
    notes               TEXT,
    vip_status          BOOLEAN      DEFAULT FALSE,
    allergies           TEXT[]       DEFAULT '{}',
    dietary_preferences TEXT[]       DEFAULT '{}',
    favorite_table      VARCHAR(50),
    favorite_wine       TEXT,
    visit_frequency     VARCHAR(50),
    total_visits        INTEGER      DEFAULT 0,
    average_ticket      DECIMAL(10,2) DEFAULT 0,
    last_visit          TIMESTAMPTZ,
    created_at          TIMESTAMPTZ  DEFAULT NOW(),
    updated_at          TIMESTAMPTZ  DEFAULT NOW(),
    UNIQUE(restaurant_id, email)
);

-- ── TABLES ─────────────────────────────────────────────────
CREATE TABLE tables (
    id            UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID          NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    table_number  VARCHAR(20)   NOT NULL,
    capacity      INTEGER       NOT NULL,
    location      table_location DEFAULT 'interior',
    status        table_status   DEFAULT 'libre',
    position_x    INTEGER        DEFAULT 0,
    position_y    INTEGER        DEFAULT 0,
    shape         VARCHAR(20)    DEFAULT 'square',
    notes         TEXT,
    created_at    TIMESTAMPTZ    DEFAULT NOW(),
    UNIQUE(restaurant_id, table_number)
);

-- ── RESERVATIONS ───────────────────────────────────────────
CREATE TABLE reservations (
    id                 UUID               PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id      UUID               NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    customer_id        UUID               REFERENCES customers(id) ON DELETE SET NULL,
    table_id           UUID               REFERENCES tables(id) ON DELETE SET NULL,
    reservation_date   TIMESTAMPTZ        NOT NULL,
    duration_minutes   INTEGER            DEFAULT 90,
    guests             INTEGER            NOT NULL,
    status             reservation_status DEFAULT 'pendiente',
    notes              TEXT,
    source             VARCHAR(50)        DEFAULT 'manual',
    confirmation_sent  BOOLEAN            DEFAULT FALSE,
    reminder_sent      BOOLEAN            DEFAULT FALSE,
    created_by         UUID               REFERENCES users(id),
    created_at         TIMESTAMPTZ        DEFAULT NOW(),
    updated_at         TIMESTAMPTZ        DEFAULT NOW()
);

-- ── WAITING LIST ───────────────────────────────────────────
CREATE TABLE waiting_list (
    id                UUID           PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id     UUID           NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    customer_id       UUID           REFERENCES customers(id) ON DELETE SET NULL,
    party_size        INTEGER        NOT NULL,
    arrival_time      TIMESTAMPTZ    DEFAULT NOW(),
    status            waiting_status DEFAULT 'esperando',
    notes             TEXT,
    assigned_table_id UUID           REFERENCES tables(id),
    assigned_at       TIMESTAMPTZ,
    created_at        TIMESTAMPTZ    DEFAULT NOW()
);

-- ── EVENTS ─────────────────────────────────────────────────
CREATE TABLE events (
    id                 UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id      UUID         NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    title              VARCHAR(255) NOT NULL,
    description        TEXT,
    event_date         TIMESTAMPTZ  NOT NULL,
    end_date           TIMESTAMPTZ,
    capacity           INTEGER,
    current_attendees  INTEGER      DEFAULT 0,
    price              DECIMAL(10,2),
    status             event_status DEFAULT 'activo',
    image_url          TEXT,
    created_at         TIMESTAMPTZ  DEFAULT NOW(),
    updated_at         TIMESTAMPTZ  DEFAULT NOW()
);

-- ── LOYALTY POINTS ─────────────────────────────────────────
CREATE TABLE loyalty_points (
    id              UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id   UUID          NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    customer_id     UUID          NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    points          INTEGER       DEFAULT 0,
    level           loyalty_level DEFAULT 'bronce',
    total_earned    INTEGER       DEFAULT 0,
    total_redeemed  INTEGER       DEFAULT 0,
    created_at      TIMESTAMPTZ   DEFAULT NOW(),
    updated_at      TIMESTAMPTZ   DEFAULT NOW(),
    UNIQUE(restaurant_id, customer_id)
);

-- ── LOYALTY TRANSACTIONS ───────────────────────────────────
CREATE TABLE loyalty_transactions (
    id              UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    loyalty_id      UUID        NOT NULL REFERENCES loyalty_points(id) ON DELETE CASCADE,
    type            VARCHAR(20) NOT NULL, -- earn | redeem | adjust
    points          INTEGER     NOT NULL,
    description     TEXT,
    reservation_id  UUID        REFERENCES reservations(id),
    created_by      UUID        REFERENCES users(id),
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── PROMOTIONS ─────────────────────────────────────────────
CREATE TABLE promotions (
    id             UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id  UUID          NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    title          VARCHAR(255)  NOT NULL,
    description    TEXT,
    discount_type  VARCHAR(20)   DEFAULT 'percentage',
    discount_value DECIMAL(10,2) NOT NULL,
    code           VARCHAR(50),
    start_date     DATE          NOT NULL,
    end_date       DATE          NOT NULL,
    usage_limit    INTEGER,
    usage_count    INTEGER       DEFAULT 0,
    min_guests     INTEGER       DEFAULT 1,
    is_active      BOOLEAN       DEFAULT TRUE,
    created_at     TIMESTAMPTZ   DEFAULT NOW(),
    updated_at     TIMESTAMPTZ   DEFAULT NOW()
);

-- ── EMAIL CAMPAIGNS ────────────────────────────────────────
CREATE TABLE email_campaigns (
    id               UUID             PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id    UUID             NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    title            VARCHAR(255)     NOT NULL,
    subject          VARCHAR(255)     NOT NULL,
    content          TEXT             NOT NULL,
    template         VARCHAR(50)      DEFAULT 'general',
    segment          JSONB            DEFAULT '{}',
    recipient_count  INTEGER          DEFAULT 0,
    status           campaign_status  DEFAULT 'borrador',
    scheduled_at     TIMESTAMPTZ,
    sent_at          TIMESTAMPTZ,
    open_rate        DECIMAL(5,2)     DEFAULT 0,
    click_rate       DECIMAL(5,2)     DEFAULT 0,
    created_by       UUID             REFERENCES users(id),
    created_at       TIMESTAMPTZ      DEFAULT NOW(),
    updated_at       TIMESTAMPTZ      DEFAULT NOW()
);

-- ── REVIEWS ────────────────────────────────────────────────
CREATE TABLE reviews (
    id               UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id    UUID        NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    customer_id      UUID        REFERENCES customers(id) ON DELETE SET NULL,
    reservation_id   UUID        REFERENCES reservations(id) ON DELETE SET NULL,
    rating           INTEGER     NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment          TEXT,
    food_rating      INTEGER     CHECK (food_rating BETWEEN 1 AND 5),
    service_rating   INTEGER     CHECK (service_rating BETWEEN 1 AND 5),
    ambiance_rating  INTEGER     CHECK (ambiance_rating BETWEEN 1 AND 5),
    response         TEXT,
    responded_at     TIMESTAMPTZ,
    responded_by     UUID        REFERENCES users(id),
    source           VARCHAR(50) DEFAULT 'internal',
    created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ── INCIDENTS ──────────────────────────────────────────────
CREATE TABLE incidents (
    id             UUID              PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id  UUID              NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    reservation_id UUID              REFERENCES reservations(id) ON DELETE SET NULL,
    reported_by    UUID              REFERENCES users(id),
    description    TEXT              NOT NULL,
    severity       incident_severity DEFAULT 'baja',
    status         incident_status   DEFAULT 'abierta',
    resolution     TEXT,
    resolved_by    UUID              REFERENCES users(id),
    resolved_at    TIMESTAMPTZ,
    created_at     TIMESTAMPTZ       DEFAULT NOW(),
    updated_at     TIMESTAMPTZ       DEFAULT NOW()
);

-- ── AUDIT LOGS ─────────────────────────────────────────────
CREATE TABLE audit_logs (
    id             UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id  UUID        NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    user_id        UUID        REFERENCES users(id) ON DELETE SET NULL,
    action         VARCHAR(100) NOT NULL,
    table_name     VARCHAR(100),
    record_id      UUID,
    old_data       JSONB,
    new_data       JSONB,
    ip_address     INET,
    created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ── SETTINGS ───────────────────────────────────────────────
CREATE TABLE settings (
    id             UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id  UUID        NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    key            VARCHAR(100) NOT NULL,
    value          JSONB,
    created_at     TIMESTAMPTZ DEFAULT NOW(),
    updated_at     TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(restaurant_id, key)
);

-- ── ÍNDICES ────────────────────────────────────────────────
CREATE INDEX idx_customers_restaurant   ON customers(restaurant_id);
CREATE INDEX idx_customers_email        ON customers(email);
CREATE INDEX idx_customers_vip          ON customers(vip_status) WHERE vip_status = TRUE;
CREATE INDEX idx_reservations_restaurant ON reservations(restaurant_id);
CREATE INDEX idx_reservations_date      ON reservations(reservation_date);
CREATE INDEX idx_reservations_customer  ON reservations(customer_id);
CREATE INDEX idx_reservations_status    ON reservations(status);
CREATE INDEX idx_tables_restaurant      ON tables(restaurant_id);
CREATE INDEX idx_tables_status          ON tables(status);
CREATE INDEX idx_loyalty_customer       ON loyalty_points(customer_id);
CREATE INDEX idx_audit_restaurant       ON audit_logs(restaurant_id);
CREATE INDEX idx_audit_created          ON audit_logs(created_at DESC);

-- ── ROW LEVEL SECURITY ─────────────────────────────────────
ALTER TABLE customers       ENABLE ROW LEVEL SECURITY;
ALTER TABLE tables          ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations    ENABLE ROW LEVEL SECURITY;
ALTER TABLE waiting_list    ENABLE ROW LEVEL SECURITY;
ALTER TABLE events          ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_points  ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions      ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews         ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents       ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs      ENABLE ROW LEVEL SECURITY;

-- Helper para obtener restaurant_id del usuario autenticado
CREATE OR REPLACE FUNCTION get_user_restaurant_id()
RETURNS UUID AS $$
    SELECT restaurant_id FROM users WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Política base: cada tabla solo devuelve datos del restaurante del usuario
CREATE POLICY rls_customers       ON customers       FOR ALL USING (restaurant_id = get_user_restaurant_id());
CREATE POLICY rls_tables          ON tables          FOR ALL USING (restaurant_id = get_user_restaurant_id());
CREATE POLICY rls_reservations    ON reservations    FOR ALL USING (restaurant_id = get_user_restaurant_id());
CREATE POLICY rls_waiting_list    ON waiting_list    FOR ALL USING (restaurant_id = get_user_restaurant_id());
CREATE POLICY rls_events          ON events          FOR ALL USING (restaurant_id = get_user_restaurant_id());
CREATE POLICY rls_loyalty_points  ON loyalty_points  FOR ALL USING (restaurant_id = get_user_restaurant_id());
CREATE POLICY rls_promotions      ON promotions      FOR ALL USING (restaurant_id = get_user_restaurant_id());
CREATE POLICY rls_email_campaigns ON email_campaigns FOR ALL USING (restaurant_id = get_user_restaurant_id());
CREATE POLICY rls_reviews         ON reviews         FOR ALL USING (restaurant_id = get_user_restaurant_id());
CREATE POLICY rls_incidents       ON incidents       FOR ALL USING (restaurant_id = get_user_restaurant_id());
CREATE POLICY rls_audit_logs      ON audit_logs      FOR ALL USING (restaurant_id = get_user_restaurant_id());

-- ── TRIGGERS: updated_at ───────────────────────────────────
CREATE OR REPLACE FUNCTION fn_update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;

CREATE TRIGGER trg_customers_upd    BEFORE UPDATE ON customers       FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at();
CREATE TRIGGER trg_reservations_upd BEFORE UPDATE ON reservations    FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at();
CREATE TRIGGER trg_tables_upd       BEFORE UPDATE ON tables          FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at();
CREATE TRIGGER trg_events_upd       BEFORE UPDATE ON events          FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at();
CREATE TRIGGER trg_loyalty_upd      BEFORE UPDATE ON loyalty_points  FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at();
CREATE TRIGGER trg_promotions_upd   BEFORE UPDATE ON promotions      FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at();
CREATE TRIGGER trg_campaigns_upd    BEFORE UPDATE ON email_campaigns FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at();
CREATE TRIGGER trg_incidents_upd    BEFORE UPDATE ON incidents       FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at();

-- ── FUNCIÓN: nivel de fidelización ─────────────────────────
CREATE OR REPLACE FUNCTION fn_loyalty_level(p_points INTEGER)
RETURNS loyalty_level LANGUAGE plpgsql AS $$
BEGIN
    IF p_points >= 1000 THEN RETURN 'premium';
    ELSIF p_points >= 500 THEN RETURN 'oro';
    ELSIF p_points >= 200 THEN RETURN 'plata';
    ELSE RETURN 'bronce'; END IF;
END;
$$;

-- ── TRIGGER: sincronizar nivel de fidelización ─────────────
CREATE OR REPLACE FUNCTION fn_sync_loyalty_level()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    NEW.level = fn_loyalty_level(NEW.points);
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_loyalty_level
    BEFORE INSERT OR UPDATE ON loyalty_points
    FOR EACH ROW EXECUTE FUNCTION fn_sync_loyalty_level();

-- ── TRIGGER: actualizar estadísticas del cliente ───────────
CREATE OR REPLACE FUNCTION fn_update_customer_stats()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    IF NEW.status = 'finalizada' AND OLD.status != 'finalizada' THEN
        UPDATE customers
           SET total_visits = total_visits + 1,
               last_visit   = NOW()
         WHERE id = NEW.customer_id;
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_customer_stats
    AFTER UPDATE ON reservations
    FOR EACH ROW EXECUTE FUNCTION fn_update_customer_stats();

-- ── VISTA: reservas del día con datos del cliente ──────────
CREATE OR REPLACE VIEW vw_today_reservations AS
SELECT
    r.id,
    r.reservation_date,
    r.guests,
    r.status,
    r.notes,
    r.table_id,
    t.table_number,
    t.location,
    c.id          AS customer_id,
    c.name        AS customer_name,
    c.surname     AS customer_surname,
    c.phone       AS customer_phone,
    c.vip_status,
    lp.level      AS loyalty_level
FROM reservations r
LEFT JOIN customers c  ON c.id = r.customer_id
LEFT JOIN tables    t  ON t.id = r.table_id
LEFT JOIN loyalty_points lp ON lp.customer_id = c.id
WHERE DATE(r.reservation_date AT TIME ZONE 'America/Argentina/Buenos_Aires') = CURRENT_DATE
  AND r.restaurant_id = get_user_restaurant_id()
ORDER BY r.reservation_date;

-- ── VISTA: KPIs generales ──────────────────────────────────
CREATE OR REPLACE VIEW vw_kpis AS
SELECT
    (SELECT COUNT(*) FROM reservations WHERE restaurant_id = get_user_restaurant_id()
       AND DATE(reservation_date) = CURRENT_DATE AND status NOT IN ('cancelada','no_presentado'))
       AS today_reservations,
    (SELECT COUNT(*) FROM tables WHERE restaurant_id = get_user_restaurant_id() AND status = 'libre')
       AS free_tables,
    (SELECT COUNT(*) FROM tables WHERE restaurant_id = get_user_restaurant_id() AND status = 'ocupada')
       AS occupied_tables,
    (SELECT COUNT(*) FROM customers WHERE restaurant_id = get_user_restaurant_id()
       AND created_at >= NOW() - INTERVAL '7 days')
       AS new_customers_week,
    (SELECT COUNT(*) FROM waiting_list WHERE restaurant_id = get_user_restaurant_id() AND status = 'esperando')
       AS waiting_now;
