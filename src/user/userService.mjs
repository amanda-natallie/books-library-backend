import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import User from "./userSchema.mjs";

export default {
  async create(req, res, next) {
    console.log("req.body: ", req.body);
    try {
      const { firstName, lastName, profilePhoto, email, password } = req.body;
      if (!firstName)
        return res.status(400).json({ msg: "firstName is required!" });
      if (!lastName)
        return res.status(400).json({ msg: "lastName is required!" });
      if (!email) return res.status(400).json({ msg: "email is required!" });
      if (!password)
        return res.status(400).json({ msg: "password is required!" });

      const userCheck = await User.exists({ email });
      if (userCheck) {
        return res.status(409).json({
          msg: "user alread exists",
        });
      }

      const userData = {
        _id: uuidv4(),
        firstName,
        lastName,
        profilePhoto,
        email,
        password,
      };
      const user = await User.create(userData);

      return res.status(200).json({
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePhoto: user.profilePhoto,
        lastVisited: user.lastVisited,
        email: user,
        email,
        created_at: user.created_at,
      });
    } catch (err) {
      next(err);
    }
  },
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user) return res.status(401).json({ msg: "Invalid credentials" });
      if (user.password !== password)
        return res.status(401).json({ msg: "Invalid credentials" });

      const token = jwt.sign({ user }, process.env.TOKEN_SECRET_KEY, {
        expiresIn: process.env.TOKEN_EXPIRATION_TIME,
      });
      const refreshToken = jwt.sign(
        { user },
        process.env.REFRESHTOKEN_SECRET_KEY,
        { expiresIn: process.env.REFRESHTOKEN_EXPIRATION_TIME }
      );

      await User.updateOne(
        { user: user._id },
        {
          token,
          refresh_token: refreshToken,
          lastVisited: new Date(),
        }
      );

      return res.status(200).json({
        accessToken: token,
        expiresIn: process.env.TOKEN_EXPIRATION_TIME,
        refreshToken,
        refreshTokenExpiresIn: process.env.REFRESHTOKEN_EXPIRATION_TIME,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          profilePhoto: user.profilePhoto,
          lastVisited: new Date(),
          email: user,
          email,
          created_at: user.created_at,
        },
      });
    } catch (err) {
      next(err);
    }
  },
  async list(req, res, next) {
    try {
      const user = await User.find();
      return res.status(200).json(user);
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
