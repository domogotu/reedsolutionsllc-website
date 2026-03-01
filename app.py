from flask import Flask, render_template, request, redirect, url_for, session
from dotenv import load_dotenv
import os, sqlite3, hashlib

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY", "dev-fallback-key")

BASE = os.path.dirname(os.path.abspath(__file__))
DB = os.path.join(BASE, "users.db")

def hash_pw(pw):
    return hashlib.sha256(pw.encode()).hexdigest()

def db():
    return sqlite3.connect(DB)

def init_db():
    with db() as c:
        c.execute("CREATE TABLE IF NOT EXISTS users (username TEXT PRIMARY KEY, password TEXT, role TEXT)")
        if not c.execute("SELECT 1 FROM users WHERE username='admin'").fetchone():
            c.execute("INSERT INTO users VALUES (?,?,?)", ("admin", hash_pw("admin123"), "admin"))

def login_required(admin=False):
    def wrap(fn):
        def inner(*a, **k):
            if "user" not in session:
                return redirect(url_for("login"))
            if admin and session.get("role") != "admin":
                return "Forbidden", 403
            return fn(*a, **k)
        inner.__name__ = fn.__name__
        return inner
    return wrap

@app.route("/login", methods=["GET","POST"])
def login():
    error = None
    if request.method == "POST":
        u = request.form["username"]
        p = hash_pw(request.form["password"])
        with db() as c:
            r = c.execute("SELECT role FROM users WHERE username=? AND password=?", (u,p)).fetchone()
        if r:
            session["user"] = u
            session["role"] = r[0]
            return redirect("/portal/dashboard")
        error = "Invalid credentials"
    return render_template("login.html", error=error)

@app.route("/logout")
def logout():
    session.clear()
    return redirect("/portal/login")

@app.route("/portal/dashboard", methods=["GET","POST"])
@login_required()
def dashboard():
    return render_template("dashboard.html")

@app.route("/portal/users", methods=["GET","POST"])
@login_required(admin=True)
def users():
    with db() as c:
        if request.method == "POST":
            if "create" in request.form:
                c.execute("INSERT OR REPLACE INTO users VALUES (?,?,?)",
                    (request.form["username"], hash_pw(request.form["password"]), request.form["role"]))
            if "delete" in request.form:
                c.execute("DELETE FROM users WHERE username=?", (request.form["username"],))
        rows = c.execute("SELECT username, role FROM users").fetchall()
    return render_template("users.html", users=rows)

if __name__ == "__main__":
    init_db()
    app.run(host=os.getenv("HOST","127.0.0.1"), port=int(os.getenv("PORT",5000)))
