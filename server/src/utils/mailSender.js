import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

console.log("Email credentials:", {
  email: process.env.EMAIL,
  password: process.env.PASSWORD ? "Password exists" : "Password missing",
});

//creating a transporter to define type of service
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

//otp generator
export const otpGenerator = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

//Send otp to the email given by the user
export const sendOtp = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: process.env.SUBJECT,
    html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f7f7f7;">
          <h2 style="color: #333;">Task Management App</h2>
          <p>Your verification code is:</p>
          <h1 style="background-color: #eaeaea; padding: 10px; text-align: center; letter-spacing: 5px;">${otp}</h1>
          <p>This code will expire in 5 minutes.</p>
          <p>If you did not request this code, please ignore this email.</p>
        </div>
      `,
  };

  await transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
};
