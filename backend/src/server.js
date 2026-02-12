require('dotenv').config();
const express = require('express');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API PostgreSQL OK 🚀');
});

app.listen(3000, () => {
  console.log('Serveur lancé sur http://localhost:3000');
});
