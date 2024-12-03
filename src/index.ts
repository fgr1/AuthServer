import express from 'express';
import authRoutes from './routes/auth';
import voteRoutes from './routes/vote';

const app = express();

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/vote', voteRoutes);

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
