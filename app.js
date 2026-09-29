const { mongoose } = require("mongoose");
const express = require("express");
const mainRouter = require("./routes/index");
const routes = require("./routes");
const cors = require("cors");

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {})
  .catch(console.error);

app.use((req, res, next) => {
  req.user = {
    _id: "5d8b8592978f8bd833ca8133",
  };
  next();
});

app.use(cors());
app.use(express.json());
app.use("/", mainRouter);

app.listen(PORT, () => {});
