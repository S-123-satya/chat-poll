const {Router} = require("express");
const { postChat, getAllChats } = require("../controllers/chat.controllers");
const { verifyJWT } = require("../middlewares/auth.middlewares");

const router=Router();

router.post("/",verifyJWT, postChat);
router.get("/",verifyJWT, getAllChats);

module.exports=router;