import ArmyList from "../models/ArmyList.js";

// ➕ Crear lista
export const createArmyList = async (req, res) => {
  try {
    const {
      name,
      faction,
      detachment,
      points,
      listText,
      content,
    } = req.body;

    const parsedPoints = Number(points ?? 0);

    // Validación de puntos
    if (isNaN(parsedPoints) || parsedPoints < 0 || parsedPoints > 3000) {
      return res.status(400).json({
        message: "Los puntos deben estar entre 0 y 3000",
      });
    }

    const armyList = new ArmyList({
      name,
      faction,
      detachment,
      points: parsedPoints,
      listText: listText ?? content ?? "",
      user: req.user._id,
    });

    await armyList.save();

    res.status(201).json(armyList);
  } catch (error) {
    console.error("Error al crear lista:", error);
    res.status(500).json({ message: "Error interno" });
  }
};

// 📄 Obtener MIS listas
export const getMyArmyLists = async (req, res) => {
  try {
    const lists = await ArmyList.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.json(lists);
  } catch (error) {
    console.error("Error al obtener listas:", error);
    res.status(500).json({ message: "Error interno" });
  }
};

// 🔍 Obtener una lista por ID
export const getArmyListById = async (req, res) => {
  try {
    const list = await ArmyList.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!list) {
      return res.status(404).json({ message: "Lista no encontrada" });
    }

    res.json(list);
  } catch (error) {
    console.error("Error al obtener lista:", error);
    res.status(500).json({ message: "Error interno" });
  }
};

// ✏️ Actualizar lista
export const updateArmyList = async (req, res) => {
  try {
    if (req.body.points !== undefined) {
      const parsedPoints = Number(req.body.points);
      if (isNaN(parsedPoints) || parsedPoints < 0 || parsedPoints > 3000) {
        return res.status(400).json({
          message: "Los puntos deben estar entre 0 y 3000",
        });
      }
      req.body.points = parsedPoints;
    }

    if (req.body.content && !req.body.listText) {
      req.body.listText = req.body.content;
      delete req.body.content;
    }

    const updated = await ArmyList.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Lista no encontrada" });
    }

    res.json(updated);
  } catch (error) {
    console.error("Error al actualizar lista:", error);
    res.status(500).json({ message: "Error interno" });
  }
};

// ❌ Eliminar lista
export const deleteArmyList = async (req, res) => {
  try {
    const deleted = await ArmyList.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Lista no encontrada" });
    }

    res.json({ message: "Lista eliminada" });
  } catch (error) {
    console.error("Error al eliminar lista:", error);
    res.status(500).json({ message: "Error interno" });
  }
};
