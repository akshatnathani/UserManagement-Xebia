const User = require("../models/user.model");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const FileStorageService = require("../services/FileStorageService");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "supersecretkey123", {
    expiresIn: "30d",
  });
};

exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !phone || !password) {
    // If a file was uploaded but validation fails, clean it up
    if (req.file) FileStorageService.deleteFile(`/uploads/profiles/${req.file.filename}`);
    return next(new ApiError(400, "Please provide all required fields"));
  }

  const userExists = await User.findOne({ $or: [{ email }, { phone }] });
  if (userExists) {
    if (req.file) FileStorageService.deleteFile(`/uploads/profiles/${req.file.filename}`);
    return next(new ApiError(400, "User already exists with this email or phone"));
  }

  const hashedPassword = await argon2.hash(password);

  // Auto-generate username from name
  const baseUsername = name.toLowerCase().replace(/\s+/g, "");
  const username = baseUsername + Math.floor(Math.random() * 1000);

  // Build public URL for the uploaded profile picture
  const profilePicture = req.file
    ? FileStorageService.getPublicUrl(req.file, "profiles")
    : "";

  const user = await User.create({
    name,
    email,
    phone,
    username,
    profilePicture,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        profilePicture: user.profilePicture,
        role: user.role,
        token: generateToken(user._id),
      },
    });
  } else {
    return next(new ApiError(400, "Invalid user data"));
  }
});

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ApiError(400, "Please provide email and password"));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return next(new ApiError(401, "Invalid credentials"));
  }

  if (user.status !== "Active") {
    return next(new ApiError(403, `Your account is ${user.status}. Please contact support.`));
  }

  const isMatch = await argon2.verify(user.password, password);
  if (!isMatch) {
    return next(new ApiError(401, "Invalid credentials"));
  }

  res.status(200).json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      profilePicture: user.profilePicture,
      role: user.role,
      token: generateToken(user._id),
    },
  });
});

exports.adminSetup = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(new ApiError(400, "Please provide the email of the user to make Admin"));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return next(new ApiError(404, "User not found"));
  }

  user.role = "Admin";
  await user.save();

  res.status(200).json({
    success: true,
    message: `User ${user.email} is now an Admin`,
  });
});

/**
 * Controller to fetch details of the currently authenticated user.
 * Reads user data populated by the auth protection middleware.
 *
 * @author akshatnathani
 * @version 1.0.0
 * @function getMe
 * @param {Object} req - Express request object containing req.user
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getMe = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: req.user,
  });
});
