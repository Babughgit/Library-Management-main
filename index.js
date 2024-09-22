const express = require('express');
const bodyParser = require('body-parser');
const connection = require('./db');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Serve the HTML page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Get all borrowed books (not returned)
app.get('/books', (req, res) => {
    const query = 'SELECT * FROM books WHERE returned = 0 ORDER BY timestamp DESC';
    connection.query(query, (err, results) => {
        if (err) throw err;
        res.json(results); 
    });
});

// Move returned books to returned section
app.get('/books/returned', (req, res) => {
    const query = 'SELECT * FROM books WHERE returned = 1';
    connection.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);  // Send the returned book list to the frontend
    });
});

// Add a new book (borrow book)
app.post('/books', (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Book name is required' });
    }

    const timestamp = new Date();
    const query = 'INSERT INTO books (name, timestamp, returned) VALUES (?, ?, 0)';
    connection.query(query, [name, timestamp], (err) => {
        if (err) throw err;
        res.redirect('/');
    });
});



app.put('/books/:id/return', (req, res) => {
    const bookId = req.params.id;

    connection.query('SELECT * FROM books WHERE id = ?', [bookId], (err, results) => {
        if (err) throw err;

        const book = results[0];
        const now = new Date();  
        const timeTaken = new Date(book.timestamp);  // Borrow time
        const hoursDifference = Math.abs(now - timeTaken) / 36e5;  // Difference in hours
        let fine = 0;

        if (hoursDifference > 1) {
            fine = Math.floor(hoursDifference - 1) * 10;
        }

        
        const query = 'UPDATE books SET returned = 1, fine = ?, return_timestamp = ? WHERE id = ?';
        connection.query(query, [fine, now, bookId], (err) => {
            if (err) throw err;
            res.json({ 
                message: 'Book returned successfully', 
                fine, 
                returnTimestamp: now 
            });
        });
    });
});



app.listen(3000, () => {
    console.log('Server running on port 3000');
});
