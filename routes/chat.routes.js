const {Router} = require("express");
const { postChat, getAllChats } = require("../controllers/chat.controllers");

const router=Router();

router.post("/", postChat);
router.get("/", getAllChats);

module.exports=router;