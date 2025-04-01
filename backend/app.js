// backend/app.js
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "my_database"
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL database.");
});

// API xử lý login
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const query = "SELECT * FROM users WHERE username = ? AND password = ?";
  
  db.execute(query, [username, password], (err, result) => {
    if (err) return res.status(500).send("Database error");
    if (result.length > 0) {
      res.status(200).json({ message: "Login successful", userId: result[0].id });
    } else {
      res.status(400).json({ message: "Invalid credentials" });
    }
  });
});

// API xử lý signup
app.post("/signup", (req, res) => {
  const { username, password, email } = req.body;
  const query = "INSERT INTO users (username, password, email) VALUES (?, ?, ?)";
  
  db.execute(query, [username, password, email], (err, result) => {
    if (err) return res.status(500).send("Database error");
    res.status(201).json({ message: "User registered successfully" });
  });
});

// API xử lý checkout
app.post("/checkout", (req, res) => {
  const { userId, games } = req.body;

  if (!userId || !games || games.length === 0) {
    return res.status(400).json({ message: "Invalid request data" });
  }

  const query = `
    INSERT INTO orders (user_id, game_id, game_name, price, discount, total_payment)
    VALUES ?
  `;

  const values = games.map(game => [
    userId,
    game._id,
    game.title,
    game.price,
    game.discount,
    (game.price * (1 - game.discount)).toFixed(2)
  ]);

  db.query(query, [values], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }
    res.status(200).json({ message: "Checkout successful" });
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});