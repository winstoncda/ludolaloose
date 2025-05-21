const {
  signup,
  verifyMail,
  checkEmailValidation,
  updateOptionalUserData,
  login,
  currentUser,
} = require("../controllers/auth.controller");
const router = require("express").Router();

const protect = require("../middlewares/authMiddleware");

router.post("/", signup);
router.get("/verifyMail/:token", verifyMail);
router.get("/check-validation", checkEmailValidation);
router.post("/optional", updateOptionalUserData);
router.post("/login", login);
router.get("/current", protect, currentUser); // 🛡️ protégée

module.exports = router;
