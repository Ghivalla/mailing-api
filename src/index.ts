import express from 'express';
import cors from 'cors';
import { config } from './config/env';
import contactRoutes from './routes/contactRoutes';

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'OK'});
});

app.use('/', contactRoutes);


app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port} in ${config.nodeEnv} mode.`);
});
