const express = require("express");
const { getUsers, updateUserStatus, deleteUser, createUser } = require("../controllers/user.controller");
const { protect, authorize } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");

const router = express.Router();

router.use(protect);
router.use(authorize("Admin"));

router.get("/", getUsers);
router.post("/", upload.single("profilePicture"), createUser);
router.put("/:id/status", updateUserStatus);
router.delete("/:id", deleteUser);

module.exports = router;
