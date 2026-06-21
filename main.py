# ============================================================
#  SMART FARMING SYSTEM — FastAPI Backend
#  File: main.py
#
#  Install deps:
#    pip install fastapi uvicorn mysql-connector-python python-dotenv
#
#  Run:
#    uvicorn main:app --reload --port 8000
# ============================================================

from contextlib import asynccontextmanager
from decimal import Decimal
from datetime import date, datetime, timedelta
import os

import mysql.connector
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

load_dotenv()

# ── DB CONNECTION ────────────────────────────────────────────
def get_db():
    return mysql.connector.connect(
        host     = os.getenv("DB_HOST",     "localhost"),
        port     = int(os.getenv("DB_PORT", "3306")),
        user     = os.getenv("DB_USER",     "root"),
        password = os.getenv("DB_PASSWORD", "261008"),
        database = os.getenv("DB_NAME",     "smart_farm"),
        connection_timeout = 10,
    )

# ── SANITIZE MYSQL ROWS (Decimal, date, timedelta → JSON-safe) ──
def _sanitize_row(row: dict) -> dict:
    out = {}
    for k, v in row.items():
        if isinstance(v, Decimal):
            out[k] = float(v)
        elif isinstance(v, datetime):
            out[k] = v.isoformat()
        elif isinstance(v, date):
            out[k] = v.isoformat()
        elif isinstance(v, timedelta):
            total = int(v.total_seconds())
            h, rem = divmod(total, 3600)
            m, _s  = divmod(rem, 60)
            out[k] = f"{h:02d}:{m:02d}"
        else:
            out[k] = v
    return out

def _sanitize(rows) -> list:
    return [_sanitize_row(r) for r in rows]

# ── AUTO-CREATE DATABASE & TABLES ────────────────────────────
def init_db():
    try:
        root_conn = mysql.connector.connect(
            host     = os.getenv("DB_HOST",     "localhost"),
            port     = int(os.getenv("DB_PORT", "3306")),
            user     = os.getenv("DB_USER",     "root"),
            password = os.getenv("DB_PASSWORD", "261008"),
            connection_timeout = 10,
        )
        db_name = os.getenv("DB_NAME", "smart_farm")
        cur = root_conn.cursor()
        cur.execute(f"CREATE DATABASE IF NOT EXISTS `{db_name}`")
        cur.execute(f"USE `{db_name}`")

        ddl_statements = [
            """CREATE TABLE IF NOT EXISTS farmers (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                phone VARCHAR(15) UNIQUE NOT NULL,
                email VARCHAR(100),
                district VARCHAR(80),
                state VARCHAR(60) DEFAULT 'Tamil Nadu',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )""",
            """CREATE TABLE IF NOT EXISTS farms (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                location VARCHAR(150),
                area DECIMAL(10,2),
                soil_type ENUM('Black','Red','Loamy','Sandy','Clay','Silt') DEFAULT 'Loamy',
                farmer_id INT NOT NULL,
                FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE
            )""",
            """CREATE TABLE IF NOT EXISTS fields (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(80) NOT NULL,
                area DECIMAL(8,2),
                irrigation_type ENUM('Drip','Sprinkler','Flood','Manual','Rainfed') DEFAULT 'Drip',
                current_crop VARCHAR(80),
                farm_id INT NOT NULL,
                FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE CASCADE
            )""",
            """CREATE TABLE IF NOT EXISTS crops (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                stage ENUM('Seedling','Vegetative','Flowering','Fruiting','Ripening','Ready to Harvest') DEFAULT 'Seedling',
                sow_date DATE,
                harvest DATE,
                yield_kg DECIMAL(10,2),
                status ENUM('Active','Harvested','Failed') DEFAULT 'Active',
                field_id INT NOT NULL,
                FOREIGN KEY (field_id) REFERENCES fields(id) ON DELETE CASCADE
            )""",
            """CREATE TABLE IF NOT EXISTS sensors (
                id INT AUTO_INCREMENT PRIMARY KEY,
                type VARCHAR(60) NOT NULL,
                value DECIMAL(10,3),
                unit VARCHAR(20),
                status ENUM('normal','alert','offline') DEFAULT 'normal',
                field_id INT NOT NULL,
                last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (field_id) REFERENCES fields(id) ON DELETE CASCADE
            )""",
            """CREATE TABLE IF NOT EXISTS irrigations (
                id INT AUTO_INCREMENT PRIMARY KEY,
                field VARCHAR(80),
                date DATE NOT NULL,
                time TIME,
                duration INT,
                method ENUM('Drip','Sprinkler','Flood','Manual') DEFAULT 'Drip',
                status ENUM('Scheduled','Completed','Cancelled') DEFAULT 'Scheduled'
            )""",
            """CREATE TABLE IF NOT EXISTS livestock (
                id INT AUTO_INCREMENT PRIMARY KEY,
                tag VARCHAR(30) UNIQUE NOT NULL,
                species ENUM('Cow','Buffalo','Goat','Sheep','Pig','Poultry') DEFAULT 'Cow',
                breed VARCHAR(80),
                age VARCHAR(20),
                gender ENUM('Male','Female') DEFAULT 'Female',
                weight DECIMAL(7,2),
                status ENUM('Healthy','Under Treatment','Deceased') DEFAULT 'Healthy',
                milk DECIMAL(6,2) DEFAULT 0,
                farm_id INT,
                FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE SET NULL
            )""",
            """CREATE TABLE IF NOT EXISTS market_prices (
                id INT AUTO_INCREMENT PRIMARY KEY,
                crop VARCHAR(80) NOT NULL,
                price DECIMAL(8,2) NOT NULL,
                `change` DECIMAL(6,2) DEFAULT 0,
                market VARCHAR(100),
                trend ENUM('up','down','stable') DEFAULT 'stable',
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )""",
            """CREATE TABLE IF NOT EXISTS sales (
                id INT AUTO_INCREMENT PRIMARY KEY,
                crop VARCHAR(80),
                qty DECIMAL(10,2),
                price DECIMAL(8,2),
                total DECIMAL(12,2) GENERATED ALWAYS AS (qty * price) STORED,
                buyer VARCHAR(100),
                mode ENUM('Cash','Bank Transfer','UPI','Credit') DEFAULT 'Cash',
                date DATE NOT NULL
            )""",
        ]
        for stmt in ddl_statements:
            cur.execute(stmt)

        # Seed data — INSERT IGNORE so it's idempotent
        seed = [
            "INSERT IGNORE INTO farmers (id,name,phone,email,district,state) VALUES (1,'Rajan Murugan','9876543210','rajan@farm.in','Thanjavur','Tamil Nadu'),(2,'Selvi Krishnan','9765432101','selvi@farm.in','Coimbatore','Tamil Nadu')",
            "INSERT IGNORE INTO farms (id,name,location,area,soil_type,farmer_id) VALUES (1,'Green Paddy Farm','Papanasam',12.50,'Black',1),(2,'Mango Grove','Pollachi',8.25,'Red',2)",
            "INSERT IGNORE INTO fields (id,name,area,irrigation_type,current_crop,farm_id) VALUES (1,'North Paddy Field',3.5,'Drip','Rice',1),(2,'South Field A',2.8,'Sprinkler','Wheat',1),(3,'Mango Orchard',5.0,'Flood','Mango',2),(4,'Vegetable Patch',1.5,'Drip','Tomato',1)",
            "INSERT IGNORE INTO crops (id,name,stage,sow_date,harvest,yield_kg,status,field_id) VALUES (1,'Rice (Kuruvai)','Vegetative','2025-06-15','2025-10-15',4850,'Active',1),(2,'Wheat (HD-3086)','Ripening','2025-11-01','2026-03-01',NULL,'Active',2),(3,'Alphonso Mango','Flowering','2025-01-10','2026-05-01',NULL,'Active',3),(4,'Tomato (Hybrid)','Fruiting','2025-12-01','2026-02-28',NULL,'Active',4)",
            "INSERT IGNORE INTO sensors (id,type,value,unit,status,field_id) VALUES (1,'Soil Moisture',42.5,'%','normal',1),(2,'Temperature',28.3,'°C','normal',1),(3,'Soil pH',6.8,'pH','normal',2),(4,'Humidity',72.1,'%','normal',2),(5,'Soil Moisture',24.2,'%','alert',3),(6,'Rainfall',8.4,'mm','normal',4)",
            "INSERT IGNORE INTO irrigations (id,field,date,time,duration,method,status) VALUES (1,'North Paddy Field','2026-03-12','06:00',45,'Drip','Scheduled'),(2,'South Field A','2026-03-11','07:30',30,'Sprinkler','Completed'),(3,'Vegetable Patch','2026-03-13','05:45',20,'Drip','Scheduled')",
            "INSERT IGNORE INTO livestock (id,tag,species,breed,age,gender,weight,status,milk) VALUES (1,'COW-001','Cow','Gir','4y','Female',380,'Healthy',12.5),(2,'BUF-002','Buffalo','Murrah','5y','Female',520,'Healthy',8.2),(3,'GOT-003','Goat','Boer','2y','Male',65,'Under Treatment',0.0)",
            "INSERT IGNORE INTO market_prices (id,crop,price,`change`,market,trend) VALUES (1,'Rice',22.50,1.2,'Thanjavur APMC','up'),(2,'Wheat',21.80,-0.5,'Coimbatore APMC','down'),(3,'Tomato',35.00,8.5,'Chennai Koyambedu','up'),(4,'Mango',85.00,12.0,'Madurai APMC','up'),(5,'Sugarcane',3.80,-0.1,'Erode APMC','down')",
            "INSERT IGNORE INTO sales (id,crop,qty,price,buyer,mode,date) VALUES (1,'Rice',4850,22.50,'APMC Thanjavur','Bank Transfer','2025-10-14'),(2,'Tomato',320,32.00,'Local Market','Cash','2026-01-15')",
        ]
        for s in seed:
            try:
                cur.execute(s)
            except Exception:
                pass

        root_conn.commit()
        cur.close()
        root_conn.close()
        print("[OK] Database & tables initialized successfully.")
    except Exception as e:
        print(f"[WARN] DB init error (is MySQL running?): {e}")

# ── QUERY HELPER ─────────────────────────────────────────────
def query(sql: str, params=None, fetch=True):
    db  = get_db()
    cur = db.cursor(dictionary=True)
    cur.execute(sql, params or ())
    if fetch:
        rows = cur.fetchall()
        cur.close(); db.close()
        return _sanitize(rows)
    db.commit()
    last_id = cur.lastrowid
    cur.close(); db.close()
    return last_id

# ── LIFESPAN (startup/shutdown) ───────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield

# ── CREATE APP ────────────────────────────────────────────────
app = FastAPI(title="Smart Farming API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

# ── PYDANTIC MODELS ──────────────────────────────────────────
class Farmer(BaseModel):
    name: str; phone: str; email: Optional[str] = None
    district: Optional[str] = None; state: str = "Tamil Nadu"

class Farm(BaseModel):
    name: str; location: Optional[str] = None
    area: float; soil_type: str = "Loamy"; farmer_id: int

class Field(BaseModel):
    name: str; area: float
    irrigation_type: str = "Drip"
    current_crop: Optional[str] = None; farm_id: int

class Crop(BaseModel):
    name: str; stage: str = "Seedling"
    sow_date: str; harvest: str
    yield_kg: Optional[float] = None
    status: str = "Active"; field_id: int

class SensorUpdate(BaseModel):
    value: float; status: str = "normal"

class Irrigation(BaseModel):
    field: str; date: str; time: str = "06:00"
    duration: int = 30; method: str = "Drip"; status: str = "Scheduled"

class IrrigationStatus(BaseModel):
    status: str

class Animal(BaseModel):
    tag: str; species: str = "Cow"; breed: Optional[str] = None
    age: Optional[str] = None; gender: str = "Female"
    weight: Optional[float] = None; status: str = "Healthy"
    milk: float = 0; farm_id: Optional[int] = None

class Sale(BaseModel):
    crop: str; qty: float; price: float
    buyer: Optional[str] = None; mode: str = "Cash"; date: str

class MarketPrice(BaseModel):
    crop: str; price: float; change: float = 0
    market: Optional[str] = None; trend: str = "stable"

# ════════════════════════════════════════════════════════════
#  ROUTES
# ════════════════════════════════════════════════════════════

@app.get("/")
def root():
    return {"message": "Smart Farming API is running 🌿"}

# ── FARMERS ──────────────────────────────────────────────────
@app.get("/farmers")
def get_farmers():
    return query("SELECT * FROM farmers ORDER BY id")

@app.post("/farmers", status_code=201)
def add_farmer(f: Farmer):
    lid = query(
        "INSERT INTO farmers (name,phone,email,district,state) VALUES (%s,%s,%s,%s,%s)",
        (f.name, f.phone, f.email, f.district, f.state), fetch=False)
    return {"id": lid, **f.dict()}

@app.delete("/farmers/{fid}")
def del_farmer(fid: int):
    query("DELETE FROM farmers WHERE id=%s", (fid,), fetch=False)
    return {"deleted": fid}

# ── FARMS ─────────────────────────────────────────────────────
@app.get("/farms")
def get_farms():
    return query("""
        SELECT f.*, fa.name AS farmer_name
        FROM farms f JOIN farmers fa ON f.farmer_id = fa.id
        ORDER BY f.id
    """)

@app.post("/farms", status_code=201)
def add_farm(f: Farm):
    lid = query(
        "INSERT INTO farms (name,location,area,soil_type,farmer_id) VALUES (%s,%s,%s,%s,%s)",
        (f.name, f.location, f.area, f.soil_type, f.farmer_id), fetch=False)
    return {"id": lid, **f.dict()}

@app.delete("/farms/{fid}")
def del_farm(fid: int):
    query("DELETE FROM farms WHERE id=%s", (fid,), fetch=False)
    return {"deleted": fid}

# ── FIELDS ────────────────────────────────────────────────────
@app.get("/fields")
def get_fields():
    return query("""
        SELECT fi.*, f.name AS farm_name
        FROM fields fi JOIN farms f ON fi.farm_id = f.id
        ORDER BY fi.id
    """)

@app.post("/fields", status_code=201)
def add_field(f: Field):
    lid = query(
        "INSERT INTO fields (name,area,irrigation_type,current_crop,farm_id) VALUES (%s,%s,%s,%s,%s)",
        (f.name, f.area, f.irrigation_type, f.current_crop, f.farm_id), fetch=False)
    return {"id": lid, **f.dict()}

# ── CROPS ─────────────────────────────────────────────────────
@app.get("/crops")
def get_crops():
    return query("""
        SELECT c.*, fi.name AS field_name, fi.area AS field_area
        FROM crops c JOIN fields fi ON c.field_id = fi.id
        ORDER BY c.id
    """)

@app.post("/crops", status_code=201)
def add_crop(c: Crop):
    lid = query(
        "INSERT INTO crops (name,stage,sow_date,harvest,yield_kg,status,field_id) VALUES (%s,%s,%s,%s,%s,%s,%s)",
        (c.name, c.stage, c.sow_date, c.harvest, c.yield_kg, c.status, c.field_id), fetch=False)
    return {"id": lid, **c.dict()}

@app.patch("/crops/{cid}")
def update_crop(cid: int, c: Crop):
    query("UPDATE crops SET name=%s,stage=%s,sow_date=%s,harvest=%s,yield_kg=%s,status=%s WHERE id=%s",
          (c.name, c.stage, c.sow_date, c.harvest, c.yield_kg, c.status, cid), fetch=False)
    return {"updated": cid}

@app.delete("/crops/{cid}")
def del_crop(cid: int):
    query("DELETE FROM crops WHERE id=%s", (cid,), fetch=False)
    return {"deleted": cid}

# ── SENSORS ───────────────────────────────────────────────────
@app.get("/sensors")
def get_sensors():
    return query("""
        SELECT s.*, fi.name AS field_name,
               DATE_FORMAT(s.last_update, '%H:%i') AS last_update_fmt
        FROM sensors s JOIN fields fi ON s.field_id = fi.id
        ORDER BY s.id
    """)

@app.patch("/sensors/{sid}")
def update_sensor(sid: int, s: SensorUpdate):
    query("UPDATE sensors SET value=%s, status=%s WHERE id=%s",
          (s.value, s.status, sid), fetch=False)
    return {"updated": sid}

# ── IRRIGATIONS ───────────────────────────────────────────────
@app.get("/irrigations")
def get_irrigations():
    return query("SELECT * FROM irrigations ORDER BY date DESC, time")

@app.post("/irrigations", status_code=201)
def add_irrigation(i: Irrigation):
    lid = query(
        "INSERT INTO irrigations (field,date,time,duration,method,status) VALUES (%s,%s,%s,%s,%s,%s)",
        (i.field, i.date, i.time, i.duration, i.method, i.status), fetch=False)
    return {"id": lid, **i.dict()}

@app.patch("/irrigations/{iid}/status")
def update_irrigation_status(iid: int, body: IrrigationStatus):
    query("UPDATE irrigations SET status=%s WHERE id=%s", (body.status, iid), fetch=False)
    return {"updated": iid, "status": body.status}

@app.delete("/irrigations/{iid}")
def del_irrigation(iid: int):
    query("DELETE FROM irrigations WHERE id=%s", (iid,), fetch=False)
    return {"deleted": iid}

# ── LIVESTOCK ─────────────────────────────────────────────────
@app.get("/livestock")
def get_livestock():
    return query("SELECT * FROM livestock ORDER BY id")

@app.post("/livestock", status_code=201)
def add_animal(a: Animal):
    lid = query(
        "INSERT INTO livestock (tag,species,breed,age,gender,weight,status,milk,farm_id) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)",
        (a.tag, a.species, a.breed, a.age, a.gender, a.weight, a.status, a.milk, a.farm_id), fetch=False)
    return {"id": lid, **a.dict()}

@app.delete("/livestock/{lid}")
def del_animal(lid: int):
    query("DELETE FROM livestock WHERE id=%s", (lid,), fetch=False)
    return {"deleted": lid}

# ── MARKET PRICES ─────────────────────────────────────────────
@app.get("/market-prices")
def get_market_prices():
    return query("SELECT * FROM market_prices ORDER BY id")

@app.patch("/market-prices/{mid}")
def update_price(mid: int, m: MarketPrice):
    query("UPDATE market_prices SET crop=%s,price=%s,`change`=%s,market=%s,trend=%s WHERE id=%s",
          (m.crop, m.price, m.change, m.market, m.trend, mid), fetch=False)
    return {"updated": mid}

@app.post("/market-prices", status_code=201)
def add_price(m: MarketPrice):
    lid = query(
        "INSERT INTO market_prices (crop,price,`change`,market,trend) VALUES (%s,%s,%s,%s,%s)",
        (m.crop, m.price, m.change, m.market, m.trend), fetch=False)
    return {"id": lid, **m.dict()}

# ── SALES ─────────────────────────────────────────────────────
@app.get("/sales")
def get_sales():
    return query("SELECT * FROM sales ORDER BY date DESC")

@app.post("/sales", status_code=201)
def add_sale(s: Sale):
    lid = query(
        "INSERT INTO sales (crop,qty,price,buyer,mode,date) VALUES (%s,%s,%s,%s,%s,%s)",
        (s.crop, s.qty, s.price, s.buyer, s.mode, s.date), fetch=False)
    return {"id": lid, **s.dict()}

# ── DASHBOARD SUMMARY ─────────────────────────────────────────
@app.get("/dashboard")
def get_dashboard():
    farms     = query("SELECT COUNT(*) AS cnt FROM farms")[0]["cnt"]
    crops     = query("SELECT COUNT(*) AS cnt FROM crops WHERE status='Active'")[0]["cnt"]
    sensors   = query("SELECT COUNT(*) AS cnt FROM sensors")[0]["cnt"]
    alerts    = query("SELECT COUNT(*) AS cnt FROM sensors WHERE status='alert'")[0]["cnt"]
    livestock = query("SELECT COUNT(*) AS cnt FROM livestock")[0]["cnt"]
    revenue   = query("SELECT COALESCE(SUM(total),0) AS tot FROM sales")[0]["tot"]
    return {
        "farms": farms, "activeCrops": crops,
        "sensors": sensors, "alerts": alerts,
        "livestock": livestock, "revenue": float(revenue)
    }
