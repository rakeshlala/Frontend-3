const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db/db");

const router = express.Router();

/* ================= REGISTER ================= */
router.post("/register", async (req, res) => {
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

    // check email exists
    const exists = await pool.query(
      "SELECT id FROM users WHERE email=$1",
      [email]
    );

    if (exists.rows.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // hash sensitive data
    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedLoginPin = await bcrypt.hash(loginPin.join(""), 10);
    const hashedPaymentPin = await bcrypt.hash(paymentPin.join(""), 10);

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

    res.json({ message: "Registration successful" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= LOGIN ================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
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

module.exports = router;
