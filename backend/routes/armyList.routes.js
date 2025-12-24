import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  createArmyList,
  getMyArmyLists,
  getArmyListById,
  updateArmyList,
  deleteArmyList,
} from "../controllers/armyList.controller.js";

const router = express.Router();

// CREAR
router.post("/", authMiddleware, createArmyList);

// OBTENER MIS LISTAS
router.get("/", authMiddleware, getMyArmyLists);

// OBTENER UNA
router.get("/:id", authMiddleware, getArmyListById);

// ACTUALIZAR
router.put("/:id", authMiddleware, updateArmyList);

// ELIMINAR
router.delete("/:id", authMiddleware, deleteArmyList);

export default router;
