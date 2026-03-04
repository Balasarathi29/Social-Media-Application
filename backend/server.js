const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");
const { errorHandler, notFound } = require("./middleware/error");

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// CORS configuration
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
const allowedOrigins = frontendUrl.split(",").map((url) => url.trim());
// Add common development ports
allowedOrigins.push("http://localhost:3001");

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/posts", require("./routes/postRoutes"));
app.use("/api/comments", require("./routes/commentRoutes"));

// Root route for uptime checks
app.get("/", (_req, res) => {
  res.json({ status: "ok", message: "API root" });
});

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const basePort = Number(process.env.PORT) || 5000;

const startServer = (port) => {
  const server = app
    .listen(port, () => {
      console.log(
        `Server running in ${process.env.NODE_ENV || "development"} mode on port ${port}`,
      );
    })
    .on("error", (error) => {
      if (error.code === "EADDRINUSE") {
        console.warn(`Port ${port} is in use. Retrying on port ${port + 1}...`);
        setTimeout(() => startServer(port + 1), 300);
        return;
      }

      console.error(`Server startup error: ${error.message}`);
      process.exit(1);
    });

  return server;
};

startServer(basePort);
