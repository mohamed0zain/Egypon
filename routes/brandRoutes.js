const express = require('express');
const router = express.Router();
const connectToDB = require('../config/db'); // Adjust path if necessary

// add a brand name
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

        // Check if the brand name already exists
        const [existingBrand] = await pool.query(
            `SELECT * FROM brands WHERE name = ?`,
            [name]
        );

        if (existingBrand.length > 0) {
            return res.status(400).json({ error: 'Brand name already exists' });
        }

        // Insert the new brand
        const [result] = await pool.query(
            `INSERT INTO brands (name, created_at, updated_at) 
             VALUES (?, ?, ?)`,
            [name, now, now]
        );

        const newBrandId = result.insertId; // or adjust based on what `pool.query` returns

        res.status(201).json({
            message: 'Brand added successfully',
            
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

//Update the brand name
router.put('/update-brand', async (req, res) => {
    const { id, name } = req.body;

    if (!id || !name) {
        return res.status(400).json({ error: 'Brand ID and new name are required' });
    }

    try {
        // Create a pool connection
        const pool = await connectToDB();

        // Get the current date and time
        const now = new Date();

        // Step 1: Retrieve current brand name
        const [currentBrandResult] = await pool.query(
            `SELECT name FROM brands WHERE id = ?`,
            [id]
        );

        if (currentBrandResult.length === 0) {
            return res.status(404).json({ error: 'Brand not found' });
        }

        const currentName = currentBrandResult[0].name;

        // Step 2: Check if the new name is the same as the current name
        if (currentName === name) {
            return res.status(200).json({ message: 'No changes made; the new name is the same as the old name.' });
        }

        // Step 3: Update the brand name and updated_at timestamp
        const [result] = await pool.query(
            `UPDATE brands 
             SET name = ?, updated_at = ? 
             WHERE id = ?`,
            [name, now, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Brand not found' });
        }

        res.status(200).json({
            message: 'Brand updated successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

//delete brand
router.delete('/delete-brand', async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ error: 'Brand ID is required' });
    }

    try {
        // Create a pool connection
        const pool = await connectToDB();

        // Step 1: Check if the brand exists
        const [brandResult] = await pool.query(
            `SELECT * FROM brands WHERE id = ?`,
            [id]
        );

        if (brandResult.length === 0) {
            return res.status(404).json({ error: 'Brand not found' });
        }

        // Step 2: Delete the brand
        const [deleteResult] = await pool.query(
            `DELETE FROM brands WHERE id = ?`,
            [id]
        );

        if (deleteResult.affectedRows === 0) {
            return res.status(404).json({ error: 'Brand not found' });
        }

        res.status(200).json({
            message: 'Brand deleted successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});


router.get('/brands', async (req, res) => {
    try {
        const pool = await connectToDB();
        const [rows] = await pool.query('SELECT id, name FROM brands');
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});
module.exports = router;
