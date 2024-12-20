const express = require('express');  // Mengimpor framework Express untuk membuat server HTTP
const cors = require('cors');  // Mengimpor CORS middleware untuk menangani masalah Cross-Origin Resource Sharing

// Mengimpor route files untuk menangani berbagai API endpoints
const userRoutes = require('./routes/userRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const marketDataRoutes = require('./routes/marketDataRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');

// Mengimpor dotenv untuk mengelola variabel lingkungan dari file .env
const dotenv = require('dotenv');
dotenv.config();

// Membuat instance aplikasi Express
const app = express();

// Menggunakan middleware CORS untuk mengizinkan akses dari domain lain
app.use(cors());

// Middleware untuk mengonversi request body menjadi format JSON
app.use(express.json());

// Menghubungkan setiap route dengan endpoint API yang sesuai
app.use('/api/users', userRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/market-data', marketDataRoutes);
app.use('/api/recommendation', recommendationRoutes);

// Menentukan port aplikasi akan berjalan (default 5000 atau yang didefinisikan di .env)
const port = process.env.PORT || 5000;

// Menjalankan server dan mendengarkan pada port yang telah ditentukan
app.listen(port, () => {
    console.log(`Server running on port ${port}`);  // Menampilkan pesan bahwa server sudah berjalan
});
