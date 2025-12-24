import ArmyList from "../models/ArmyList.js";

// ➕ Crear lista
export const createArmyList = async (req, res) => {
  try {
    const armyList = new ArmyList({
      name: req.body.name,
      faction: req.body.faction,
      detachment: req.body.detachment,
      listText: req.body.listText,
      user: req.user._id,
    });

    await armyList.save();
    res.status(201).json(armyList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno" });
  }
};

// 📄 Obtener MIS listas
export const getMyArmyLists = async (req, res) => {
  try {
    const lists = await ArmyList.find({ user: req.user._id });
    res.json(lists);
  } catch (error) {
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
    res.status(500).json({ message: "Error interno" });
  }
};

// ✏️ Actualizar lista
export const updateArmyList = async (req, res) => {
  try {
    const updated = await ArmyList.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error interno" });
  }
};

// ❌ Eliminar lista
export const deleteArmyList = async (req, res) => {
  try {
    await ArmyList.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    res.json({ message: "Lista eliminada" });
  } catch (error) {
    res.status(500).json({ message: "Error interno" });
  }
};
