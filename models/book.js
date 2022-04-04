const mongoose = require("mongoose");
const Bookschema = new mongoose.Schema({
  book: {
    type: String,
    required: true,
  },
  email_: {
    type: String,
    required: true,
  },
  booked: {
    type: String,
    required: true,
  },
});

module.exports = new mongoose.model("Book", Bookschema);
