const express = require('express');
const router = express.Router();
const fs = require('fs');

router.use(express.json());

// GET all notes
router.get('/', (req, res) => {
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error reading notes file');
    } else {
      res.json(JSON.parse(data));
    }
  });
});

// POST a new note
router.post('/', (req, res) => {
  const { title, text } = req.body;

  if (!title || !text) {
    res.status(400).send('Title and text are required');
  } else {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error reading notes file');
      } else {
        const notes = JSON.parse(data);
        const newNote = { title, text };
        const newId = notes.length > 0 ? notes[notes.length - 1].id + 1 : 1;
        newNote.id = newId;
        notes.push(newNote);

        fs.writeFile('./db/db.json', JSON.stringify(notes), (err) => {
          if (err) {
            console.error(err);
            res.status(500).send('Error writing notes file');
          } else {
            res.json(newNote);
          }
        });
      }
    });
  }
});

// DELETE a note
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    res.status(400).send('Invalid ID');
  } else {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error reading notes file');
      } else {
        const notes = JSON.parse(data);
        const noteIndex = notes.findIndex((note) => note.id === id);

        if (noteIndex === -1) {
          res.status(404).send(`Note with ID ${id} not found`);
        } else {
          notes.splice(noteIndex, 1);

          fs.writeFile('./db/db.json', JSON.stringify(notes), (err) => {
            if (err) {
              console.error(err);
              res.status(500).send('Error writing notes file');
            } else {
              res.send(`Note with ID ${id} deleted`);
            }
          });
        }
      }
    });
  }
});

module.exports = router;
