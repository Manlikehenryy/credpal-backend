"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.getAllTasks = exports.addTask = void 0;
const task_model_1 = __importDefault(require("../models/task.model"));
// interface CustomRequest extends Request {
//     user?: any; // Adjust the type according to your user object type
//   }
const addTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description } = req.body;
        if (title == undefined || title == "" || description == '' || description == undefined) {
            return res.status(400).json({ status: "failed", error: "Missing required field(s)" });
        }
        const newTask = new task_model_1.default({
            title,
            description,
            user: req.user._id
        });
        if (newTask) {
            yield newTask.save();
            res.status(201).json({ status: "success", data: newTask });
        }
        else {
            res.status(400).json({ status: "failed", error: "Invalid task data" });
        }
    }
    catch (error) {
        console.log("Error in addTask controller", error instanceof Error ? error.message : error);
        res.status(500).json({ status: "failed", error: "Internal Server Error" });
    }
});
exports.addTask = addTask;
const getAllTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tasks = yield task_model_1.default.find({ user: req.user._id }).sort({ createdAt: -1 });
        if (!tasks) {
            res.status(404).json({ status: "success", message: "No tasks were found" });
        }
        res.status(200).json({ status: "success", data: tasks });
    }
    catch (error) {
        console.error("Error in getAllTasks: ", error instanceof Error ? error.message : error);
        res.status(500).json({ status: "failed", error: "Internal server error" });
    }
});
exports.getAllTasks = getAllTasks;
const updateTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { title, description } = req.body;
        if (title == undefined || title == "" || description == '' || description == undefined) {
            return res.status(400).json({ status: "failed", error: "Missing required field(s)" });
        }
        var updatedTask = null;
        updatedTask = yield task_model_1.default.findOneAndUpdate({ _id: id }, { title, description }, { new: true });
        if (!updatedTask) {
            res.status(404).json({ status: "success", message: "No task was found" });
        }
        res.status(200).json({ status: "success", data: updatedTask });
    }
    catch (error) {
        console.error("Error in updateTask: ", error instanceof Error ? error.message : error);
        res.status(500).json({ status: "failed", error: "Internal server error" });
    }
});
exports.updateTask = updateTask;
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedTask = yield task_model_1.default.findOneAndDelete({ _id: id, user: req.user._id });
        if (!deletedTask) {
            res.status(404).json({ status: "success", message: "No task was found" });
        }
        res.status(200).json({ status: "success", data: deletedTask });
    }
    catch (error) {
        console.error("Error in deleteTask: ", error instanceof Error ? error.message : error);
        res.status(500).json({ status: "failed", error: "Internal server error" });
    }
});
exports.deleteTask = deleteTask;
