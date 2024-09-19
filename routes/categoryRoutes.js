const express = require('express');
const router = express.Router();
const connectToDB = require('../config/db'); // Adjust path if necessary

// Add a new category
router.post('/add-category', async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Category name is required' });
    }

    try {
        // Create a pool connection
        const pool = await connectToDB();

        // Check if the category name already exists
        const [existingCategory] = await pool.query(
            `SELECT * FROM categories WHERE name = ?`,
            [name]
        );

        if (existingCategory.length > 0) {
            return res.status(400).json({ error: 'Category name already exists' });
        }

        // Get the current date and time
        const now = new Date();

        // Insert the new category
        const [result] = await pool.query(
            `INSERT INTO categories (name, created_at, updated_at) 
             VALUES (?, ?, ?)`,
            [name, now, now]
        );

        const newCategoryId = result.insertId; // Get the ID of the newly inserted category

        res.status(201).json({
            message: 'Category added successfully',
            categoryId: newCategoryId
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});


// Update an existing category
router.put('/update-category', async (req, res) => {
    const { id, name } = req.body;

    if (!id || !name) {
        return res.status(400).json({ error: 'Category ID and new name are required' });
    }

    try {
        // Create a pool connection
        const pool = await connectToDB();

        // Check if the category ID exists
        const [existingCategory] = await pool.query(
            `SELECT * FROM categories WHERE id = ?`,
            [id]
        );

        if (existingCategory.length === 0) {
            return res.status(404).json({ error: 'Category not found' });
        }

        // Check if the new name is different from the existing name
        const [currentCategory] = await pool.query(
            `SELECT name FROM categories WHERE id = ?`,
            [id]
        );

        if (currentCategory[0].name === name) {
            return res.status(400).json({ error: 'New name is the same as the current name' });
        }

        // Get the current date and time
        const now = new Date();

        // Update the category name and updated_at timestamp
        const [result] = await pool.query(
            `UPDATE categories 
             SET name = ?, updated_at = ? 
             WHERE id = ?`,
            [name, now, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Category not found' });
        }

        res.status(200).json({
            message: 'Category updated successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});


// Delete an existing category
router.delete('/delete-category/:id', async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: 'Category ID is required' });
    }

    try {
        // Create a pool connection
        const pool = await connectToDB();

        // Check if the category ID exists
        const [existingCategory] = await pool.query(
            `SELECT * FROM categories WHERE id = ?`,
            [id]
        );

        if (existingCategory.length === 0) {
            return res.status(404).json({ error: 'Category not found' });
        }

        // Delete the category
        const [result] = await pool.query(
            `DELETE FROM categories WHERE id = ?`,
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Category not found' });
        }

        res.status(200).json({
            message: 'Category deleted successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});


router.get('/categories', async (req, res) => {
    try {
        const pool = await connectToDB();
        const [rows] = await pool.query('SELECT id, name FROM categories');
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }

});
module.exports = router;