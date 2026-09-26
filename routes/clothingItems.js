const router = require("express").Router();

const {
  createItem,
  getItems,
  deleteItem,
  addLike,
  deleteLike,
} = require("../controllers/clothingItems");

router.post("/", createItem);
router.get("/", getItems);
router.delete("/", deleteItem);
router.put("/:itemId/likes", addLike);
router.delete("/:itemId/likes", deleteLike);

module.exports = router;
