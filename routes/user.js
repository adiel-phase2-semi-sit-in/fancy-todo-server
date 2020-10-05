const router = require("express").Router()
const { UserController } = require("../controller")
const { getAccessToken, getUserData } = require("../middlewares/githubOauth")
router.post("/signUp", UserController.signUp)
router.post("/signIn", UserController.signIn)
router.post("/googleSignIn", UserController.googleSignIn)
router.get(
  "/signIn/callback",
  getAccessToken,
  getUserData,
  UserController.githubSignIn
)
router.delete("/:id", UserController.destroy)

module.exports = router
