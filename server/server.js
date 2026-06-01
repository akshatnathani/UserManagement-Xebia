require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const path = require("path");

const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/auth.routes");
const userRoutes = require("./src/routes/user.routes");
const { generalLimiter } = require("./src/middlewares/rateLimiter.middleware");
const errorMiddleware = require("./src/middlewares/error.middleware");
const ApiError = require("./src/utils/ApiError");

const app = express();

const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173").split(",");

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (Postman, curl, server-to-server)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origin '${origin}' not allowed`));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
// Respond to preflight OPTIONS for every route (Express 5 compatible)
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

app.use(helmet({
  crossOriginResourcePolicy: false
}));
app.use(morgan("dev"));
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use(generalLimiter);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "User Management API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.use((req, res, next) => {
  next(new ApiError(404, `Route ${req.originalUrl} not found`));
});

app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  });