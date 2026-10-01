import express from 'express';
import cors from 'cors';
import routes from './routes';
import { errorHandler } from './middleware/errorMiddleware';
import { env } from './config/env';

const app = express();

app.use(cors({
  origin: env.FRONTEND_URL,
  credentials: true,
}));
app.use(express.json());

app.use('/api', routes);

app.use(errorHandler);

export default app;
