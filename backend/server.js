const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database setup
const db = new sqlite3.Database("./database.db", (err) => {
    if (err) {
        console.log(err.message);
    }
    console.log("Connected to SQLite database.");
});

// Create items table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

// CRUD Routes

// Create
app.post("/api/items", (req, res) => {
    const { name, description } = req.body;
    db.run(
        "INSERT INTO items (name, description) VALUES (?, ?)",
        [name, description],
        function (err) {
            if (err) {
                return res.status(404).json({ error: err.message });
            }
            res.json({ id: this.lastID, name, description });
        }
    );
});

// Read all
app.get("/api/items", (req, res) => {
    db.all("SELECT * FROM items", [], (err, rows) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Read one
app.get("/api/items/:id", (req, res) => {
    const { id } = req.params;
    db.get("SELECT * FROM items WHERE id = ?", [id], (err, row) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json(row);
    });
});

// Update
app.put("/api/items/:id", (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    db.run(
        "UPDATE items SET name = ?, description = ? WHERE id = ?",
        [name, description, id],
        function (err) {
            if (err) {
                return res.status(400).json({ error: err.message });
            }
            res.json({ id: name, description });
        }
    );
});

// Delete
app.delete("/api/items/:id", (req, res) => {
    const { id } = req.params;
    db.run(
        "DELETE FROM items WHERE id = ?",
        [id],
        function (err) {
            if (err) {
                return res.status(400).json({ error: err.message });
            }
            res.json({ message: "Item deleted successfully" });
        }
    );
});

// Start server
app.listen(port, () => {
    console.log(`SERVER running on http://localhost:${port}`);
});