-- ============================================================================
-- Meal Train SA — Initial Schema
-- Migration: 0001_initial_schema
-- Description: Core tables, enums, RLS policies, and audit logging fpedaphehieldlfimhyp
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
CREATE TYPE user_role AS ENUM (
  'organizer',
  'volunteer',
  'referrer',   -- future: hospital social workers
  'admin'
);

CREATE TYPE org_type AS ENUM (
  'individual',
  'church',
  'ngo',
  'school',
  'hospital',
  'clinic',
  'hospice'
);

CREATE TYPE train_status AS ENUM (
  'active',
  'completed',
  'cancelled'
);

CREATE TYPE meal_type AS ENUM (
  'breakfast',
  'lunch',
  'dinner'
);

CREATE TYPE slot_type AS ENUM (
  'meal',
  'transport',      -- future: rides to appointments
  'companionship',  -- future: wellness visits
  'errand',         -- future: shopping, pharmacy
  'custom'
);

CREATE TYPE slot_status AS ENUM (
  'open',
  'claimed',
  'delivered',
  'cancelled'
);

CREATE TYPE notification_channel AS ENUM (
  'whatsapp',
  'sms',
  'email',
  'push'
);

CREATE TYPE notification_status AS ENUM (
  'pending',
  'sent',
  'failed'
);

-- ---------------------------------------------------------------------------
-- updated_at trigger function
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ---------------------------------------------------------------------------
-- organizations
-- Future-proofing for #3 (healthcare referrals) and B2B tenants.
-- In v1, all users belong to a default "individual" org (or NULL).
-- ---------------------------------------------------------------------------
CREATE TABLE organizations (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL,
  type         org_type NOT NULL DEFAULT 'individual',
  contact_email TEXT,
  contact_phone TEXT,
  address      TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER organizations_set_updated_at
  BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------------------
-- users
-- One row per organizer. Volunteers do NOT have accounts in v1.
-- ---------------------------------------------------------------------------
CREATE TABLE users (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  phone           TEXT UNIQUE NOT NULL,
  name            TEXT NOT NULL,
  role            user_role NOT NULL DEFAULT 'organizer',
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_organization ON users(organization_id);

CREATE TRIGGER users_set_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------------------
-- meal_trains
-- The core entity. One per "someone needs support" event.
-- ---------------------------------------------------------------------------
CREATE TABLE meal_trains (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  organization_id   UUID REFERENCES organizations(id) ON DELETE SET NULL,

  -- Recipient info (minimal, by design)
  recipient_name    TEXT NOT NULL,
  recipient_note    TEXT,

  -- Delivery info
  delivery_address  TEXT NOT NULL,
  dietary_notes     TEXT,

  -- Schedule
  start_date        DATE NOT NULL,
  end_date          DATE NOT NULL,

  -- Access
  share_token       TEXT UNIQUE NOT NULL,
  share_token_expires_at TIMESTAMPTZ,

  -- Status
  status            train_status NOT NULL DEFAULT 'active',

  -- Future: healthcare referral fields
  referral_source   TEXT,
  referral_notes    TEXT,

  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT valid_date_range CHECK (end_date >= start_date)
);

CREATE INDEX idx_meal_trains_organizer ON meal_trains(organizer_id);
CREATE INDEX idx_meal_trains_token ON meal_trains(share_token);
CREATE INDEX idx_meal_trains_status ON meal_trains(status);
CREATE INDEX idx_meal_trains_dates ON meal_trains(start_date, end_date);

CREATE TRIGGER meal_trains_set_updated_at
  BEFORE UPDATE ON meal_trains
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------------------
-- meal_slots
-- One row per meal (or service) per day. Volunteers claim these.
-- ---------------------------------------------------------------------------
CREATE TABLE meal_slots (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_train_id     UUID NOT NULL REFERENCES meal_trains(id) ON DELETE CASCADE,

  -- What and when
  date              DATE NOT NULL,
  meal_type         meal_type NOT NULL,
  slot_type         slot_type NOT NULL DEFAULT 'meal',

  -- Volunteer info (no account required)
  claimed_by_name   TEXT,
  claimed_by_phone  TEXT,
  volunteer_note    TEXT,
  claimed_at        TIMESTAMPTZ,

  -- Future: for referrer-assigned slots
  claimed_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,

  -- Status
  status            slot_status NOT NULL DEFAULT 'open',
  delivered_at      TIMESTAMPTZ,

  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- One slot per meal type per day per train
  CONSTRAINT unique_slot_per_day UNIQUE (meal_train_id, date, meal_type, slot_type)
);

CREATE INDEX idx_meal_slots_train ON meal_slots(meal_train_id);
CREATE INDEX idx_meal_slots_status ON meal_slots(status);
CREATE INDEX idx_meal_slots_date ON meal_slots(date);
CREATE INDEX idx_meal_slots_phone ON meal_slots(claimed_by_phone);

CREATE TRIGGER meal_slots_set_updated_at
  BEFORE UPDATE ON meal_slots
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------------------
-- audit_log
-- Every state-changing action. Hospitals will require this in #3.
-- ---------------------------------------------------------------------------
CREATE TABLE audit_log (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id     UUID REFERENCES users(id) ON DELETE SET NULL,
  actor_phone  TEXT,
  action       TEXT NOT NULL,           -- 'create', 'update', 'delete', 'claim', etc.
  entity_type  TEXT NOT NULL,           -- 'meal_train', 'meal_slot', 'user'
  entity_id    UUID,
  metadata     JSONB DEFAULT '{}'::jsonb,
  ip_address   INET,
  user_agent   TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_log_actor ON audit_log(actor_id);
CREATE INDEX idx_audit_log_entity ON audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_log_created ON audit_log(created_at DESC);

-- ---------------------------------------------------------------------------
-- notifications
-- Track every reminder/notification sent. Audit trail for POPIA.
-- ---------------------------------------------------------------------------
CREATE TABLE notifications (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_phone TEXT NOT NULL,
  channel         notification_channel NOT NULL DEFAULT 'whatsapp',
  template        TEXT NOT NULL,
  payload         JSONB DEFAULT '{}'::jsonb,
  meal_slot_id    UUID REFERENCES meal_slots(id) ON DELETE CASCADE,
  meal_train_id   UUID REFERENCES meal_trains(id) ON DELETE CASCADE,
  status          notification_status NOT NULL DEFAULT 'pending',
  scheduled_for   TIMESTAMPTZ,
  sent_at         TIMESTAMPTZ,
  error_message   TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_status ON notifications(status);
CREATE INDEX idx_notifications_scheduled ON notifications(scheduled_for) WHERE status = 'pending';
CREATE INDEX idx_notifications_slot ON notifications(meal_slot_id);

-- ---------------------------------------------------------------------------
-- Audit trigger helper
-- Logs INSERT/UPDATE/DELETE on tracked tables automatically.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION log_audit()
RETURNS TRIGGER AS $$
DECLARE
  v_actor_id UUID;
  v_action TEXT;
  v_entity_type TEXT;
  v_entity_id UUID;
  v_metadata JSONB;
BEGIN
  -- Determine actor (from auth context if available)
  v_actor_id := NULLIF(current_setting('request.jwt.claims', true)::jsonb->>'sub', '')::uuid;

  v_action := LOWER(TG_OP);
  v_entity_type := TG_TABLE_NAME;

  IF TG_OP = 'DELETE' THEN
    v_entity_id := OLD.id;
    v_metadata := jsonb_build_object('old', row_to_json(OLD));
  ELSIF TG_OP = 'UPDATE' THEN
    v_entity_id := NEW.id;
    v_metadata := jsonb_build_object('old', row_to_json(OLD), 'new', row_to_json(NEW));
  ELSE
    v_entity_id := NEW.id;
    v_metadata := jsonb_build_object('new', row_to_json(NEW));
  END IF;

  INSERT INTO audit_log (actor_id, action, entity_type, entity_id, metadata)
  VALUES (v_actor_id, v_action, v_entity_type, v_entity_id, v_metadata);

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach audit trigger to tracked tables
CREATE TRIGGER audit_meal_trains
  AFTER INSERT OR UPDATE OR DELETE ON meal_trains
  FOR EACH ROW EXECUTE FUNCTION log_audit();

CREATE TRIGGER audit_meal_slots
  AFTER INSERT OR UPDATE OR DELETE ON meal_slots
  FOR EACH ROW EXECUTE FUNCTION log_audit();

-- ---------------------------------------------------------------------------
-- ROW LEVEL SECURITY
-- ---------------------------------------------------------------------------

-- organizations
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own organization"
  ON organizations FOR SELECT
  USING (
    id IN (SELECT organization_id FROM users WHERE id = auth.uid())
  );

-- users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- meal_trains
ALTER TABLE meal_trains ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Organizers can view own trains"
  ON meal_trains FOR SELECT
  USING (auth.uid() = organizer_id);

CREATE POLICY "Organizers can create trains"
  ON meal_trains FOR INSERT
  WITH CHECK (auth.uid() = organizer_id);

CREATE POLICY "Organizers can update own trains"
  ON meal_trains FOR UPDATE
  USING (auth.uid() = organizer_id);

CREATE POLICY "Organizers can delete own trains"
  ON meal_trains FOR DELETE
  USING (auth.uid() = organizer_id);

-- meal_slots
ALTER TABLE meal_slots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Organizers can view slots of their trains"
  ON meal_slots FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM meal_trains
      WHERE meal_trains.id = meal_slots.meal_train_id
        AND meal_trains.organizer_id = auth.uid()
    )
  );

-- NOTE: Anonymous volunteers access slots via API routes using the service role.
-- Direct anon access to meal_slots is intentionally blocked.

-- audit_log
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
-- No policies — only service role can read/write. Clients cannot access directly.

-- notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
-- No policies — only service role. Clients cannot access directly.

-- ---------------------------------------------------------------------------
-- DONE
-- ---------------------------------------------------------------------------