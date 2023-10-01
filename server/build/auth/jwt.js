"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toData = exports.toToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secret = "lasdkfjhaviaeuyrf3fadsf8usv";
const toToken = (data) => {
    const token = jsonwebtoken_1.default.sign(data, secret, { expiresIn: "10 days" });
    return token;
};
exports.toToken = toToken;
const toData = (token) => {
    const data = jsonwebtoken_1.default.verify(token, secret);
    return data;
};
exports.toData = toData;
