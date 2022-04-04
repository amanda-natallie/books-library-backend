const router = require("express").Router();
const Book_model = require("../models/book");

router
  .post("/add/book", (req, res) => {
    const { book } = req.body;
    const newBook = new Book_model({
      book,
      email_: req.user.email,
      booked: false,
    });
    if (book == "") {
      res.redirect("/");
    }
    newBook
      .save()
      .then((book) => {
        res.redirect("/");
      })
      .catch((err) => console.log(err));
  })
  .get("/delete/book/:_id", (req, res) => {
    const { _id } = req.params;
    Book_model.deleteOne({ _id })
      .then(() => {
        console.log("deleted");
        res.redirect("/");
      })
      .catch((err) => console.log(err));
  })

  .get("/update/book/:_id", (req, res) => {
    const { _id } = req.params;
    const info = Book_model.find();
    console.log(info);
    Book_model.updateOne({ _id }, { booked: true })
      .then(() => {
        console.log("deleted");
        res.redirect("/");
      })
      .catch((err) => console.log(err));
  });

module.exports = router;
