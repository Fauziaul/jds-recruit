// utils/currencyConverter.js
const axios = require('axios');

// Fungsi untuk mendapatkan nilai tukar USD ke IDR
const getCurrencyRate = async () => {
    try {
        const response = await axios.get(process.env.CURRENCY_CONVERTER_API_URL);
        return response.data.USD_IDR.val;
    } catch (error) {
        throw new Error('Failed to fetch currency rate');
    }
};

module.exports = { getCurrencyRate };
