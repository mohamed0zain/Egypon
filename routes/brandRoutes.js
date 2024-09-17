const express = require('express');
const router = express.Router();
const connectToDB = require('../config/db'); // Adjust path if necessary

router.post('/add-brand', async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Brand name is required' });
    }

    try {
        // Get the pool
        const pool = await connectToDB();

        // Get the current date and time
        const now = new Date();

        // Insert the new brand
        const [result] = await pool.query(
            `INSERT INTO brands (name, created_at, updated_at) 
             VALUES (?, ?, ?)`,
            [name, now, now]
        );

        const newBrand = result.insertId; // or adjust based on what `pool.query` returns

        res.status(201).json({
            message: 'Brand added successfully',
            brandId: newBrand
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
