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

router.post('/', async (req: Request, res: Response): Promise<void> => {
  const { userId, token, filmId, directorId } = req.body;

  if (!userId || token === undefined || !filmId || !directorId) {
    res.status(400).json({ error: 'userId, token, filmId e directorId são obrigatórios' });
  }

  try {
    const existingVote = await prisma.vote.findUnique({ where: { userId } });

    if (existingVote) {
      res.status(400).json({ error: 'Usuário já registrou votos' });
    }

    await prisma.vote.create({
      data: {
        userId,
        filmId,
        directorId,
      },
    });

    res.status(201).json({ message: 'Voto registrado com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao registrar voto' });
  }
});


router.get('/check', async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.query;

  if (!userId) {
    res.status(400).json({ error: 'O userId é obrigatório.' });
  }

  try {
    const vote = await prisma.vote.findUnique({
      where: { userId: Number(userId) },
    });

    if (vote) {
      res.json({ hasVoted: true });
    } else {
      res.json({ hasVoted: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao verificar votos.' });
  }
});



export default router;
