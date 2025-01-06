require("dotenv").config()
const express = require("express");
const path = require("path");
const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");
const Blog = require("./models/blog-model");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { checkForAuthenticationCookie } = require("./middlewares/authenticate");

const app = express();
const PORT = process.env.PORT || 8000;
mongoose
  .connect(process.env.MONGO_URL)
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

app.listen(PORT, () => {
  console.log("I am running on",PORT);
});
