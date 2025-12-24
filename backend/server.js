const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

/* ================= DATABASE ================= */
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "front",
  password: "jeevan123",
  port: 5432
});

/* ================= REGISTER ================= */
app.post("/api/register", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      dob,
      gender,
      country,
      state,
      bankHolder,
      bankName,
      accountNo,
      ifsc,
      loginPin,
      paymentPin,
      locationAllowed
    } = req.body;

    // check existing user
    const check = await pool.query(
      "SELECT id FROM users WHERE email=$1",
      [email]
    );

    if (check.rows.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // hashing
    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedLoginPin = await bcrypt.hash(loginPin.join(""), 10);
    const hashedPaymentPin = await bcrypt.hash(paymentPin.join(""), 10);

    // insert user
    await pool.query(
      `INSERT INTO users
      (name,email,password,phone,dob,gender,country,state,
       bank_holder,bank_name,account_no,ifsc,
       login_pin,payment_pin,location_allowed)
      VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)`,
      [
        name,
        email,
        hashedPassword,
        phone,
        dob,
        gender,
        country,
        state,
        bankHolder,
        bankName,
        accountNo,
        ifsc,
        hashedLoginPin,
        hashedPaymentPin,
        locationAllowed
      ]
    );

    res.json({ success: true, message: "Registration successful" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= LOGIN ================= */
app.post("/api/login", async (req, res) => {
  try {
    const { email, password, loginPin } = req.body;

    const result = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const user = result.rows[0];

    const passOk = await bcrypt.compare(password, user.password);
    const pinOk = await bcrypt.compare(loginPin, user.login_pin);

    if (!passOk || !pinOk) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      "SECRET_KEY",
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= SERVER ================= */
app.listen(5000, () => {
  console.log("✅ Server running on http://localhost:5000");
});
