"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/app.ts
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const connectToMongoDB_1 = __importDefault(require("./db/connectToMongoDB"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const taskRoutes_1 = __importDefault(require("./routes/taskRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json()); // to parse the incoming requests with JSON payloads (from req.body)
app.use((0, cookie_parser_1.default)());
const port = process.env.PORT || 3000;
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.use("/api/auth", authRoutes_1.default);
app.use("/api/task", taskRoutes_1.default);
app.listen(port, () => {
    (0, connectToMongoDB_1.default)();
    console.log(`Server is running on port ${port}`);
});
