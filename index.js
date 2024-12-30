const express = require("express");
const path = require("path");
const userRoute = require("./routes/user");
const mongoose = require("mongoose");

const app = express();
const PORT = 8000;
mongoose
  .connect("mongodb://127.0.0.1:27017/the-writing-corner")
  .then(function () {
    console.log("DB Connected");
  })
  .catch(function (err) {
    console.log(err);
  });

app.set("views", path.resolve("./views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/user", userRoute);

app.get("/", function (req, res) {
  res.render("home");
});

app.listen(8000, () => {
  console.log("I am running");
});
