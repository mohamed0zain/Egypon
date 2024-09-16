const express = require('express');
const companyRoutes = require('./routes/companyRoutes');
const customerRoutes = require('./routes/customerRoutes');

const app = express();
app.use(express.json());

app.use('/api', companyRoutes);
app.use('/api', customerRoutes);

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
