-- =============================================================================
-- EasyXerox Kiosk Appliance — Phase 2 Database Migration
-- Run once on your PostgreSQL database to add heartbeat + telemetry columns
-- =============================================================================

-- 1. Add last_heartbeat_at column to machines table
ALTER TABLE machines
  ADD COLUMN IF NOT EXISTS last_heartbeat_at TIMESTAMPTZ;

-- 2. Add printer_status column (if not already present)
ALTER TABLE machines
  ADD COLUMN IF NOT EXISTS printer_status VARCHAR(64) DEFAULT 'ready';

-- 3. Add mac_address column for hardware fingerprinting
ALTER TABLE machines
  ADD COLUMN IF NOT EXISTS mac_address VARCHAR(64);

-- 4. Add device_token column for kiosk auth
ALTER TABLE machines
  ADD COLUMN IF NOT EXISTS device_token TEXT;

-- 5. Create machine_telemetry table for historical telemetry logging
CREATE TABLE IF NOT EXISTS machine_telemetry (
  id              BIGSERIAL PRIMARY KEY,
  machine_code    VARCHAR(100) NOT NULL,
  cpu_percent     REAL,
  ram_percent     REAL,
  disk_percent    REAL,
  temp_c          REAL,
  uptime_seconds  INTEGER,
  paper_level     VARCHAR(20),
  toner_level     VARCHAR(20),
  printer_status  VARCHAR(64),
  recorded_at     TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast dashboard queries
CREATE INDEX IF NOT EXISTS idx_telemetry_machine_code
  ON machine_telemetry (machine_code, recorded_at DESC);

-- 6. Auto-purge telemetry older than 30 days (keeps DB lean)
-- Optional: run via pg_cron or a cron job
-- DELETE FROM machine_telemetry WHERE recorded_at < NOW() - INTERVAL '30 days';

COMMENT ON TABLE machine_telemetry IS
  'Live telemetry snapshots from each EasyXerox kiosk appliance (heartbeat every 30 seconds)';

-- Done
SELECT 'Phase 2 migration applied successfully.' AS status;
