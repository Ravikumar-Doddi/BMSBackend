const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const EmailHelper = require("../utils/emailHelper");
const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const createUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.send({
        message: "User already exists with this email",
        success: false,
      });
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = await new User({
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    res.send({
      message: "User registered successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.send({
      message: "Error registering user",
      success: false,
      error: error.message,
    });
  }
};

const logInUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.send({
        message: "User not found",
        success: false,
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("isMatch", isMatch);
    if (!isMatch) {
      return res.send({
        message: "Invalid password",
        success: false,
      });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });

    res.send({
      message: "User logged in successfully",
      success: true,
      // data: user,
      data: token,
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.send({
      message: "Error logging in user",
      success: false,
      error: error.message,
    });
  }
};

const currentUser = async (req, res) => {
  const user = await User.findById(req.body.id).select("-password");
  if (!user) {
    return res.status(404).send({
      message: "User not found",
      success: false,
    });
  }
  res.send({
    message: "User fetched successfully",
    success: true,
    data: user,
  });
};
const generateOtp = () => {
  const otp = Math.floor(Math.random() * 100000) + 90000;
  return otp;
};
const forgotPassword = async (req, res) => {
  console.log(req.body);
  try {
    //1. you can ask for email
    //2. check if the email exists
    //2.1 if it exists, create an OTP and send it to the user email
    //2.2 if it does not exist, send a response that it does not exist
    //3 generate an OTP and expiry store it in the database corresponding to the user email
    //4. res with otp.
    //5. send the otp to the user email
    if (req.body.email === undefined) {
      return res.send({
        success: false,
        message: "Email is required",
      });
    }
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res.send({
        success: false,
        message: "User with Email does not exist",
      });
    }
    const otp = generateOtp();
    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;
    await user.save();
    await EmailHelper(
      "otp.html",
      user.email,
      { name: user.username, otp: user.otp },
      "OTP for BookMyShowClone"
    );

    // Only send success if email sending worked
    res.send({
      success: true,
      message: "OTP sent to your email",
    });
  } catch (err) {
    res.send({
      success: false,
      message: err.message,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const resetDetails = req.body;
    console.log(resetDetails);
    if (!resetDetails.otp || !resetDetails.password) {
      return res.send({
        success: false,
        message: "OTP, and password are required",
      });
    }
    const user = await userModel.findOne({ otp: resetDetails.otp });
    if (!user) {
      return res.send({
        success: false,
        message: "Invalid OTP",
      });
    }
    if (user.otpExpiry < Date.now()) {
      return res.send({
        success: false,
        message: "OTP has expired",
      });
    }
    user.otp = undefined;
    user.password = resetDetails.password;
    await user.save();
    res.send({
      success: true,
      message: "Password reset successfully",
    });
  } catch (err) {
    res.send({
      success: false,
      message: err.message,
    });
  }
};
module.exports = {
  createUser,
  logInUser,
  currentUser,
  forgotPassword,
  resetPassword,
};
