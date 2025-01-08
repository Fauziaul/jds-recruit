// index.js
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const { getCurrencyRate } = require('./utils/currencyConverter');

const app = express();
app.use(express.json());

// Middleware untuk memverifikasi token JWT
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Token is required' });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }
        req.user = decoded; // Simpan data pengguna yang terdekode
        next();
    });
};

// 1. Endpoint untuk mengambil data produk dengan konversi harga dari USD ke IDR
app.get('/fetch-products', verifyToken, async (req, res) => {
    try {
        // Ambil data produk dari API eksternal
        const response = await axios.get('https://60c18de74f7e880017dbfd51.mockapi.io/api/v1/jabar-digital-services/product');
        const products = response.data;

        // Dapatkan nilai tukar USD ke IDR
        const usdToIdr = await getCurrencyRate();

        // Konversi harga dari USD ke IDR dan tambahkan field 'price_idr'
        products.forEach(product => {
            product.price_idr = product.price * usdToIdr;
        });

        res.json({
            message: 'Product data retrieved successfully',
            data: products,
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

// 2. Endpoint untuk agregasi data berdasarkan department, product, dan price_idr
app.get('/aggregate-products', verifyToken, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access forbidden: admin role required' });
    }

    try {
        // Ambil data produk dari API eksternal
        const response = await axios.get('https://60c18de74f7e880017dbfd51.mockapi.io/api/v1/jabar-digital-services/product');
        const products = response.data;

        // Dapatkan nilai tukar USD ke IDR
        const usdToIdr = await getCurrencyRate();

        // Konversi harga dari USD ke IDR dan tambahkan field 'price_idr'
        products.forEach(product => {
            product.price_idr = product.price * usdToIdr;
        });

        // Agregasi data berdasarkan department dan product
        const aggregatedData = {};
        products.forEach(product => {
            const key = `${product.department}_${product.name}`;
            if (!aggregatedData[key]) {
                aggregatedData[key] = {
                    department: product.department,
                    product: product.name,
                    price_idr: product.price_idr,
                };
            }
        });

        // Urutkan data berdasarkan harga (price_idr)
        const sortedData = Object.values(aggregatedData).sort((a, b) => a.price_idr - b.price_idr);

        res.json({
            message: 'Aggregated product data retrieved successfully',
            data: sortedData,
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to aggregate data' });
    }
});

// 3. Endpoint untuk menampilkan data klaim pribadi berdasarkan token yang valid
app.get('/private-claim-data', verifyToken, (req, res) => {
    res.json({
        message: 'Private claim data retrieved successfully',
        data: req.user, // Mengambil data klaim pribadi dari token yang terdekode
    });
});

// Jalankan server pada port 3000
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000/');
});
