import User from "../models/userModel.js";
import { hashPassword, comparePassword } from "../utils/auth.js";
import JWT from "jsonwebtoken";
const JWT_EXPIRATION = { expiresIn: "1h" };

export const TokenValid = async (req, res) => {
  try {
    res.status(200).send({
      id: req.user.id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      email: req.user.email,
      phone: req.user.phone,
      role: req.user.role,
      profileImg: req.user.profileImg,
    });
  } catch (error) {
    res
      .status(500)
      .send({ error: "Something went wrong. Please try again later." });
  }
};

export const createNewUser = async (req, res) => {
  try {
    const { username, email, password, firstName, lastName, phone, role } =
      req.body;
    if (
      !username ||
      !password ||
      !email ||
      !firstName ||
      !lastName ||
      !phone ||
      !role
    ) {
      return res.status(400).send({
        error:
          "email ,username,password,firstName,lastName,phone and role are required",
      });
    }
    const existingUser = await User.findOne({
      $or: [{ username }, { email }, { phone }],
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "phone ,Username or email already exists" });
    }

    const hashedPassword = await hashPassword(password);
    const newUser = new User({
      firstName,
      lastName,
      phone,
      role,
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).send({
      status: "success",
      message: "User Succefully Regitered",
      data: newUser,
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

export const singInUser = async (req, res) => {
  const { username, email, phone, password } = req.body;
  if (!password || (!email && !username && !phone)) {
    return res
      .status(400)
      .send({ error: "email/username and password is required" });
  }
  try {
    const foundUser = await User.findOne({
      $or: [{ username }, { email }, { phone }],
    }).select("+password");
    if (!foundUser) {
      return res.status(404).send({ error: "user not found." });
    }

    const isAuth = await comparePassword(password, foundUser.password);
    if (!isAuth) {
      return res.status(401).send({ error: "Invalid password." });
    }
    const { id } = foundUser;
    const user = await User.findById(id);

    const token = JWT.sign(
      {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        userName: user.userName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profileImg: user.profileImg,
      },
      process.env.JWT_KEY,
      JWT_EXPIRATION
    );
    console.log(token);

    res.cookie("jwt", token, {
      httpOnly: false,
      secure: true,
      sameSite: "strict",
      maxAge: 3600000,
    });

    res.status(200).send({
      message: "Authentication successful",
      isAuth: true,
      token: token,
      user,
    });
  } catch (error) {
    console.error("Sign-in error:", error);
    res
      .status(500)
      .send({ error: "Something went wrong. Please try again later." });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { newUsername, newEmail, profileImg, newPassword, newPhone } =
      req.body;

    const existingUser = await User.findOne({
      $or: [{ username: newUsername }, { email: newEmail }],
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }
    const id = req.user._id;
    const updateData = {};
    if (newUsername) updateData.username = newUsername;
    if (newEmail) updateData.email = newEmail;
    if (newPassword) updateData.password = newPassword;
    if (profileImg) updateData.profileImg = profileImg;
    if (newPhone) updateData.newPhone = newPhone;

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    const user = await User.findById(id);
    console.log(user);

    try {
      const token = JWT.sign(
        {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          userName: user.userName,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
        process.env.JWT_KEY,
        JWT_EXPIRATION
      );

      res.cookie("jwt", token, {
        httpOnly: false,
        secure: true,
        sameSite: "strict",
        maxAge: 3600000,
      });

      res.status(201).send({
        message: "user updated successfully",
        updatedUser,
        token,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send("error creating token");
    }
  } catch (error) {
    console.error("Error updating user", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const id = req.user._id;
    const deleteUser = await User.findByIdAndDelete(id);
    res.status(200).send({
      message: "user deleted successfully",
      deleteUser,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Server error" });
  }
};
