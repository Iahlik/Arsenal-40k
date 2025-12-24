import express from "express";
import ArmyList from "../models/ArmyList.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// CREAR
router.post("/", authMiddleware, async (req, res) => {
  try {
    const list = new ArmyList({
      ...req.body,
      user: req.user._id,
    });

    await list.save();
    res.status(201).json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al guardar la lista" });
  }
});

// OBTENER MIS LISTAS
router.get("/", authMiddleware, async (req, res) => {
  const lists = await ArmyList.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(lists);
});

// ELIMINAR
router.delete("/:id", authMiddleware, async (req, res) => {
  await ArmyList.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });
  res.json({ message: "Lista eliminada" });
});

export default router;
