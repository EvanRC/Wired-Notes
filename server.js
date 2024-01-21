// Required dependencies 
const express = require('express');
const app = express ();
const PORT = process.env.PORT || 3000;
app.use(express.urlencoded({ extended : true }));
app.use(express.json());
app.use(express.static('public'));

const path = require('path');

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});
