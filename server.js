const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const axios = require('axios');
const port = 3000;

const viewersFilePath = path.join(__dirname, 'viewers.json');

// Set to store temporary viewers
const viewersSet = new Set();

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Endpoint to get viewer count
app.get('/get-viewer-count', (req, res) => {
    // Return the size of the set to get the unique viewer count
    res.json({ count: viewersSet.size });
});

// Endpoint to update viewer count
app.post('/update-viewer-count', (req, res) => {
    const ip = req.body.ip;  // Use IP to track temporary uniqueness

    // Check if the IP has already been counted
    if (!viewersSet.has(ip)) {
        viewersSet.add(ip);  // Add IP to the set
        res.status(200).json({ success: true });
    } else {
        res.status(200).json({ success: true });  // IP has already been counted
    }
});

// Endpoint to get the current config
app.get('/get-config', (req, res) => {
    fs.readFile(configFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error reading config file' });
        }
        const config = JSON.parse(data);
        res.json(config);
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
