const {Router} = require("express");
const { postPoll, getAllPolls, updatePoll } = require("../controllers/poll.controllers");
const { verifyJWT } = require("../middlewares/auth.middlewares");

const router=Router();

router.get("/",verifyJWT, getAllPolls);
router.post("/",verifyJWT, postPoll);
router.patch("/",verifyJWT, updatePoll);

module.exports=router;