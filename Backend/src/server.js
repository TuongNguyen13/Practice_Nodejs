import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB, sequelize } from './config/db.js';


import './models/user.js';
import './models/notes.js';
import './models/sharedLink.js';


import authRoutes from './routes/auth.js';
import noteRoutes from './routes/note.routes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5468;


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//  Middleware cấu hình CORS
app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

//  Middleware đọc JSON body
app.use(express.json());

//  Static folder cho file ảnh upload
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//  Kết nối cơ sở dữ liệu
await connectDB();

//  Gắn routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);
console.log('noteRoutes mounted');


//  Khởi chạy server sau khi DB sẵn sàng
sequelize
  .sync({ alter: false, force: false })
  .then(() => {
    console.log('Database synced');
    app.listen(PORT, () =>
      console.log(` Server running at http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.error(' Sync error:', err));
