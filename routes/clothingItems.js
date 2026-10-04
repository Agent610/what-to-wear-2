const router = require("express").Router();
const auth = require("../middlewares/auth");

const {
  createItem,
  getItems,
  deleteItem,
  addLike,
  deleteLike,
} = require("../controllers/clothingItems");

router.post("/", createItem);
router.get("/", getItems);
router.delete("/", auth, deleteItem);
router.put("/:itemId/likes", auth, addLike);
router.delete("/:itemId/likes", auth, deleteLike);

module.exports = router;
