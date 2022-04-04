import { v4 as uuidv4 } from "uuid";
import User from "../user/userSchema.mjs";
import Book from "./bookSchema.mjs";

export default {
  async create(req, res, next) {
    console.info("bookService.create", req.body);
    try {
      const { name, image, description } = req.body;

      if (!name)
        return res.status(400).json({ msg: "the book name is required!" });

      const bookData = {
        _id: uuidv4(),
        name,
        image,
        description,
      };
      const book = await Book.create(bookData);
      return res.status(200).json(book);
    } catch (err) {
      next(err);
    }
  },
  async booked(req, res, next) {
    try {
      const { userId, bookId } = req.params;

      if (!userId) return res.status(400).json({ msg: "userId is required!" });
      if (!bookId) return res.status(400).json({ msg: "bookId is required!" });

      const { booked } = req.body;
      if (booked === undefined)
        return res.status(400).json({ msg: "booked is required!" });

      const user = await User.findOne({ _id: userId });

      if (!user) {
        return res.status(400).json({ msg: "user not found" });
      } else {
        await Book.updateOne(
          { _id: bookId },
          {
            booked,
            bookedBy: booked
              ? {
                  id: user._id,
                  name: `${user.firstName} ${user.lastName}`,
                  email: user.email,
                  profilePhoto: user.profilePhoto,
                }
              : {},
          }
        );
        return res
          .status(200)
          .json(
            booked
              ? { msg: `booked by ${user.firstName} ${user.lastName}` }
              : { msg: "" }
          );
      }
    } catch (err) {
      next(err);
    }
  },
  async listBookFree(req, res, next) {
    try {
      const books = await Book.find({
        booked: false,
      });
      return res.status(200).json(books);
    } catch (err) {
      next(err);
    }
  },
  async listBooked(req, res, next) {
    try {
      const books = await Book.find({
        booked: true,
      });
      return res.status(200).json(books);
    } catch (err) {
      next(err);
    }
  },
  async delete(req, res, next) {
    try {
      const userId = req.params.userId;
      await User.deleteOne({ _id: userId });
      return res.status(200).json({ msg: "User deleted" });
    } catch (err) {
      next(err);
    }
  },
};
