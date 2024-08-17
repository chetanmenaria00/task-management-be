const jwt = require("jsonwebtoken");
const User = require("../models/user.model"); // Adjust the path if necessary

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET, // Ensure this environment variable is set
    { expiresIn: "1h" } // Token expiration time
  );
};

// Register user
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(200)
        .json({ code: 400, message: "User already exists" });
    }

    // Create new user
    const newUser = new User({ name, email, password });
    await newUser.save();

    // Generate token
    const token = generateToken(newUser);

    res.status(200).json({
      code: 201,
      message: "User Created",
      data: { token, user: newUser },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Authenticate user and log in
const authUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(200)
        .json({ code: 401, message: "Invalid email or password" });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res
        .status(200)
        .json({ code: 401, message: "Invalid email or password" });
    }

    // Generate token
    const token = generateToken(user);

    res.status(200).json({
      code: 200,
      message: "Success!",
      data: { token, user },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // Exclude password from response
    if (!user) {
      return res.status(200).json({ code: 404, message: "User not found" });
    }

    res.status(200).json({
      code: 200,
      message: "Invalid email or password",
      data: { user },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  registerUser,
  authUser,
  getUserProfile,
};
