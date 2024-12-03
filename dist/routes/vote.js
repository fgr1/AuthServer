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
const express_1 = require("express");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
const validateToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, token } = req.body;
    if (!userId || token === undefined) {
        res.status(400).json({ error: 'userId e token são obrigatórios' });
        return;
    }
    const userToken = yield prisma.token.findUnique({ where: { userId } });
    if (!userToken || userToken.value !== token) {
        res.status(401).json({ error: 'Token inválido' });
        return;
    }
    next();
});
router.post('/', validateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, filmId, directorId } = req.body;
    const existingVote = yield prisma.vote.findUnique({ where: { userId } });
    if (existingVote) {
        res.status(400).json({ error: 'Usuário já votou' });
        return;
    }
    const film = yield prisma.film.findUnique({ where: { id: filmId } });
    const director = yield prisma.director.findUnique({ where: { id: directorId } });
    if (!film || !director) {
        res.status(400).json({ error: 'Filme ou Diretor inválido' });
        return;
    }
    yield prisma.vote.create({
        data: {
            user: { connect: { id: userId } },
            film: { connect: { id: filmId } },
            director: { connect: { id: directorId } },
        },
    });
    res.json({ message: 'Voto registrado com sucesso' });
}));
exports.default = router;
