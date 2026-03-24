import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import componentRoutes from './routes/components.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/components', componentRoutes);

export default app;