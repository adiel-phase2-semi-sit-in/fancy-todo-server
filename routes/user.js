const router = require("express").Router();
const { UserController } = require("../controller");

router.post("/signUp", UserController.signUp);
router.post("/signIn", UserController.signIn);
router.post("/googleSignIn", UserController.googleSignIn);
router.delete("/:id", UserController.destroy);
module.exports = router;
