const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const companyRoutes = require('./routes/companyRoutes');
const customerRoutes = require('./routes/customerRoutes');
const { checkDBConnection } = require('./config/db');

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/api/company', companyRoutes);
app.use('/api/customer', customerRoutes);

app.listen(port, async () => {
  console.log(`Server running on port ${port}`);
  await checkDBConnection();
});
