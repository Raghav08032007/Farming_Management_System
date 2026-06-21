-- ============================================================
--  SMART FARMING SYSTEM — MySQL Schema
--  Run this once to create all tables
-- ============================================================

CREATE DATABASE IF NOT EXISTS smart_farm;
USE smart_farm;

-- ── FARMERS ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS farmers (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  phone      VARCHAR(15)  UNIQUE NOT NULL,
  email      VARCHAR(100),
  district   VARCHAR(80),
  state      VARCHAR(60)  DEFAULT 'Tamil Nadu',
  created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- ── FARMS ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS farms (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  name      VARCHAR(100) NOT NULL,
  location  VARCHAR(150),
  area      DECIMAL(10,2),
  soil_type ENUM('Black','Red','Loamy','Sandy','Clay','Silt') DEFAULT 'Loamy',
  farmer_id INT NOT NULL,
  FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE
);

-- ── FIELDS ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS fields (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  name            VARCHAR(80) NOT NULL,
  area            DECIMAL(8,2),
  irrigation_type ENUM('Drip','Sprinkler','Flood','Manual','Rainfed') DEFAULT 'Drip',
  current_crop    VARCHAR(80),
  farm_id         INT NOT NULL,
  FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE CASCADE
);

-- ── CROPS ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS crops (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  name      VARCHAR(100) NOT NULL,
  stage     ENUM('Seedling','Vegetative','Flowering','Fruiting','Ripening','Ready to Harvest') DEFAULT 'Seedling',
  sow_date  DATE,
  harvest   DATE,
  yield_kg  DECIMAL(10,2),
  status    ENUM('Active','Harvested','Failed') DEFAULT 'Active',
  field_id  INT NOT NULL,
  FOREIGN KEY (field_id) REFERENCES fields(id) ON DELETE CASCADE
);

-- ── SENSORS ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sensors (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  type        VARCHAR(60) NOT NULL,
  value       DECIMAL(10,3),
  unit        VARCHAR(20),
  status      ENUM('normal','alert','offline') DEFAULT 'normal',
  field_id    INT NOT NULL,
  last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (field_id) REFERENCES fields(id) ON DELETE CASCADE
);

-- ── IRRIGATIONS ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS irrigations (
  id       INT AUTO_INCREMENT PRIMARY KEY,
  field    VARCHAR(80),
  date     DATE NOT NULL,
  time     TIME,
  duration INT,
  method   ENUM('Drip','Sprinkler','Flood','Manual') DEFAULT 'Drip',
  status   ENUM('Scheduled','Completed','Cancelled') DEFAULT 'Scheduled'
);

-- ── LIVESTOCK ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS livestock (
  id      INT AUTO_INCREMENT PRIMARY KEY,
  tag     VARCHAR(30) UNIQUE NOT NULL,
  species ENUM('Cow','Buffalo','Goat','Sheep','Pig','Poultry') DEFAULT 'Cow',
  breed   VARCHAR(80),
  age     VARCHAR(20),
  gender  ENUM('Male','Female') DEFAULT 'Female',
  weight  DECIMAL(7,2),
  status  ENUM('Healthy','Under Treatment','Deceased') DEFAULT 'Healthy',
  milk    DECIMAL(6,2) DEFAULT 0,
  farm_id INT,
  FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE SET NULL
);

-- ── MARKET PRICES ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS market_prices (
  id      INT AUTO_INCREMENT PRIMARY KEY,
  crop    VARCHAR(80) NOT NULL,
  price   DECIMAL(8,2) NOT NULL,
  `change` DECIMAL(6,2) DEFAULT 0,
  market  VARCHAR(100),
  trend   ENUM('up','down','stable') DEFAULT 'stable',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ── SALES ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sales (
  id    INT AUTO_INCREMENT PRIMARY KEY,
  crop  VARCHAR(80),
  qty   DECIMAL(10,2),
  price DECIMAL(8,2),
  total DECIMAL(12,2) GENERATED ALWAYS AS (qty * price) STORED,
  buyer VARCHAR(100),
  mode  ENUM('Cash','Bank Transfer','UPI','Credit') DEFAULT 'Cash',
  date  DATE NOT NULL
);

-- ============================================================
--  SEED DATA
-- ============================================================
INSERT IGNORE INTO farmers (id, name, phone, email, district, state) VALUES
  (1, 'Rajan Murugan',  '9876543210', 'rajan@farm.in',  'Thanjavur',  'Tamil Nadu'),
  (2, 'Selvi Krishnan', '9765432101', 'selvi@farm.in',  'Coimbatore', 'Tamil Nadu');

INSERT IGNORE INTO farms (id, name, location, area, soil_type, farmer_id) VALUES
  (1, 'Green Paddy Farm', 'Papanasam', 12.50, 'Black', 1),
  (2, 'Mango Grove',      'Pollachi',   8.25, 'Red',   2);

INSERT IGNORE INTO fields (id, name, area, irrigation_type, current_crop, farm_id) VALUES
  (1, 'North Paddy Field', 3.5, 'Drip',      'Rice',   1),
  (2, 'South Field A',     2.8, 'Sprinkler', 'Wheat',  1),
  (3, 'Mango Orchard',     5.0, 'Flood',     'Mango',  2),
  (4, 'Vegetable Patch',   1.5, 'Drip',      'Tomato', 1);

INSERT IGNORE INTO crops (id, name, stage, sow_date, harvest, yield_kg, status, field_id) VALUES
  (1, 'Rice (Kuruvai)',   'Vegetative', '2025-06-15', '2025-10-15', 4850, 'Active',    1),
  (2, 'Wheat (HD-3086)',  'Ripening',   '2025-11-01', '2026-03-01', NULL, 'Active',    2),
  (3, 'Alphonso Mango',   'Flowering',  '2025-01-10', '2026-05-01', NULL, 'Active',    3),
  (4, 'Tomato (Hybrid)',  'Fruiting',   '2025-12-01', '2026-02-28', NULL, 'Active',    4);

INSERT IGNORE INTO sensors (id, type, value, unit, status, field_id) VALUES
  (1, 'Soil Moisture', 42.5, '%',      'normal', 1),
  (2, 'Temperature',   28.3, '°C',     'normal', 1),
  (3, 'Soil pH',        6.8, 'pH',     'normal', 2),
  (4, 'Humidity',      72.1, '%',      'normal', 2),
  (5, 'Soil Moisture', 24.2, '%',      'alert',  3),
  (6, 'Rainfall',       8.4, 'mm',     'normal', 4);

INSERT IGNORE INTO irrigations (id, field, date, time, duration, method, status) VALUES
  (1, 'North Paddy Field', '2026-03-12', '06:00', 45, 'Drip',      'Scheduled'),
  (2, 'South Field A',     '2026-03-11', '07:30', 30, 'Sprinkler', 'Completed'),
  (3, 'Vegetable Patch',   '2026-03-13', '05:45', 20, 'Drip',      'Scheduled');

INSERT IGNORE INTO livestock (id, tag, species, breed, age, gender, weight, status, milk) VALUES
  (1, 'COW-001', 'Cow',     'Gir',    '4y', 'Female', 380, 'Healthy',         12.5),
  (2, 'BUF-002', 'Buffalo', 'Murrah', '5y', 'Female', 520, 'Healthy',          8.2),
  (3, 'GOT-003', 'Goat',    'Boer',   '2y', 'Male',    65, 'Under Treatment',   0.0);

INSERT IGNORE INTO market_prices (id, crop, price, `change`, market, trend) VALUES
  (1, 'Rice',      22.50,  1.2, 'Thanjavur APMC',    'up'),
  (2, 'Wheat',     21.80, -0.5, 'Coimbatore APMC',   'down'),
  (3, 'Tomato',    35.00,  8.5, 'Chennai Koyambedu', 'up'),
  (4, 'Mango',     85.00, 12.0, 'Madurai APMC',      'up'),
  (5, 'Sugarcane',  3.80, -0.1, 'Erode APMC',        'down');

INSERT IGNORE INTO sales (id, crop, qty, price, buyer, mode, date) VALUES
  (1, 'Rice',   4850, 22.50, 'APMC Thanjavur', 'Bank Transfer', '2025-10-14'),
  (2, 'Tomato',  320, 32.00, 'Local Market',   'Cash',          '2026-01-15');
