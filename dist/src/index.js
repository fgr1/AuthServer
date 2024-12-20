"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("./routes/auth"));
const vote_1 = __importDefault(require("./routes/vote"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use('/auth', auth_1.default);
app.use('/vote', vote_1.default);
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
app.get('/test', (req, res) => {
    res.send('Server is running');
});
