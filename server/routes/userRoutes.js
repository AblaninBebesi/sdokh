const express = require('express')
const { registerUser, authUser, allUsers, sendCode, verify } = require('../controllers/userControllers')
const { protect } = require("../middlewares/authMiddleware")

const router = express.Router()

router.route('/signup').post(registerUser);
router.route('/signin').post(authUser);
router.route('/sendemail').post(sendCode);
router.route('/verify').post(verify)

router.route('/').get(protect, allUsers);

module.exports = router;