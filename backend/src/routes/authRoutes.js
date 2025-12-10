import express from "express";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import pool from "../config/database.js";
import { validateRegister, validateLogin } from "../middlewares/validations.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const body = req.body;
    const email = body.email || body.email_address;

    validateRegister(body);

    const hashedPassword = await argon2.hash(body.password);

    const [result] = await pool.query(
      `INSERT INTO users (username, password, email_address) VALUES (?, ?, ?)`,
      [body.username, hashedPassword, email],
    );

    if (result.affectedRows === 0) {
      throw new Error("Failed to register user.");
    }

    res.status(200).json({ message: "User registered." });
  } catch (error) {
    console.log(error);
    if (error.code === "ER_DUP_ENTRY") {
      res
        .status(400)
        .json({ message: "Invalid username or email (already taken)." });
      return;
    }
    if (
      error.message &&
      (error.message.includes("Invalid") || error.message.includes("Password"))
    ) {
      res.status(400).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: "Server error." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const body = req.body;
    validateLogin(body);

    const identifier = body.username || body.email;

    const [users] = await pool.query(
      "SELECT * FROM users WHERE username = ? OR email_address = ?",
      [identifier, identifier],
    );

    const user = users[0];
    if (!user) return res.status(401).json({ message: "Invalid credentials." });

    const validPassword = await argon2.verify(user.password, body.password);
    if (!validPassword)
      return res.status(401).json({ message: "Invalid credentials." });

    const accessToken = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "15m" },
    );

    const refreshToken = jwt.sign(
      { id: user.id, username: user.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" },
    );

    await pool.query("UPDATE users SET refresh_token = ? WHERE id = ?", [
      refreshToken,
      user.id,
    ]);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful.",
      user: { username: user.username, email: user.email_address },
    });
  } catch (error) {
    console.log(error);
    if (
      error.message &&
      (error.message.includes("required") || error.message.includes("Invalid"))
    ) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Server error." });
  }
});

router.post("/refresh", async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.refreshToken) return res.sendStatus(401);

  const refreshToken = cookies.refreshToken;

  try {
    const [users] = await pool.query(
      "SELECT * FROM users WHERE refresh_token = ?",
      [refreshToken],
    );
    const user = users[0];

    if (!user) return res.sendStatus(403);

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err || user.id !== decoded.id) return res.sendStatus(403);

        const newAccessToken = jwt.sign(
          { id: user.id, username: user.username },
          process.env.JWT_SECRET,
          { expiresIn: "15m" },
        );

        res.cookie("accessToken", newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 15 * 60 * 1000,
        });

        res.json({ message: "Token refreshed." });
      },
    );
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.post("/logout", async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.refreshToken) return res.sendStatus(204);

  const refreshToken = cookies.refreshToken;

  const [users] = await pool.query(
    "SELECT * FROM users WHERE refresh_token = ?",
    [refreshToken],
  );
  if (users[0]) {
    await pool.query("UPDATE users SET refresh_token = NULL WHERE id = ?", [
      users[0].id,
    ]);
  }

  res.clearCookie("accessToken", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });

  res.status(200).json({ message: "Logged out successfully." });
});

export default router;
