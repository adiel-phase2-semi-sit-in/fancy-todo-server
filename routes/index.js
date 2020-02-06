const router = require("express").Router();
const userRoutes = require("./user");
const todoRoutes = require("./todo");

router.get("/", function(req, res) {
  res.status(200).json({
    message: "Welcome to fancy-todo API"
  });
});
router.use("/users", userRoutes);
router.use("/todos", todoRoutes);
module.exports = router;
