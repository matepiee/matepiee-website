import express from "express";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import pool from "../config/database.js";
import { validateRegister } from "../middlewares/validations.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const body = req.body;

    validateRegister(body);

    const hashedPassword = await argon2.hash(body.password);

    const [result] = await pool.query(
      `INSERT INTO users (username, password, email_address) VALUES (?, ?, ?)`,
      [body.username, hashedPassword, body.email_address],
    );

    if (result.affectedRows === 0) {
      throw new Error("Failed to register user.");
    }

    res.status(200).json({ message: "User registered." });
  } catch (err) {
    console.log(err);

    if (err.code === "ER_DUP_ENTRY") {
      res
        .status(400)
        .json({ message: "Invalid username or email (already taken)." });
      return;
    }

    if (err.message.includes("Invalid")) {
      res.status(400).json({ message: err.message });
      return;
    }

    res.status(500).json({ message: "Server error." });
  }
});

export default router;
