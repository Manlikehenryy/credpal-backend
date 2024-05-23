"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateTokenAndSetCookie = (userId, res) => {
    const secret = process.env.JWT_SECRET;
    var token = '';
    if (secret) {
        token = jsonwebtoken_1.default.sign({ userId }, secret, {
            expiresIn: "3d",
        });
    }
    res.cookie("jwt", token, {
        maxAge: 3 * 24 * 60 * 60 * 1000, // MS
        httpOnly: true, // prevent XSS attacks cross-site scripting attacks
        sameSite: "strict", // CSRF attacks cross-site request forgery attacks
        secure: process.env.NODE_ENV !== "development",
    });
};
exports.default = generateTokenAndSetCookie;
