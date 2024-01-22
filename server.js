// Required dependencies 
const express = require('express'); //  Importing the express libray to create the server
const fs = require('fs'); // File system module to read and write files to db.json
const path = require('path'); // Path modules to work with file and directory paths
const { v4: uuidv4 } = require('uuid'); // Importing UUID to generate inique identifiers 
const app = express (); // Creating an instance of express
const PORT = process.env.PORT || 3000; // Setting the port to useeither and enviroment variable PORT or 3000 if not set

// Middleware
app.use(express.urlencoded({ extended : true })); // Middleware for passing URL-encoded bodies
app.use(express.json()); // Middleware for parsing JSOn bodies
app.use(express.static('public')); // Serving static files (HTML, CSS, JS)


// Route for serving notes.html
app.get('/notes', (req, res) => {
    // When the user navigates to '/notes', send them the notes.html file
    res.sendFile(path.join(__dirname, 'public/notes.html'));
});

// defingin the path to the JSON file where the notes stored
const DB_FILE = path.join(__dirname, 'db/db.json');

// Api to get all notes
app.get('/api/notes', (req, res) => {
    // Reads the contents of the JSON file
    fs.readFile(DB_FILE, 'utf8', (err, data) => {
        if (err) {
            // If an error ocurrs, log it and return a 500 internal server error
            console.error(err);
            return res.status(500).json({ message: 'Error reading from db.json' });
        }
        // If successful, parse the data from teh JSOn file and send it back as a response
        res.json(JSON.parse(data));
    });
});

// API route to create a new note 
app.post('/api/notes', (req, res) => {
    // Create a new note object, combining the request body with a unique ID.
    const newNote = { ...req.body, id: uuidv4() }; // Assign a new UUID ID to the note

    // Read the current notes from the JSON file
    fs.readFile(DB_FILE, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error reading from db.json' });
        }
        const notes = JSON.parse(data);
        notes.push(newNote); // Add the new note to the existing array

        // Write the updated ntes back to the JSON file
        fs.writeFile(DB_FILE, JSON.stringify(notes, null, 2), (err) => { 
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Error writing to db.json' });
            }
            // If successful, send the new note back in the response
            res.json(newNote);
        });
    });
});

// API Route to delete a note by ID 
app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id; // Extracting the ID from the URL parameter

    // Read the current notes form the JSON
    fs.readFile(path.join(__dirname, 'db/db.json'), 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error reading from db.json' });
        }

        let notes = JSON.parse(data);
        const filterNotes = notes.filter((note) => note.id !== noteId);
        
        // Write the updated notes back to the JSON file
        fs.writeFile(path.join(__dirname, 'db/db.json'), JSON.stringify(filterNotes, null, 2), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Error writing to db.json' })
            }
            // IF successful, send a success message
            res.status(200).json({ msg: 'Note deleted'});
        });
    });
});

// Catch-all Route for any other requests
app.get('*', (req, res) => {
    // Send the index.html file for any routes not defined above
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log('Server is listeing on port ${port}');
    // Confirmation message that the server is running and on what PORT
});