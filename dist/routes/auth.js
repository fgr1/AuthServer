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
const express_1 = require("express");
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, password } = req.body;
    const user = yield prisma.user.findUnique({
        where: { name: req.body.name }
    });
    if (!user) {
        res.status(401).json({ error: 'Credenciais inválidas' });
        return;
    }
    const passwordMatch = yield bcrypt_1.default.compare(password, user.password);
    if (!passwordMatch) {
        res.status(401).json({ error: 'Credenciais inválidas' });
        return;
    }
    let tokenValue;
    const existingToken = yield prisma.token.findUnique({ where: { userId: user.id } });
    if (existingToken) {
        tokenValue = existingToken.value;
    }
    else {
        tokenValue = Math.floor(Math.random() * 101);
        yield prisma.token.create({
            data: {
                value: tokenValue,
                user: { connect: { id: user.id } },
            },
        });
    }
    res.json({ message: 'Autenticado com sucesso', token: tokenValue });
}));
exports.default = router;
