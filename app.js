const express = require('express');
const companyRoutes = require('./routes/companyRoutes');
const customerRoutes = require('./routes/customerRoutes');
const brandRoutes = require('./routes/brandRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes'); 
const cartRoutes = require('./routes/cartRoutes'); 
const app = express();



app.use(express.json());

app.use('/api', companyRoutes);
app.use('/api', customerRoutes);
app.use('/api', brandRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);
app.use('/api', authRoutes);  
app.use('/api', cartRoutes);

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
