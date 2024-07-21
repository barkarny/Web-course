const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the directory where server.js is located
app.use(express.static(__dirname));

// Define a route to serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route to handle saving records
app.post('/saveRecords', (req, res) => {
    const data = req.body;
    saveRecords(data, res);
});

// Function to save records to JSON file
function saveRecords(data, res) {
    fs.writeFile('records.json', JSON.stringify(data), (err) => {
        if (err) {
            console.error('Error writing to JSON file:', err);
            res.status(500).send('Error writing to JSON file');
        } else {
            console.log('Records saved successfully.');
            res.status(200).send('Records saved successfully');
        }
    });
}

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
