import nodemailer from "nodemailer";

//creating a transporter to define type of service
const transporter = nodemailer.createTransport({
  service: "gmail",
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
    text: `${process.env.TEXT}${otp}`,
  };

  await transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
};
