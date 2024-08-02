const express = require("express");
const { registerUser, loginUser, currentUser, deleteUser } = require("../controllers/userControllers");
const validateToken = require("../middleware/validateTokenHandler");

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/delete").delete(deleteUser);
router.route("/login").post(loginUser);
router.route("/current").all(validateToken).get(currentUser); 

module.exports = router;