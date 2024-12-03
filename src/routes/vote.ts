import { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

const validateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { userId, token } = req.body;

  if (!userId || token === undefined) {
    res.status(400).json({ error: 'userId e token são obrigatórios' });
    return;
  }

  const userToken = await prisma.token.findUnique({ where: { userId } });

  if (!userToken || userToken.value !== token) {
    res.status(401).json({ error: 'Token inválido' });
    return;
  }

  next();
};

router.post('/', validateToken, async (req: Request, res: Response): Promise<void> => {
  const { userId, filmId, directorId } = req.body;

  const existingVote = await prisma.vote.findUnique({ where: { userId } });

  if (existingVote) {
    res.status(400).json({ error: 'Usuário já votou' });
    return;
  }

  const film = await prisma.film.findUnique({ where: { id: filmId } });
  const director = await prisma.director.findUnique({ where: { id: directorId } });

  if (!film || !director) {
    res.status(400).json({ error: 'Filme ou Diretor inválido' });
    return;
  }

  await prisma.vote.create({
    data: {
      user: { connect: { id: userId } },
      film: { connect: { id: filmId } },
      director: { connect: { id: directorId } },
    },
  });

  res.json({ message: 'Voto registrado com sucesso' });
});

export default router;
