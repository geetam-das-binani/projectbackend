import { compareSync } from "bcrypt";
import { UserModel } from "../../model/admin/userModel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import cookieParser from "cookie-parser";

export const userLoginController = async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res.status(402).json({ message: "Fill all details" });
    }

    const user = await UserModel.findOne({ username: username });

    if (!user) {
      return res.status(402).json({ message: "User not found" });
    }

    const isPasswordCorrect = bcrypt.compareSync(password,user.password)


    if (!isPasswordCorrect) {
      return res.status(403).json({ message: "Incorrect Password" });
    }

    const payload = {
        username,
        id:user._id
    }

    if(isPasswordCorrect){
         jwt.sign(
           payload,
           "secret",
           { expiresIn: "1d"},
           async (err, token) => {
             if (err) {
               return res.status(400).json(err);
             } 
               return res
                 .status(200)
                 .cookie("token", token, { httpOnly: true, expiresIn:'15m' })
                 .json({
                   id: user._id,
                   username,
                   token
                 });
             
           }
         );
    }
  } catch (err) {
    res
      .status(401)
      .json({ message: "there is an error in logging in", error: err });
  }
};
export const getLoggedInUserDetails = async (req, res) => {
  try {
    const existingUser = await UserModel.findById(req.user);
    if (!existingUser) {
      return res.status(400).json({ message: "user not found" });
    }

    return res
      .status(200)
      .json({ id: existingUser._id, username: existingUser.username });
  } catch (error) {
    res
      .status(401)
      .json({ message: "there is an error in logging in", error: err });
  }
};

