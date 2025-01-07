const express = require("express")
const router = express.Router()
const { protect } = require("../middlewares/authMiddleware")
const { accessChat, fetchChats } = require("../controllers/chatControllers")

router.route('/').post(protect, accessChat);
router.route('/').get(protect, fetchChats);
//router.route('/group').post(protect, createChat);
//router.route('/delete').put(protect, deleteChat);

module.exports = router;