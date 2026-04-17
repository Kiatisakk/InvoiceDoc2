// Test API route: echo and ping endpoints
import { Router } from "express";

const r = Router();

// Echo: returns back the request body
r.post("/echo", (req, res) => {
  res.json({
    message: "Echo received",
    receivedAt: new Date().toISOString(),
    body: req.body,
  });
});

// Ping: simple ping-pong response
r.get("/ping", (_req, res) => {
  res.json({ message: "pong", timestamp: Date.now() });
});

// DB status: checks if the database connection is alive
r.get("/db-status", async (_req, res) => {
  try {
    const result = await pool.query("SELECT NOW() AS server_time");
    res.json({
      message: "Database connected",
      serverTime: result.rows[0].server_time,
    });
  } catch (err) {
    res.status(500).json({
      message: "Database connection failed",
      error: err.message,
    });
  }
});

export default r;
