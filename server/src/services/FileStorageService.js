const path = require("path");
const fs = require("fs");

/**
 * Service class for local file storage operations.
 *
 * Handles storing, deleting, and retrieving files from the local filesystem.
 * Files are organized by directory type (e.g., "profiles", "documents").
 * Stored files are served statically via Express at /uploads/<directory>/<filename>.
 *
 * Inspired by a Cloudinary-backed Java interface — adapted for Node.js local storage.
 *
 * @author akshatnathani
 * @version 2.0.0
 * @class FileStorageService
 */
class FileStorageService {
  /**
   * Base upload directory on the server filesystem.
   * @type {string}
   */
  static BASE_DIR = path.join(process.cwd(), "uploads");

  /**
   * Allowed image file extensions.
   * @type {string[]}
   */
  static ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".webp"];

  /**
   * Stores a Multer file object to the local filesystem under a given directory.
   * The file is already saved by Multer's diskStorage; this method constructs
   * and returns the public URL path.
   *
   * @param {Express.Multer.File} file - The Multer file object from the request
   * @param {string} directory - The subdirectory under /uploads/ (e.g., "profiles")
   * @returns {string} The public URL path to the stored file (e.g., /uploads/profiles/filename.jpg)
   * @throws {Error} If the file or directory is not provided
   *
   * @example
   * const url = FileStorageService.getPublicUrl(req.file, 'profiles');
   * // => '/uploads/profiles/profilePicture-1717162800000-123456789.jpg'
   */
  static getPublicUrl(file, directory) {
    if (!file) throw new Error("File is required");
    if (!directory) throw new Error("Directory is required");
    return `/uploads/${directory}/${file.filename}`;
  }

  /**
   * Deletes a file from local storage using its public URL path.
   *
   * @param {string} fileUrl - The public URL path of the file (e.g., /uploads/profiles/filename.jpg)
   * @returns {boolean} true if deletion was successful, false otherwise
   *
   * @example
   * const success = FileStorageService.deleteFile('/uploads/profiles/profilePicture-xxx.jpg');
   */
  static deleteFile(fileUrl) {
    try {
      const relativePath = fileUrl.startsWith("/") ? fileUrl.slice(1) : fileUrl;
      const fullPath = path.join(process.cwd(), relativePath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
        return true;
      }
      return false;
    } catch (err) {
      console.error(`[FileStorageService] Failed to delete file: ${fileUrl}`, err.message);
      return false;
    }
  }

  /**
   * Returns the absolute filesystem path for a given file within a directory.
   *
   * @param {string} fileName - The name of the file
   * @param {string} directory - The subdirectory under /uploads/ (e.g., "profiles")
   * @returns {string} Absolute path to the file
   *
   * @example
   * const absPath = FileStorageService.getFilePath('avatar.png', 'profiles');
   * // => 'C:/project/uploads/profiles/avatar.png'
   */
  static getFilePath(fileName, directory) {
    return path.join(FileStorageService.BASE_DIR, directory, fileName);
  }

  /**
   * Validates whether a file's extension is in the allowed list.
   *
   * @param {string} fileName - The name of the file (including extension)
   * @returns {boolean} true if the extension is allowed, false otherwise
   *
   * @example
   * FileStorageService.isValidFileExtension('avatar.png'); // => true
   * FileStorageService.isValidFileExtension('script.exe'); // => false
   */
  static isValidFileExtension(fileName) {
    const ext = FileStorageService.getFileExtension(fileName).toLowerCase();
    return FileStorageService.ALLOWED_EXTENSIONS.includes(ext);
  }

  /**
   * Extracts the file extension from a file name.
   *
   * @param {string} fileName - The name of the file
   * @returns {string} The file extension including the dot (e.g., ".jpg")
   *
   * @example
   * FileStorageService.getFileExtension('avatar.PNG'); // => '.PNG'
   */
  static getFileExtension(fileName) {
    return path.extname(fileName);
  }

  /**
   * Ensures the upload directory for a given type exists on the filesystem.
   * Creates it recursively if it does not exist.
   *
   * @param {string} directory - Subdirectory name under /uploads/ (e.g., "profiles")
   * @returns {void}
   */
  static ensureDirectoryExists(directory) {
    const dirPath = path.join(FileStorageService.BASE_DIR, directory);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`[FileStorageService] Created directory: ${dirPath}`);
    }
  }
}

module.exports = FileStorageService;
