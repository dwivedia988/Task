import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserSchemaModel from "../model/user.model.js";

const COOKIE_SECURE = process.env.COOKIE_SECURE === "true";

const sendTokenCookie = (res, user) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
  const cookieOptions = {
    httpOnly: true,
    secure: COOKIE_SECURE,
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  };
  res.cookie("token", token, cookieOptions);
};

export var register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    if (password.length < 6)
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });

    const existing = await UserSchemaModel.findOne({ email });
    if (existing)
      return res.status(409).json({ message: "Email already in use" });

    const hashed = await bcrypt.hash(password, 10);
    const user = new UserSchemaModel({ name, email, password: hashed });
    await user.save();

    return res.status(201).json({ message: "User created" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export var login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const user = await UserSchemaModel.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    sendTokenCookie(res, user);
    return res.json({
      message: "Logged in",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export var logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: COOKIE_SECURE,
    sameSite: "lax",
  });
  res.json({ message: "Logged out" });
};

export var me = async (req, res) => {
  try {
    const token =
      req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(200).json({ user: null });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserSchemaModel.findById(payload.id).select("-password");
    return res.json({ user });
  } catch (err) {
    return res.status(200).json({ user: null });
  }
};
