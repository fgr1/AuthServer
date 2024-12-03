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
const client_1 = require("@prisma/client");
const axios_1 = __importDefault(require("axios"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const iconv_lite_1 = __importDefault(require("iconv-lite"));
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const usersData = [
            { name: 'user1', password: 'password1' },
            { name: 'user2', password: 'password2' },
            { name: 'user3', password: 'password3' },
            { name: 'user4', password: 'password4' },
            { name: 'user5', password: 'password5' },
        ];
        for (const userData of usersData) {
            const hashedPassword = yield bcrypt_1.default.hash(userData.password, 10);
            yield prisma.user.create({
                data: {
                    name: userData.name,
                    password: hashedPassword,
                },
            });
        }
        const filmesResponse = yield axios_1.default.get('http://wecodecorp.com.br/ufpr/filme', {
            responseType: 'arraybuffer',
        });
        const filmesJson = iconv_lite_1.default.decode(Buffer.from(filmesResponse.data), 'utf-8');
        const filmes = JSON.parse(filmesJson);
        yield prisma.film.createMany({
            data: filmes.map((filme) => ({
                id: parseInt(filme.id),
                name: filme.nome,
                genre: filme.genero,
                posterUrl: filme.foto,
            })),
        });
        const diretoresResponse = yield axios_1.default.get('http://wecodecorp.com.br/ufpr/diretor', {
            responseType: 'arraybuffer',
        });
        const diretoresJson = iconv_lite_1.default.decode(Buffer.from(diretoresResponse.data), 'utf-8');
        const diretores = JSON.parse(diretoresJson);
        yield prisma.director.createMany({
            data: diretores.map((diretor) => ({
                id: parseInt(diretor.id),
                name: diretor.nome,
            })),
        });
    });
}
main()
    .catch((e) => console.error(e))
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
