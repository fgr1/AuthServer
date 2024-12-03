import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import bcrypt from 'bcrypt';
import iconv from 'iconv-lite';

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

async function main() {
  const usersData = [
    { name: 'user1', password: 'password1' },
    { name: 'user2', password: 'password2' },
    { name: 'user3', password: 'password3' },
    { name: 'user4', password: 'password4' },
    { name: 'user5', password: 'password5' },
  ];

  for (const userData of usersData) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    await prisma.user.create({
      data: {
        name: userData.name,
        password: hashedPassword,
      },
    });
  }

  const filmesResponse = await axios.get('http://wecodecorp.com.br/ufpr/filme', {
    responseType: 'arraybuffer',
  });
  const filmesJson = iconv.decode(Buffer.from(filmesResponse.data as ArrayBuffer), 'utf-8');
  const filmes: Filme[] = JSON.parse(filmesJson);

  await prisma.film.createMany({
    data: filmes.map((filme) => ({
      id: parseInt(filme.id),
      name: filme.nome,
      genre: filme.genero,
      posterUrl: filme.foto,
    })),
  });

  const diretoresResponse = await axios.get('http://wecodecorp.com.br/ufpr/diretor', {
    responseType: 'arraybuffer',
  });
  const diretoresJson = iconv.decode(Buffer.from(diretoresResponse.data as ArrayBuffer), 'utf-8');
  const diretores: Diretor[] = JSON.parse(diretoresJson);

  await prisma.director.createMany({
    data: diretores.map((diretor) => ({
      id: parseInt(diretor.id),
      name: diretor.nome,
    })),
  });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
