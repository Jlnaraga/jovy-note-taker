const express = require('express');
const path = require('path');
const fs = require('fs');
// Helper method for generating unique ids
const uuid = require('./public/assets/js/helpers');

const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, './public/index.html'))
);

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, './public/notes.html'))
);

// GET request for notes
app.get('/api/notes', (req, res) => {
  // Send a message to the client
  fs.readFile( __dirname + '/db/db.json', 'utf8', (err, data) => {
    if (err) throw err;

  // Log our request to the terminal
  console.log(data);
  res.json(JSON.parse(data))
});


// POST request to add a notes
app.post('/api/notes', (req, res) => {
  const {title, text} = req.body;

  // Log that a POST request was received
  fs.readFile(__dirname + '/db/db.json', 'utf8', (err, data) => {
    if (err) throw err;

    const notes = JSON.parse(data.toString());

    notes.push({
      title,
      text,
      id: uuid()
    });

    fs.writeFile(__dirname + '/db/db.json', JSON.stringify(notes), (err, data) => {
      res.json(notes);
    });
    
  })
})

// Obtain existing reviews
app.delete('/api/notes/:id', (req, res) => {

    const noteId = req.params.id

    fs.readFile(__dirname + '/db/db.json', 'utf8', (err, data) => {
      if (err)  throw err;

        const parsedNotes = JSON.parse(data.toString());
        
        const index = parsedNotes.findIndex(x => x.id === noteId);

        if (parsedNotes !== undefined) parsedNotes.splice(index, 1);

        fs.writeFile(__dirname + '/db/db.json', JSON.stringify(parsedNotes), (err, data) => {
          res.json(parsedNotes);
        });
      })
    });
});

app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.listen(process.env.PORT || PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
)