// Required dependencies 
const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const app = express ();

const PORT = process.env.PORT || 3000;
app.use(express.urlencoded({ extended : true }));
app.use(express.json());
app.use(express.static('public'));


app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

const DB_FILE = path.join(__dirname, 'db/db.json');

app.get('/api/notes', (req, res) => {
    fs.readFile(DB_FILE, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error reading from db.json' });
        }
        res.json(JSON.parse(data));
    });
});

app.post('/api/notes', (req, res) => {
    const newNote = { ...req.body, id: uuidv4() }; // Assign a new UUID ID to the note

    // Read the current notes, add the new note, then write back to db.json
    fs.readFile(DB_FILE, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error reading from db.json' });
        }
        const notes = JSON.parse(data);
        notes.push(newNote);
        fs.writeFile(DB_FILE, JSON.stringify(notes, null, 2), (err) => { 
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Error writing to db.json' });
            }
            res.json(newNote);
        });
    });
});