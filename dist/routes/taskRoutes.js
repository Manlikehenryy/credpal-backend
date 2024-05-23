"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const task_controller_1 = require("../controllers/task.controller");
const protectRoute_1 = __importDefault(require("../middleware/protectRoute"));
const router = express_1.default.Router();
router.post("/", protectRoute_1.default, task_controller_1.addTask);
router.get("/", protectRoute_1.default, task_controller_1.getAllTasks);
router.put("/:id", protectRoute_1.default, task_controller_1.updateTask);
router.delete("/:id", protectRoute_1.default, task_controller_1.deleteTask);
exports.default = router;
