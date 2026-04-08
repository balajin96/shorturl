import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/dbConfig';
import cors from 'cors';
import router from './routes/shortUrl.route';

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: ["http://localhost:8888",],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

app.use('/api/', router);

const PORT = process.env.SERVER_PORT
app.get('/', (req, res) => res.send('Hello World!'));
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));