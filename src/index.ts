import express from 'express';
import authRoutes from './routes/auth';
import voteRoutes from './routes/vote';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors());

app.use('/auth', authRoutes);
app.use('/vote', voteRoutes);

app.listen(3000, '0.0.0.0', () => {
  console.log('Servidor rodando na porta 3000');
});

app.get('/', (req, res) => {
  res.send('Bem-vindo ao servidor!');
});

