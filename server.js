const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const axios = require('axios');
const port = 3000;

const viewersFilePath = path.join(__dirname, 'viewers.json');

const viewersSet = new Set();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/get-viewer-count', (req, res) => {
    res.json({ count: viewersSet.size });
});

app.post('/update-viewer-count', (req, res) => {
    const ip = req.body.ip; 

    if (!viewersSet.has(ip)) {
        viewersSet.add(ip);
        res.status(200).json({ success: true });
    } else {
        res.status(200).json({ success: true });
    }
});

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
