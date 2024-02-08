const {Router} = require("express");
const { userRegister, userLogin, userLogout } = require("../controllers/user.controllers");

const router=Router();

router.post("/register",userRegister);
router.post("/login",userLogin);
router.post("/logout",userLogout);

module.exports=router;