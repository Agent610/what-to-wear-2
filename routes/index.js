const router = require("express").Router();
const { NOT_FOUND } = require("../utils/errors");
const clothingItem = require("./clothingItems");

const userRouter = require("./users");

router.use("/items", clothingItem);
router.use("/users", userRouter);
router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "The page was not found" });
});

module.exports = router;
