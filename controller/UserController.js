const User = require("../model/userModel");
// console.log("Debug - 2.2 -> User Controller Called");

exports.signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const newUser = await User.create({
      username,
      email,
      password,
      role: "user",
    });
    const createdUser = await User.findById(newUser._id).select("-password");

    if (!createdUser) {
      return res.status(500).json({ message: "Failed to create user" });
    }
    res.status(200).json({ user: createdUser, message: "Signup successful" });
  } catch (error) {
    next(error);
  }
};

exports.signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password || email === "" || password === "") {
      return res.status(400).json({ message: "All fields are required" });
    }

    const validUser = await User.findOne({ email });
    if (!validUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const validPassword = await validUser.isPasswordCorrect(password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = validUser.generateAccessToken();
    const { password: pass, ...rest } = validUser._doc;

    const cookieOptions = {
      httpOnly: true,
      sameSite: "Strict", // Helps prevent CSRF attacks
    };
    if (process.env.NODE_ENV === "production") {
      cookieOptions.secure = true;
    }

    res
      .status(200)
      .cookie("accessToken", token, cookieOptions)
      .json({ user: rest, message: "Sign In Successfully" });
  } catch (error) {
    next(error);
  }
};

exports.signout = (req, res, next) => {
  try {
    res
      .clearCookie("accessToken")
      .status(200)
      .json({ message: "User has been signed out" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error Signing Out User!", error: error.message });
  }
};

exports.google = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;
  try {
    let user = await User.findOne({ email }).select("-password");
    if (user) {
      const token = user.generateAccessToken();
      return res
        .status(200)
        .cookie("accessToken", token, {
          httpOnly: true,
        })
        .json({ user, message: "User sign-in successful" });
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);

      const newUser = new User({
        username:
          name.toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-4),
        email,
        password: generatedPassword,
        profilePicture: googlePhotoUrl,
        role: "user",
      });

      await newUser.save();
      user = await User.findById(newUser._id).select("-password");

      const token = user.generateAccessToken();

      return res
        .status(200)
        .cookie("accessToken", token, {
          httpOnly: true,
        })
        .json({ user, message: "User sign-up successful" });
    }
  } catch (error) {
    next(error);
  }
};

// console.log("Debug - 2.2 -> User Controller Called");
exports.getAllUsers = async (req, res) => {};
// console.log("Debug - 2.2 -> User Controller Called");
exports.getUserById = async (req, res) => {};
// console.log("Debug - 2.2 -> User Controller Called");
exports.updateUser = async (req, res) => {};
// console.log("Debug - 2.2 -> User Controller Called");
exports.deleteUser = async (req, res) => {};
// console.log("Debug - 2.2 -> User Controller Called");
exports.changePassword = async (req, res) => {};
// console.log("Debug - 2.2 -> User Controller Called");
exports.forgotPassword = async (req, res) => {};
// console.log("Debug - 2.2 -> User Controller Called");
exports.resetPassword = async (req, res) => {};
// console.log("Debug - 2.2 -> User Controller Called");