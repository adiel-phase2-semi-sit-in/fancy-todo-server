const router = require("express").Router();
const { TodoController } = require("../controller");
const Authentication = require("../middlewares/authentication");
const Authorization = require("../middlewares/authorization");

router.use(Authentication);
router.get("/", TodoController.find);
router.post("/", TodoController.create);
router.get("/:id", Authorization, TodoController.findOne);
router.delete("/:id", Authorization, TodoController.delete);
router.put("/:id", Authorization, TodoController.update);
module.exports = router;
