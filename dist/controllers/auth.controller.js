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
exports.signOut = exports.signIn = exports.signUp = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const generateToken_1 = __importDefault(require("../utils/generateToken"));
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, username, password, confirmPassword } = req.body;
        if (firstName == undefined || firstName == "" || lastName == '' || lastName == undefined || username == '' || username == undefined || password == '' || password == undefined || confirmPassword == '' || confirmPassword == undefined) {
            return res.status(400).json({ status: "failed", error: "Missing required field(s)" });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ status: "failed", error: "Passwords don't match" });
        }
        const user = yield user_model_1.default.findOne({ username });
        if (user) {
            return res.status(400).json({ status: "failed", error: "Username already exists" });
        }
        // HASH PASSWORD HERE
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        const newUser = new user_model_1.default({
            firstName,
            lastName,
            username,
            password: hashedPassword,
        });
        if (newUser) {
            // Generate JWT token here
            (0, generateToken_1.default)(newUser._id, res);
            yield newUser.save();
            res.status(201).json({ status: "success", data: {
                    _id: newUser._id,
                    firstName: newUser.firstName,
                    lastName: newUser.lastName,
                    username: newUser.username,
                } });
        }
        else {
            res.status(400).json({ status: "failed", error: "Invalid user data" });
        }
    }
    catch (error) {
        console.log("Error in signup controller", error instanceof Error ? error.message : error);
        res.status(500).json({ status: "failed", error: "Internal Server Error" });
    }
});
exports.signUp = signUp;
const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        if (username == '' || username == undefined || password == '' || password == undefined) {
            return res.status(400).json({ status: "failed", error: "Missing required field(s)" });
        }
        const user = yield user_model_1.default.findOne({ username });
        const isPasswordCorrect = yield bcryptjs_1.default.compare(password, (user === null || user === void 0 ? void 0 : user.password) || "");
        if (!user || !isPasswordCorrect) {
            return res.status(400).json({ status: "failed", error: "Invalid username or password" });
        }
        (0, generateToken_1.default)(user._id, res);
        res.status(200).json({ status: "success", data: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
            } });
    }
    catch (error) {
        console.log("Error in login controller", error instanceof Error ? error.message : error);
        res.status(500).json({ status: "failed", error: "Internal Server Error" });
    }
});
exports.signIn = signIn;
const signOut = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ status: "success", message: "Logged out successfully" });
    }
    catch (error) {
        console.log("Error in logout controller", error instanceof Error ? error.message : error);
        res.status(500).json({ status: "failed", error: "Internal Server Error" });
    }
};
exports.signOut = signOut;
