const express = require("express")
const router = express.Router()
const { protect } = require("../middlewares/authMiddleware")
const { sendMsg, allMsgs } = require('../controllers/messageController')

router.route('/').post(protect, sendMsg)
router.route('/:chatId').get(protect, allMsgs)

module.exports = router;