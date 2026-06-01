/**
 * User management controller operations.
 * Allows listing, creating, status-updating, and deleting users.
 *
 * @author akshatnathani
 * @version 1.1.0
 * @module user.controller
 */

const User = require("../models/user.model");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");

const argon2 = require("argon2");

exports.getUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find().select("-password");
  
  // Format the response to match the frontend expectations
  const formattedUsers = users.map(user => ({
    id: user._id,
    fullName: user.name,
    email: user.email,
    username: user.username,
    contact: user.phone,
    profilePicture: user.profilePicture,
    status: user.status,
    role: user.role,
    joinedDate: new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  }));

  res.status(200).json({
    success: true,
    data: formattedUsers,
  });
});

/**
 * Creates a new user record.
 * Generates an automatic username, hashes their password with Argon2,
 * uploads their profile picture under /uploads/profiles/ and saves their role.
 *
 * @author akshatnathani
 * @version 1.1.0
 * @function createUser
 * @param {Object} req - Express request containing name, email, phone, password, role, and req.file
 * @param {Object} res - Express response
 * @param {Function} next - Express next middleware
 */
exports.createUser = asyncHandler(async (req, res, next) => {
  const { name, email, phone, password, role } = req.body;
  
  const profilePicture = req.file ? `/uploads/profiles/${req.file.filename}` : null;

  if (!name || !email || !phone || !password) {
    return next(new ApiError(400, "Please provide all required fields"));
  }

  const userExists = await User.findOne({ $or: [{ email }, { phone }] });
  if (userExists) {
    return next(new ApiError(400, "User already exists"));
  }

  const hashedPassword = await argon2.hash(password);
  const username = name.toLowerCase().replace(/\s+/g, '') + Math.floor(Math.random() * 1000);

  const user = await User.create({
    name,
    email,
    phone,
    username,
    profilePicture,
    password: hashedPassword,
    role: role || 'User',
    status: 'Active'
  });

  res.status(201).json({
    success: true,
    data: user
  });
});

exports.updateUserStatus = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return next(new ApiError(400, "Please provide a status"));
  }

  const user = await User.findById(id);
  if (!user) {
    return next(new ApiError(404, "User not found"));
  }

  user.status = status;
  await user.save();

  res.status(200).json({
    success: true,
    data: user,
  });
});

exports.deleteUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) {
    return next(new ApiError(404, "User not found"));
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
    message: "User deleted successfully",
  });
});
