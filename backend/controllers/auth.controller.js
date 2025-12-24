// controllers/auth.controller.js
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";

// ✅ Registro
export const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Correo electrónico no válido" });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ message: "Password mínimo 6 caracteres" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({ email, password: hashed });
    await user.save();

    return res.status(201).json({ message: "Usuario registrado correctamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error interno" });
  }
};

// ✅ Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email y password son obligatorios" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Credenciales inválidas" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Credenciales inválidas" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    return res.json({
      token,
      user: { id: user._id, email: user.email },
    });
  } catch (error) {
    console.error("Error en login:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const me = (req, res) => {
  return res.json({ user: req.user });
};

// ✅ Forgot password: genera token, guarda hash + expira
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Respuesta "segura" (no revelar si existe o no)
    const genericMsg = "Si el correo existe, se envió un enlace de recuperación.";

    if (!email) return res.json({ message: genericMsg });

    const user = await User.findOne({ email });
    if (!user) return res.json({ message: genericMsg });

    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

    user.resetPasswordToken = tokenHash;
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 min
    await user.save();

    // Link al FRONT (Vite)
    const FRONT_URL = process.env.FRONT_URL || "http://localhost:5173";
    const resetUrl = `${FRONT_URL}/reset-password/${rawToken}`;

    // DEV: imprimir en consola
    console.log("🔑 Password reset link:", resetUrl);

    // DEV: devolver link para que lo veas en pantalla/console (en prod, enviar email)
    return res.json({ message: genericMsg, resetUrl });
  } catch (err) {
    console.error("forgotPassword:", err);
    return res.status(500).json({ message: "Error interno" });
  }
};

// ✅ Reset password: valida token y cambia password
export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: "Token y password son obligatorios" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password mínimo 6 caracteres" });
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: tokenHash,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ message: "Token inválido o expirado" });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return res.json({ message: "Contraseña actualizada. Ya puedes iniciar sesión." });
  } catch (err) {
    console.error("resetPassword:", err);
    return res.status(500).json({ message: "Error interno" });
  }
};
