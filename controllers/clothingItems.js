const ClothingItem = require("../models/clothingItem");
const {
  SUCCESS,
  BAD_REQUEST,
  NOT_FOUND,
  DEFAULT,
  REQUEST_DENIED,
} = require("../utils/errors");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      res.send({ data: item });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res
          .status(BAD_REQUEST)
          .send({ message: "Bad request, validation error" });
      }
      res.status(DEFAULT).send({ message: "Default" });
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) =>
      res
        .status(SUCCESS)
        .send({ message: "Item was found successfully", items })
    )
    .catch(() => {
      res.status(DEFAULT).send({ message: "Default" });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => {
      if (String(item.owner) !== req.user._id) {
        return res
          .status(REQUEST_DENIED)
          .send({ message: "You can't delete item" });
      }
      return item
        .deleteOne()
        .then(() => res.status(SUCCESS).send({ message: "Item was deleted" }));
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        res.status(NOT_FOUND).send({ message: "Item was not found" });
      } else if (err.name === "CastError") {
        res
          .status(BAD_REQUEST)
          .send({ message: "Search resulted in a bad request" });
      }

      res.status(DEFAULT).send({ message: "Default" });
    });
};

const addLike = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return res.status(NOT_FOUND).send({ message: "Error not found" });
      }
      return res.send(item);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Bad request" });
      }
      return res.status(DEFAULT).send({ message: "Default" });
    });
};

const deleteLike = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return res.status(NOT_FOUND).send({ message: "Error not found" });
      }
      return res.send(item);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Bad Request" });
      }
      return res.status(DEFAULT).send({ message: "Default" });
    });
};

module.exports = { createItem, getItems, deleteItem, addLike, deleteLike };
