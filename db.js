// db.js
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config(); // Memuat file .env

// Membuat Supabase client dengan variabel lingkungan yang dimuat dari .env
const supabase = createClient(
    process.env.SUPABASE_URL, // Variabel SUPABASE_URL dari .env
    process.env.SUPABASE_API_KEY // Variabel SUPABASE_API_KEY dari .env
);

module.exports = supabase; // Menggunakan Supabase client untuk digunakan di file lain
