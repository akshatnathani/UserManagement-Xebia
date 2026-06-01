const express = require("express");
const { register, login, adminSetup, getMe } = require("../controllers/auth.controller");
const upload = require("../middlewares/upload.middleware");
const validate = require("../middlewares/validate.middleware");
const { registerSchema, loginSchema } = require("../validators/auth.validator");
const { protect } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/register", upload.single("profilePicture"), validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/admin", adminSetup);
router.get("/me", protect, getMe);

module.exports = router;
