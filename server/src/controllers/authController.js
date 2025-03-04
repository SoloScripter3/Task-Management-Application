import User from "../models/users.js";
import { otpGenerator, sendOtp } from "../utils/mailSender.js";
import bcrypt from "bcryptjs";
import redisClient, {
  setWithExpiry,
  getData,
  deleteData,
} from "../config/redisSetup.js";
import jwt from "jsonwebtoken";

//registration business logic
export const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    //checking whether there is existing user or not
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "user already exist" });
    }

    //hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //generating otp and sending to the email
    const otp = otpGenerator();
    await sendOtp(email, otp);

    //store the otp and credentials in redis temporarily
    await setWithExpiry(email, { email, password: hashedPassword, otp }, 300);

    return res.status(200).json({ message: "otp sent successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "server error" });
  }
};

//business logic for the verification otp
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    //getting the data from the redis
    const userData = await getData(email);
    if (!userData) {
      return res.status(400).json({ message: "otp is expired or invalid" });
    }

    //verifying the otp
    if (userData.otp !== otp) {
      return res.status(400).json({ message: "Invalid otp" });
    }

    //if otp is correct the ncreating the user in database
    const newUser = new User({
      email: userData.email,
      password: userData.password,
    });
    await newUser.save();

    //after saving into the database delete the data from redis
    await deleteData(email);

    return res.status(201).json({ message: "user registered successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "server error" });
  }
};

//business logic for the login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const loginData = await User.find({ email });
    if (!loginData) {
      return res.status(400).json({ message: "User not exist" });
    }
    const isMatch = await bcrypt.compare(password, loginData[0].password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: loginData[0]._id }, process.env.SECRET, {
      expiresIn: "24h",
    });
    return res.status(200).json({ token });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "server error" });
  }
};
