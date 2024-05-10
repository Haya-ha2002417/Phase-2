const express = require('express');
const apiRouter = require('./routes/api');
const cors = require('cors');
const app = express();
app.use(cors());
// Middleware
app.use(express.json());

// Routes
app.use('/api', apiRouter);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//