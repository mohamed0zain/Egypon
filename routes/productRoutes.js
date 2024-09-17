// routes/productRoutes.js
const express = require('express');
const connectToDB = require('../config/db');
const router = express.Router();

router.post('/add-product', async (req, res) => {
    const { name, description, price, category_id, brand_id, product_condition, discount, main_image } = req.body;

    if (!name || !description || !price || !category_id || !brand_id) {
        return res.status(400).json({ error: 'Name, description, price, category_id, and brand_id are required' });
    }

    try {
        const pool = await connectToDB();

        // Check if category and brand exist
        const [categoryRows] = await pool.query('SELECT id FROM categories WHERE id = ?', [category_id]);
        const [brandRows] = await pool.query('SELECT id FROM brands WHERE id = ?', [brand_id]);

        if (categoryRows.length === 0) {
            return res.status(400).json({ error: 'Invalid category ID' });
        }
        if (brandRows.length === 0) {
            return res.status(400).json({ error: 'Invalid brand ID' });
        }

        // Check if a product with the same name already exists
        const [existingProductRows] = await pool.query('SELECT id FROM products WHERE name = ?', [name]);
        if (existingProductRows.length > 0) {
            return res.status(400).json({ error: 'Product with this name already exists' });
        }

        // Insert new product
        const [result] = await pool.query(
            `INSERT INTO products (name, description, price, category_id, brand_id, product_condition, discount, main_image, created_at, updated_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, description, price, category_id, brand_id, product_condition, discount || null, main_image || null, new Date(), new Date()]
        );

        res.status(201).json({
            message: 'Product added successfully',
            productId: result.insertId
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
 