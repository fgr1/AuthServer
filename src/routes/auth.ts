import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import axios from 'axios';
import iconv from 'iconv-lite';

const router = Router();
const prisma = new PrismaClient();

interface Filme {
  id: string;
  nome: string;
  genero: string;
  foto: string;
}

interface Diretor {
  id: string;
  nome: string;
}

async function updateFilmsAndDirectors() {
  try {
    const filmesResponse = await axios.get('http://wecodecorp.com.br/ufpr/filme', {
      responseType: 'arraybuffer',
    });
    const filmesJson = iconv.decode(Buffer.from(filmesResponse.data as ArrayBuffer), 'utf-8');
    const filmes: Filme[] = JSON.parse(filmesJson);

    for (const filme of filmes) {
      const existingFilm = await prisma.film.findUnique({ where: { id: parseInt(filme.id) } });
      if (!existingFilm) {
        await prisma.film.create({
          data: {
            id: parseInt(filme.id),
            name: filme.nome,
            genre: filme.genero,
            posterUrl: filme.foto,
          },
        });
      }
    }

    const diretoresResponse = await axios.get('http://wecodecorp.com.br/ufpr/diretor', {
      responseType: 'arraybuffer',
    });
    const diretoresJson = iconv.decode(Buffer.from(diretoresResponse.data as ArrayBuffer), 'utf-8');
    const diretores: Diretor[] = JSON.parse(diretoresJson);

    for (const diretor of diretores) {
      const existingDirector = await prisma.director.findUnique({ where: { id: parseInt(diretor.id) } });
      if (!existingDirector) {
        await prisma.director.create({
          data: {
            id: parseInt(diretor.id),
            name: diretor.nome,
          },
        });
      }
    }
  } catch (error) {
    console.error('Erro ao atualizar filmes e diretores:', error);
  }
}

router.post('/login', async (req: Request, res: Response): Promise<void> => {
  console.log('Requisição de login recebida:', req.body);

  const { name, password } = req.body;
  const user = await prisma.user.findUnique({
    where: { name: req.body.name },
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

  await updateFilmsAndDirectors();

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

  res.json({ message: 'Autenticado com sucesso', token: tokenValue, userId: user.id });
});

export default router;
