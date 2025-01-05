const { Router } = require("express");
const multer = require("multer");
const path = require("path");
const Blog = require("../models/blog-model");

const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads/`));
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

router.get("/addblog", function (req, res) {
  return res.render("addblog", { user: req.user });
});
router.post("/", upload.single("coverImg"), async function (req, res) {
  const {title, body}  = req.body
  const blog = await Blog.create({
    body,
    title,
    createdBy:req.user._id,
    coverImgUrl:`/uploads/${req.file.filename}`
  })
  return res.redirect(`/blog/${req.user._id}`);
});

module.exports = router;
