const multer = require("multer");
const path = require("path");
const fs = require("fs");

/**
 * Upload middleware for profile pictures using Multer + local disk storage.
 * Files are stored under /uploads/profiles/ with a timestamped unique filename.
 *
 * @author akshatnathani
 * @version 1.0.0
 * @module upload.middleware
 */

const PROFILES_DIR = path.join(process.cwd(), "uploads", "profiles");

// Ensure the profiles upload directory exists on startup
if (!fs.existsSync(PROFILES_DIR)) {
  fs.mkdirSync(PROFILES_DIR, { recursive: true });
}

/**
 * Multer disk storage configuration.
 * - Saves to /uploads/profiles/
 * - Filename format: profilePicture-<timestamp>-<randomId>.<ext>
 */
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, PROFILES_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `profilePicture-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

/**
 * File filter — only allows image MIME types.
 * Rejects non-image uploads with a descriptive error.
 *
 * @param {Request} _req - Express request (unused)
 * @param {Express.Multer.File} file - Uploaded file metadata
 * @param {Function} cb - Multer callback
 */
const fileFilter = (_req, file, cb) => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type. Only JPEG, PNG, GIF, and WEBP images are allowed."),
      false
    );
  }
};

/**
 * Configured Multer instance.
 * - Max file size: 5 MB
 * - Only images accepted
 * - Stored to /uploads/profiles/
 */
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});

module.exports = upload;
