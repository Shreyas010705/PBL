const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// In-memory store for comments (no sanitization — intentionally vulnerable)
let comments = [];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname)); // Serve static files like CSS, HTML, etc.

// Serve homepage with injected comments
app.get('/', (req, res) => {
    const htmlPath = path.join(__dirname, 'AtlasHome.html');

    try {
        let html = fs.readFileSync(htmlPath, 'utf8');

        // VULNERABLE: Directly injects unsanitized user input
        let commentHtml = comments.map(c => <p>${c}</p>).join('');
        html = html.replace('<div id="comments">', <div id="comments">${commentHtml});

        res.send(html);
    } catch (err) {
        console.error('Error reading file:', htmlPath);
        console.error(err);
        res.status(500).send('Server error: HTML file not found');
    }
});

// Store new comments (no escaping)
app.post('/comment', (req, res) => {
    const comment = req.body.comment;
    comments.push(comment);
    res.redirect('/');
});

// Reset/clear all comments
app.get('/reset', (req, res) => {
    comments = [];
    res.send(`
        <h2>All comments cleared!</h2>
        <a href="/">Go back to Home</a>
    `);
});

// Start server
app.listen(port, () => {
    console.log(XSS Demo app running at http://localhost:${port});
});