"""Dependency-free backend foundation for CAMILLA.

SQLite, signed session cookies, role checks and booking conflict protection.
The module uses only Python's standard library so it works in the existing venv.
"""
from __future__ import annotations

import hashlib
import hmac
import json
import secrets
import sqlite3
import time
from datetime import datetime, timedelta
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler
from pathlib import Path
from urllib.parse import urlparse

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "camilla.sqlite3"
SESSION_TTL = 60 * 60 * 24 * 30


def db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def init_db():
    with db() as conn:
        conn.executescript("""
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE,
          password_hash TEXT, role TEXT NOT NULL DEFAULT 'USER', language TEXT NOT NULL DEFAULT 'ru',
          created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS specialists (
          id INTEGER PRIMARY KEY, user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
          display_name TEXT NOT NULL, bio TEXT NOT NULL DEFAULT ''
        );
        CREATE TABLE IF NOT EXISTS services (
          id TEXT PRIMARY KEY, name TEXT NOT NULL, duration_minutes INTEGER NOT NULL,
          price_uzs INTEGER NOT NULL, active INTEGER NOT NULL DEFAULT 1
        );
        CREATE TABLE IF NOT EXISTS availability (
          id INTEGER PRIMARY KEY, specialist_id INTEGER NOT NULL REFERENCES specialists(id) ON DELETE CASCADE,
          weekday INTEGER NOT NULL, start_time TEXT NOT NULL, end_time TEXT NOT NULL,
          UNIQUE(specialist_id, weekday)
        );
        CREATE TABLE IF NOT EXISTS bookings (
          id INTEGER PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id),
          specialist_id INTEGER NOT NULL REFERENCES specialists(id), service_id TEXT NOT NULL REFERENCES services(id),
          starts_at TEXT NOT NULL, ends_at TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'PENDING',
          notes TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
        CREATE INDEX IF NOT EXISTS bookings_specialist_time ON bookings(specialist_id, starts_at, ends_at);
        CREATE TABLE IF NOT EXISTS notifications (
          id INTEGER PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          kind TEXT NOT NULL, message TEXT NOT NULL, read_at TEXT, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS sessions (
          token TEXT PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          expires_at INTEGER NOT NULL
        );
        """)
        conn.executemany("INSERT OR IGNORE INTO services VALUES (?, ?, ?, ?, 1)", [
          ("a1", "Access Bars", 90, 300000), ("m1", "Маникюр без покрытия", 120, 70000),
          ("m2", "Маникюр с покрытием", 120, 140000), ("p1", "Педикюр", 120, 200000),
          ("d1", "Глубокое бикини", 60, 100000),
          ("m3", "Дизайн", 120, 20000), ("m4", "Наращивание ногтей", 120, 300000),
          ("m5", "Ремонт ногтей", 120, 25000), ("m6", "Снятие покрытия", 120, 30000),
          ("p2", "Обработка только пальчиков", 120, 150000), ("p3", "Обработка пяток", 120, 150000),
          ("p4", "Педикюр с покрытием", 120, 250000), ("d2", "Подмышки", 30, 30000),
          ("d3", "Руки полностью", 60, 70000), ("d4", "Ноги полностью", 60, 100000),
        ])
        conn.execute("UPDATE services SET duration_minutes=120 WHERE id='a1'")
        conn.execute("INSERT OR IGNORE INTO users(id,name,email,password_hash,role) VALUES(1,?,?,?,?)", ("CAMILLA Owner", "specialist@camilla.local", password_hash("ChangeMe123!"), "ADMIN"))
        conn.execute("UPDATE users SET role='ADMIN' WHERE id=1")
        conn.execute("INSERT OR IGNORE INTO specialists(id,user_id,display_name,bio) VALUES(1,1,?,?)", ("Шахло Сaitова Давроновна", "Основной специалист CAMILLA"))


def password_hash(password: str, salt: bytes | None = None) -> str:
    salt = salt or secrets.token_bytes(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, 210_000)
    return salt.hex() + ":" + digest.hex()


def password_ok(password: str, encoded: str) -> bool:
    try:
        salt, expected = encoded.split(":", 1)
        actual = hashlib.pbkdf2_hmac("sha256", password.encode(), bytes.fromhex(salt), 210_000).hex()
        return hmac.compare_digest(actual, expected)
    except (ValueError, TypeError):
        return False


def create_session(conn, user_id: int) -> str:
    token = secrets.token_urlsafe(32)
    conn.execute("INSERT INTO sessions VALUES (?, ?, ?)", (token, user_id, int(time.time()) + SESSION_TTL))
    return token


def public_user(row):
    return {k: row[k] for k in ("id", "name", "email", "role", "language", "created_at") if k in row.keys()}


class APIHandler(BaseHTTPRequestHandler):
    def json(self, status, payload, cookies=""):
        body = json.dumps(payload, ensure_ascii=False).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        if cookies: self.send_header("Set-Cookie", cookies)
        self.end_headers(); self.wfile.write(body)

    def body(self):
        length = int(self.headers.get("Content-Length", 0))
        return json.loads(self.rfile.read(length) or b"{}")

    def current_user(self, conn):
        raw = self.headers.get("Cookie", "")
        token = next((v.strip() for v in raw.split(";") if v.strip().startswith("camilla_session=")), "").split("=", 1)[-1]
        return conn.execute("SELECT u.* FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token=? AND s.expires_at>?", (token, int(time.time()))).fetchone()

    def do_POST(self):
        path = urlparse(self.path).path
        with db() as conn:
            try:
                data = self.body()
                if path == "/api/auth/register":
                    if not data.get("name") or not data.get("email") or len(data.get("password", "")) < 8:
                        return self.json(400, {"error": "Имя, email и пароль минимум 8 символов обязательны"})
                    email = data["email"].strip().lower()
                    if conn.execute("SELECT 1 FROM users WHERE email=?", (email,)).fetchone():
                        return self.json(409, {"error": "Этот email уже зарегистрирован"})
                    cur = conn.execute("INSERT INTO users(name,email,password_hash,language) VALUES(?,?,?,?)", (data["name"].strip(), email, password_hash(data["password"]), data.get("language", "ru")))
                    token = create_session(conn, cur.lastrowid)
                    return self.json(201, {"user": public_user(conn.execute("SELECT * FROM users WHERE id=?", (cur.lastrowid,)).fetchone())}, f"camilla_session={token}; Path=/; HttpOnly; SameSite=Lax; Max-Age={SESSION_TTL}")
                if path == "/api/auth/login":
                    user = conn.execute("SELECT * FROM users WHERE email=?", (data.get("email", "").strip().lower(),)).fetchone()
                    if not user or not user["password_hash"] or not password_ok(data.get("password", ""), user["password_hash"]):
                        return self.json(401, {"error": "Неверный email или пароль"})
                    token = create_session(conn, user["id"])
                    return self.json(200, {"user": public_user(user)}, f"camilla_session={token}; Path=/; HttpOnly; SameSite=Lax; Max-Age={SESSION_TTL}")
                if path == "/api/auth/logout":
                    self.logout(conn); return self.json(204, {}, "camilla_session=; Path=/; Max-Age=0")
                user = self.current_user(conn)
                if not user: return self.json(401, {"error": "Войдите в аккаунт"})
                if path == "/api/admin/bookings/status":
                    if user["role"] != "ADMIN": return self.json(403, {"error": "Доступ только для администратора"})
                    status = data.get("status")
                    if status not in ("CONFIRMED", "CANCELLED"): return self.json(400, {"error": "Некорректный статус"})
                    if not conn.execute("UPDATE bookings SET status=? WHERE id=?", (status, data.get("id"))).rowcount:
                        return self.json(404, {"error": "Запись не найдена"})
                    return self.json(200, {"status": status})
                if path == "/api/bookings":
                    required = (data.get("specialist_id"), data.get("service_id"), data.get("starts_at"), data.get("ends_at"))
                    if not all(required): return self.json(400, {"error": "Недостаточно данных для записи"})
                    try:
                        starts_at = datetime.fromisoformat(data["starts_at"])
                        ends_at = datetime.fromisoformat(data["ends_at"])
                    except (TypeError, ValueError):
                        return self.json(400, {"error": "Некорректное время записи"})
                    if starts_at.date() < datetime.now().date():
                        return self.json(400, {"error": "Нельзя записаться на прошедшую дату"})
                    durations = {"a1": 120, "m1": 120, "m2": 120, "m3": 120, "m4": 120, "m5": 120, "m6": 120,
                                 "p1": 120, "p2": 120, "p3": 120, "p4": 120, "d1": 60, "d2": 30, "d3": 60, "d4": 60}
                    duration = durations.get(data["service_id"])
                    start_minutes = starts_at.hour * 60 + starts_at.minute
                    crosses_break = start_minutes < 780 and start_minutes + (duration or 0) > 720
                    if not duration or starts_at.minute not in (0, 30) or start_minutes < 540 or start_minutes + duration > 1080 or crosses_break or ends_at != starts_at + timedelta(minutes=duration):
                        return self.json(400, {"error": "Выберите доступный интервал для этой услуги"})
                    if duration == 120 and start_minutes not in (540, 780, 900):
                        return self.json(400, {"error": "Для этой услуги доступны только двухчасовые интервалы"})
                    if data["service_id"] == "a1" and starts_at.weekday() != 4:
                        return self.json(400, {"error": "Access Bars доступен только по пятницам"})
                    if data["service_id"] != "a1" and starts_at.weekday() == 4:
                        return self.json(400, {"error": "По пятницам принимается только Access Bars"})
                    conflict = conn.execute("SELECT 1 FROM bookings WHERE specialist_id=? AND status IN ('PENDING','CONFIRMED') AND starts_at < ? AND ends_at > ?", (data["specialist_id"], data["ends_at"], data["starts_at"])).fetchone()
                    if conflict: return self.json(409, {"error": "Это время уже занято"})
                    cur = conn.execute("INSERT INTO bookings(user_id,specialist_id,service_id,starts_at,ends_at,notes) VALUES(?,?,?,?,?,?)", (user["id"], *required, data.get("notes", "")))
                    return self.json(201, {"id": cur.lastrowid, "status": "PENDING"})
            except sqlite3.IntegrityError:
                return self.json(409, {"error": "Операция конфликтует с существующими данными"})
            except (ValueError, json.JSONDecodeError):
                return self.json(400, {"error": "Некорректный запрос"})
        return self.json(404, {"error": "Маршрут не найден"})

    def do_GET(self):
        path = urlparse(self.path).path
        with db() as conn:
            user = self.current_user(conn)
            if path == "/api/services":
                return self.json(200, {"services": [dict(x) for x in conn.execute("SELECT * FROM services WHERE active=1")]})
            if path == "/api/bookings/occupied":
                rows = conn.execute("SELECT starts_at, ends_at FROM bookings WHERE status IN ('PENDING','CONFIRMED') ORDER BY starts_at").fetchall()
                return self.json(200, {"bookings": [dict(x) for x in rows]})
            if path == "/api/auth/me": return self.json(200, {"user": public_user(user) if user else None})
            if not user: return self.json(401, {"error": "Войдите в аккаунт"})
            if path == "/api/admin/bookings":
                if user["role"] != "ADMIN": return self.json(403, {"error": "Доступ только для администратора"})
                rows = conn.execute("SELECT b.*, s.name service_name, u.name customer_name FROM bookings b JOIN services s ON s.id=b.service_id JOIN users u ON u.id=b.user_id ORDER BY b.starts_at DESC").fetchall()
                return self.json(200, {"bookings": [dict(x) for x in rows]})
            if path == "/api/bookings":
                rows = conn.execute("SELECT b.*, s.name service_name FROM bookings b JOIN services s ON s.id=b.service_id WHERE b.user_id=? ORDER BY b.starts_at DESC", (user["id"],))
                return self.json(200, {"bookings": [dict(x) for x in rows]})
            if path == "/api/notifications":
                rows = conn.execute("SELECT * FROM notifications WHERE user_id=? ORDER BY created_at DESC", (user["id"],))
                return self.json(200, {"notifications": [dict(x) for x in rows]})
        return self.json(404, {"error": "Маршрут не найден"})

    def logout(self, conn):
        raw = self.headers.get("Cookie", "")
        token = next((v.strip() for v in raw.split(";") if v.strip().startswith("camilla_session=")), "").split("=", 1)[-1]
        conn.execute("DELETE FROM sessions WHERE token=?", (token,))

    def log_message(self, *_): pass


init_db()
