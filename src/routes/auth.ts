import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const router = Router();
const prisma = new PrismaClient();

router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { name, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { name: req.body.name }
  });
  
  if (!user) {
    res.status(401).json({ error: 'Credenciais inválidas' });
    return;
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    res.status(401).json({ error: 'Credenciais inválidas' });
    return;
  }

  let tokenValue: number;
  const existingToken = await prisma.token.findUnique({ where: { userId: user.id } });

  if (existingToken) {
    tokenValue = existingToken.value;
  } else {
    tokenValue = Math.floor(Math.random() * 101);
    await prisma.token.create({
      data: {
        value: tokenValue,
        user: { connect: { id: user.id } },
      },
    });
  }

  res.json({ message: 'Autenticado com sucesso', token: tokenValue });
});

export default router;
