const express = require("express")
const { protect } = require("../middlewares/authMiddleware")
const { accessChat } = require("../controllers/chatControllers")

const router = express.Router()

router.route("/").post(protect, accessChat)
/*router.route("/").get(protect, fetchChat)
router.route('/group').post(protect, createGroupChat)
router.route('/rename').put(protect, renameGroup)
router.route('/groupremove').put(protect, removeGroup)
router.route('/groupadd').put(protect, addGroup)*/

module.exports = router
