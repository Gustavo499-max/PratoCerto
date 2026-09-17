const express = require("express");
const cors = require("cors");
const path = require("path");

const restaurantRoutes = require("./modules/restaurants/restaurant.routes");
const authRoutes = require("./modules/auth/auth.routes");

const app = express();

app.use(cors());
app.use(express.json());

// Serve a interface HTML (public/index.html)
app.use(express.static(path.join(__dirname, "../public")));

app.use("/auth", authRoutes);
app.use("/restaurants", restaurantRoutes);

// Rota de verificação rápida da API
app.get("/health", (req, res) => {
  res.json({ status: "ok", app: "PratoCerto API" });
});

module.exports = app;
