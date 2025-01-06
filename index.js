const express = require("express");
const path = require("path");
const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");
const Blog = require("./models/blog-model");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { checkForAuthenticationCookie } = require("./middlewares/authenticate");

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
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));

app.use("/user", userRoute);
app.use("/blog", blogRoute);

app.get("/", async function (req, res) {
  const blogs = await Blog.find({});
  res.render("home", { user: req.user, blogs: blogs });
});

app.listen(8000, () => {
  console.log("I am running");
});
