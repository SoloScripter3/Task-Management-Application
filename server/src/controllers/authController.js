import User from "../models/users.js";
import { otpGenerator, sendOtp } from "../utils/mailSender.js";
import redisClient, {
  setWithExpiry,
  getData,
  deleteData,
} from "../config/redisSetup.js";

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
    return res.status(500).json({ message: "server error" });
  }
};
