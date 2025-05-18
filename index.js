const express = require('express');
const bodyParser = require('body-parser');
const { connectToDatabase, sequelize } = require('./connect_db');
const identifyRoutes = require('./routes/identify_routes');

const app = express();
app.use(bodyParser.json());

(async () => {
  await connectToDatabase();
  await sequelize.sync(); 
})();

app.use('/', identifyRoutes);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});