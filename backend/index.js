let PORT = 8080;
const express = require('express');
const app = express();
const { Property } = require('./schema/mainSchema');
const mongoose = require('mongoose');
const cors = require('cors');
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/propertiesDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
});

// Get all properties route
app.get('/api/properties', async (req, res) => {
    try {
        const properties = await Property.find();
        res.status(200).json(properties);
    } catch (err) {
        console.error('Error fetching properties:', err.message);
        res.status(500).json({ error: 'An error occurred while fetching properties.' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port: http://localhost:${PORT}`);
});
