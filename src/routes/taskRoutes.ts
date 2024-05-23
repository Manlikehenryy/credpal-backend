import express from "express";
import {
  addTask,
  getAllTasks,
  updateTask,
  deleteTask,
} from "../controllers/task.controller";
import protectRoute from "../middleware/protectRoute";

const router = express.Router();

router.post("/", protectRoute, addTask);

router.get("/", protectRoute, getAllTasks);

router.put("/:id", protectRoute, updateTask);

router.delete("/:id", protectRoute, deleteTask);

export default router;
