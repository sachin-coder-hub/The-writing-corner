const { Router } = require("express");
const User = require("../models/user-model");

const router = Router();

router.get("/signin", function (req, res) {
  return res.render("signin");
});

router.get("/signup", function (req, res) {
  return res.render("signup");
});

router.get("/logout", function(req,res){     
  res.clearCookie("token").redirect("/")
})

router.post("/signin", async function (req, res) {
      const { email, password } = req.body;
try {
    const token = await User.matchPasswordAndGenToken(email, password);
    return res.cookie("token", token).redirect("/");
} catch (error) {
  res.render("signin", { error: "Incorrect Email or Password" });
}
});

router.post("/signup", async function (req, res) {
  const { fullname, email, password } = req.body;

  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("Email already in use.");
    }

    // Create a new user
    await User.create({
      fullname,
      email,
      password,
    });

    return res.redirect("/");
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error
      return res.status(400).send("Email already in use.");
    }

    // Handle other errors
    console.error(error);
    return res.status(500).send("An error occurred. Please try again.");
  }
});

module.exports = router;
