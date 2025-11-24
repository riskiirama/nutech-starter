require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');

app.use(express.json());
app.use(cors());

// Use routes
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/', require("./routes/route"))

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
