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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = void 0;
const jwt_1 = require("./jwt");
const AuthMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Get the headers
    const headers = req.headers;
    // Check if the authorization key is in the headers and if the token is provided correctly
    if (headers["authorization"] && // Is the header there
        headers["authorization"].split(" ")[0] === "Bearer" && // Is the first word (before the space) equal to "Bearer"
        headers["authorization"].split(" ")[1] // Is there a part after the space
    ) {
        // get the token
        const token = headers["authorization"].split(" ")[1];
        try {
            // Verify the token, this will throw an error if it isn't
            const data = (0, jwt_1.toData)(token);
            req.userId = data.userId;
            // If we reach this point the token was correct!
            // If successful, we call the actual route
            next();
        }
        catch (e) {
            res.status(401).send({ message: "Token missing or not valid" });
            return;
        }
    }
    else {
        res.status(401).send({ message: "Token missing or not valid" });
        return;
    }
});
exports.AuthMiddleware = AuthMiddleware;
