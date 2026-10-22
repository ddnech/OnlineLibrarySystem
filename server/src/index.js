const env = require("./config/env");
const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const db = require("./models");
const routes = require("./routes");
const { startOverdueJob } = require("./schedule/overdueBook");

const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false, // the React app sets its own rules; nginx serves it in Docker
  })
);
app.use(cors({ origin: env.corsOrigin === "*" ? true : env.corsOrigin.split(",") }));
app.use(express.json());
app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));

// Uploaded covers. Saved under UPLOAD_DIR, served at /uploads/...
fs.mkdirSync(env.uploadDir, { recursive: true });
app.use("/uploads", express.static(env.uploadDir, { maxAge: "7d" }));

app.get("/api", (req, res) => res.json({ message: "Online Library API is running" }));
app.get("/api/health", async (req, res) => {
  try {
    await db.sequelize.authenticate();
    res.json({ status: "ok" });
  } catch {
    res.status(503).json({ status: "database unavailable" });
  }
});

app.use("/api/auth", routes.auth);
app.use("/api/genre", routes.genre);
app.use("/api/book", routes.book);
app.use("/api/users", routes.user);
app.use("/api/admins", routes.admins);

app.use("/api", (req, res) => res.status(404).json({ message: "Endpoint not found." }));

// Optional: serve the built React app from the same port (used when not running behind nginx).
const clientBuild = path.resolve(__dirname, "..", "..", "client", "dist");
if (fs.existsSync(path.join(clientBuild, "index.html"))) {
  app.use(express.static(clientBuild));
  app.get("/{*splat}", (req, res) => res.sendFile(path.join(clientBuild, "index.html")));
}

// Express 5 sends errors from async handlers here automatically.
app.use((err, req, res, next) => {
  if (err.name === "SequelizeUniqueConstraintError") {
    return res.status(409).json({ message: "That value is already taken." });
  }
  const status = err.status || err.statusCode || 500;
  if (status >= 500) console.error(err);
  res.status(status).json({
    message: status >= 500 ? "Something went wrong on the server." : err.message,
  });
});

async function start() {
  try {
    await db.sequelize.authenticate();
  } catch (error) {
    console.error(`Can't connect to the database at ${env.db.host}:${env.db.port}.`);
    console.error(error.message);
    process.exit(1);
  }

  startOverdueJob();
  app.listen(env.port, () => console.log(`API running on http://localhost:${env.port}/api`));
}

start();
