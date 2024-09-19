// routes/productRoutes.js
const express = require('express');
const connectToDB = require('../config/db');
const multer = require('multer');
const router = express.Router();
const fs = require('fs');
const path = require('path');




// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Specify the directory for saving images
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Use a unique filename
    }
});
const upload = multer({ storage: storage });


router.post('/add-product', upload.single('main_image'), async (req, res) => {
    const { name, description, price, category_id, brand_id, product_condition, discount } = req.body;
    const main_image = req.file ? req.file.filename : null; // Get the filename of the uploaded image

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


router.put('/update-product/:id', upload.single('main_image'), async (req, res) => {
    const productId = req.params.id;
    const { name, description, price, category_id, brand_id, product_condition, discount } = req.body;
    const new_image = req.file ? req.file.filename : undefined;

    if (!name && !description && !price && !category_id && !brand_id && !product_condition && !discount && !new_image) {
        return res.status(400).json({ error: 'At least one field is required for update' });
    }

    try {
        const pool = await connectToDB();

        // Check if the product exists
        const [productRows] = await pool.query('SELECT * FROM products WHERE id = ?', [productId]);
        if (productRows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Get the current image file name
        const old_image = productRows[0].main_image;

        // Build the SQL update query dynamically
        let query = 'UPDATE products SET ';
        const values = [];

        if (name) {
            query += 'name = ?, ';
            values.push(name);
        }
        if (description) {
            query += 'description = ?, ';
            values.push(description);
        }
        if (price) {
            query += 'price = ?, ';
            values.push(price);
        }
        if (category_id) {
            query += 'category_id = ?, ';
            values.push(category_id);
        }
        if (brand_id) {
            query += 'brand_id = ?, ';
            values.push(brand_id);
        }
        if (product_condition) {
            query += 'product_condition = ?, ';
            values.push(product_condition);
        }
        if (discount) {
            query += 'discount = ?, ';
            values.push(discount);
        }
        if (new_image) {
            query += 'main_image = ?, ';
            values.push(new_image);
        }
        query += 'updated_at = ? WHERE id = ?';
        values.push(new Date(), productId);

        // Execute the update query
        const [result] = await pool.query(query, values);

        // If image was updated, delete the old image file
        if (old_image && new_image) {
            fs.unlink(path.join('uploads', old_image), (err) => {
                if (err) console.error('Error deleting old image:', err);
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.status(200).json({
            message: 'Product updated successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});



//delete product
router.delete('/delete-product/:id', async (req, res) => {
    const productId = req.params.id;

    try {
        const pool = await connectToDB();

        // Check if the product exists
        const [productRows] = await pool.query('SELECT * FROM products WHERE id = ?', [productId]);
        if (productRows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Get the current image file name
        const imageToDelete = productRows[0].main_image;

        // Delete the product from the database
        const [result] = await pool.query('DELETE FROM products WHERE id = ?', [productId]);

        // If the product was deleted, delete the associated image file if it exists
        if (imageToDelete) {
            fs.unlink(path.join('uploads', imageToDelete), (err) => {
                if (err) {
                    console.error('Error deleting image file:', err);
                }
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Product not found or already deleted' });
        }

        res.status(200).json({
            message: 'Product deleted successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});



//Add to cart
router.post('/add-to-cart/:user_id/:product_id', async (req, res) => {
    const userId = req.params.user_id;
    const productId = req.params.product_id;

    try {
        const pool = await connectToDB();

        // Check if product exists and get its price
        const [productRows] = await pool.query('SELECT price FROM products WHERE id = ?', [productId]);
        if (productRows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        const price = productRows[0].price;

        // Check if the cart item already exists for the user
        const [cartRows] = await pool.query('SELECT quantity FROM cart WHERE user_id = ? AND product_id = ?', [userId, productId]);
        const currentQuantity = cartRows.length > 0 ? cartRows[0].quantity : 0;

        // Determine the new quantity (current quantity + 1)
        const newQuantity = currentQuantity + 1;

        // Insert or update the cart item
        if (currentQuantity > 0) {
            // Update existing cart item
            await pool.query(
                'UPDATE cart SET quantity = ?, updated_at = ? WHERE user_id = ? AND product_id = ?',
                [newQuantity, new Date(), userId, productId]
            );
        } else {
            // Insert new cart item
            await pool.query(
                'INSERT INTO cart (user_id, product_id, quantity, created_at, updated_at) VALUES (?, ?, ?, ?, ?)',
                [userId, productId, newQuantity, new Date(), new Date()]
            );
        }

        // Calculate the total quantity and total price for the user
        const [cartSummaryRows] = await pool.query('SELECT SUM(quantity) AS total_quantity, SUM(quantity * (SELECT price FROM products WHERE products.id = cart.product_id)) AS total_price FROM cart WHERE user_id = ?', [userId]);
        const totalQuantity = cartSummaryRows[0].total_quantity;
        const totalPrice = cartSummaryRows[0].total_price;

        // Update total quantity and total price
        await pool.query(
            'UPDATE cart SET total_quantity = ?, total_price = ? WHERE user_id = ?',
            [totalQuantity, totalPrice, userId]
        );

        res.status(200).json({ message: 'Product added to cart successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});


//Delete from cart
router.delete('/remove-from-cart/:user_id/:product_id', async (req, res) => {
    const userId = req.params.user_id;
    const productId = req.params.product_id;

    try {
        const pool = await connectToDB();

        // Check if the product exists in the cart for the user
        const [cartRows] = await pool.query('SELECT quantity FROM cart WHERE user_id = ? AND product_id = ?', [userId, productId]);
        if (cartRows.length === 0) {
            return res.status(404).json({ error: 'Product not found in cart' });
        }

        // Delete the product from the cart
        await pool.query('DELETE FROM cart WHERE user_id = ? AND product_id = ?', [userId, productId]);

        // Calculate the updated total quantity and total price
        const [cartSummaryRows] = await pool.query('SELECT SUM(quantity) AS total_quantity, SUM(quantity * price) AS total_price FROM cart JOIN products ON cart.product_id = products.id WHERE cart.user_id = ?', [userId]);
        const totalQuantity = cartSummaryRows[0].total_quantity || 0;
        const totalPrice = cartSummaryRows[0].total_price || 0;

        // Update the total quantity and total price in the cart
        await pool.query(
            'UPDATE cart SET total_quantity = ?, total_price = ? WHERE user_id = ?',
            [totalQuantity, totalPrice, userId]
        );

        res.status(200).json({ message: 'Product removed from cart successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

//decrement prodcut from the cart
router.post('/decrement-product/:user_id/:product_id', async (req, res) => {
    const userId = req.params.user_id;
    const productId = req.params.product_id;

    try {
        const pool = await connectToDB();

        // Check if the product exists in the cart for the user
        const [cartRows] = await pool.query('SELECT quantity FROM cart WHERE user_id = ? AND product_id = ?', [userId, productId]);

        if (cartRows.length === 0) {
            return res.status(404).json({ error: 'Product not found in cart' });
        }

        const currentQuantity = cartRows[0].quantity;

        // If quantity is 1, remove the product entirely
        if (currentQuantity === 1) {
            await pool.query('DELETE FROM cart WHERE user_id = ? AND product_id = ?', [userId, productId]);
        } else {
            // Otherwise, decrement the quantity by 1
            const newQuantity = currentQuantity - 1;
            await pool.query(
                'UPDATE cart SET quantity = ?, updated_at = ? WHERE user_id = ? AND product_id = ?',
                [newQuantity, new Date(), userId, productId]
            );
        }

        // Update the total quantity and total price after decrementing
        const [cartSummaryRows] = await pool.query('SELECT SUM(quantity) AS total_quantity, SUM(quantity * price) AS total_price FROM cart JOIN products ON cart.product_id = products.id WHERE cart.user_id = ?', [userId]);
        const totalQuantity = cartSummaryRows[0].total_quantity || 0;
        const totalPrice = cartSummaryRows[0].total_price || 0;

        // Update the cart's total quantity and total price
        await pool.query(
            'UPDATE cart SET total_quantity = ?, total_price = ? WHERE user_id = ?',
            [totalQuantity, totalPrice, userId]
        );

        res.status(200).json({ message: 'Product quantity decremented successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

//view cart
router.get('/view-cart/:user_id', async (req, res) => {
    const userId = req.params.user_id;

    try {
        const pool = await connectToDB();

        // Get all products in the cart for the user with their details
        const [cartItems] = await pool.query(`
            SELECT 
                cart.product_id, 
                products.name, 
                cart.quantity, 
                products.price, 
                (cart.quantity * products.price) AS total_price_per_product
            FROM cart
            JOIN products ON cart.product_id = products.id
            WHERE cart.user_id = ?
        `, [userId]);

        if (cartItems.length === 0) {
            return res.status(404).json({ message: 'No items found in the cart' });
        }

        // Calculate the total quantity and total price for all items in the cart
        const [cartSummary] = await pool.query(`
            SELECT 
                SUM(cart.quantity) AS total_quantity, 
                SUM(cart.quantity * products.price) AS total_price 
            FROM cart 
            JOIN products ON cart.product_id = products.id 
            WHERE cart.user_id = ?
        `, [userId]);

        const totalQuantity = cartSummary[0].total_quantity;
        const totalPrice = cartSummary[0].total_price;

        // Return the cart details with the total summary
        res.status(200).json({
            cartItems,
            totalQuantity,
            totalPrice
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});
module.exports = router;