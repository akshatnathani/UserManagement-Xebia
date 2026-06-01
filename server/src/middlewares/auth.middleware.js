/**
 * Authentication and authorization middleware.
 * Verifies JWT signature and extracts user credentials to protect API routes.
 *
 * @author akshatnathani
 * @version 1.0.0
 * @module auth.middleware
 */

const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new ApiError(401, "Not authorized to access this route"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecretkey123");
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      return next(new ApiError(401, "User no longer exists"));
    }
    next();
  } catch (error) {
    return next(new ApiError(401, "Not authorized to access this route"));
  }
});

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(
          403,
          `User role ${req.user.role} is not authorized to access this route`
        )
      );
    }
    next();
  };
};
