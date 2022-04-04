const router = require("express").Router();
const Book_model = require("../models/book");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

router.get("/", ensureGuest, (req, res) => {
  res.render("login");
});

router.get("/log", ensureAuth, async (req, res) => {
  // const alldata =await Book_model.find();
  const user = await Book_model.find({ email_: req.user.email });
  res.render("index", { book: user, userinfo: req.user });
});
module.exports = router;
