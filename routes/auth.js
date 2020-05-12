const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const verify = require("../mailScript/verification");
const reset = require("../mailScript/reset");
const jwt = require("jsonwebtoken");
const config = require("config");
const jwtSecret = config.get("jwtSecret");
const auth = require("../middleware/auth");

router.post(
  "/register",
  [
    check("email", "Email is required").notEmpty(),
    check("email", "Email is incorrect ").isEmail(),
    check("name", "Name is required").notEmpty(),
    check("username", "Username is required").notEmpty(),
    check("password", "Password is Required").notEmpty(),
    check("password", "Password min length 6 characters").isLength({ min: 6 }),
  ],
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ error: error.array() });
    }
    const { email, name, username, password } = req.body;

    try {
      const user_email = await User.findOne({ email });
      if (user_email) {
        return res
          .status(400)
          .json({ error: [{ msg: "User already exists" }] });
      }

      const user_name = await User.findOne({ username });
      if (user_name) {
        return res.status(400).json({ error: [{ msg: "Username is taken" }] });
      }

      const otp = Math.floor(10000 + Math.random() * (1000000 - 100000));

      let newUser = new User({
        email,
        name,
        username,
        password,
        otp: otp.toString(),
      });

      const salt = await bcrypt.genSalt(10);
      newUser.password = await bcrypt.hash(password, salt);

      await newUser.save();
      await verify.mailverify(email, otp, name);
      res
        .status(200)
        .json({ success: [{ msg: "Verification email with OTP sent" }] });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: [{ msg: "Server Error" }] });
    }
  }
);

router.post(
  "/verify",
  [
    check("otp", "OTP is required").exists(),
    check("email", "Enter registered Email").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }
    const { email, otp } = req.body;
    const newotp = Math.floor(
      10000 + Math.random() * (1000000 - 100000)
    ).toString();
    try {
      let user = await User.findOne({ email }).select("-password");
      if (!user) {
        return res
          .status(400)
          .json({ error: [{ msg: "User does not exist" }] });
      }
      if (user.isVerified) {
        return res.status(400).json({
          error: [{ msg: "User already verified. Proceed to login" }],
        });
      }
      if (otp.localeCompare(user.otp)) {
        return res.status(400).json({ error: [{ msg: "OTP does not match" }] });
      }
      user.otp = newotp;
      user.isVerified = true;
      user.save();
      res.status(200).json({ success: [{ msg: "Email Verified" }] });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: [{ msg: "Server Error" }] });
    }
  }
);

router.post(
  "/forgot",
  [
    check("email", "Email is required").notEmpty(),
    check("email", "Email is incorrect ").isEmail(),
  ],
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ error: error.array() });
    }
    const { email } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: [{ msg: "Account not found" }] });
      }

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(user.otp, salt);
      user.password = hash;
      await reset.mailreset(email, user.otp, user.name);
      user.otp = Math.floor(
        10000 + Math.random() * (1000000 - 100000)
      ).toString();
      await user.save();

      return res.json(user);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: [{ msg: "Server Error" }] });
    }
  }
);

router.post(
  "/login",
  [
    check("email", "Email is required").notEmpty(),
    check("email", "Email is incorrect ").isEmail(),
    check("password", "Password is Required").notEmpty(),
  ],
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ error: error.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ error: [{ msg: "Invalid Credentials" }] });
      }

      if (!user.isVerified) {
        return res
          .status(400)
          .json({ error: [{ msg: "Verify Account before login" }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ error: [{ msg: "Invalid Credentials" }] });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: [{ msg: "Server Error" }] });
    }
  }
);

router.post(
  "/reset",
  [
    check("oldpassword", "Old Password is required").notEmpty(),
    check("newpassword", "New Password is required").notEmpty(),
  ],
  auth,
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ error: error.array() });
    }
    const { oldpassword, newpassword } = req.body;

    try {
      const user = await User.findById(req.user.id);
      const isMatch = await bcrypt.compare(oldpassword, user.password);
      if (isMatch) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newpassword, salt);
        user.save();
        res.status(200).json({ success: [{ msg: "Password Changed" }] });
      } else {
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: [{ msg: "Server Error" }] });
    }
  }
);

router.get("/user", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("team").populate("personal");
    if (!user) {
      res.status(400).json({ error: [{ msg: "User not found" }] });
    }
    console.log(typeof user.personal[0]);

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: [{ msg: "Server Error" }] });
  }
});

module.exports = router;
