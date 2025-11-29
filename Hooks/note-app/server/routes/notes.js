import express from "express";

const router = express.Router();

// In-memory storage for notes
let notes = [
  { id: 1, title: "Welcome Note", content: "This is your first note!" },
  {
    id: 2,
    title: "Getting Started",
    content: "You can add, edit, and delete notes.",
  },
];

let nextId = 3;

// GET all notes
router.get("/", (req, res) => {
  res.json(notes);
});

// POST create a new note
router.post("/", (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required" });
  }

  const newNote = {
    id: nextId++,
    title,
    content,
  };

  notes.push(newNote);
  res.status(201).json(newNote);
});

// DELETE a note by ID
router.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const noteIndex = notes.findIndex((note) => note.id === id);

  if (noteIndex === -1) {
    return res.status(404).json({ error: "Note not found" });
  }

  notes.splice(noteIndex, 1);
  res.status(204).send();
});

export default router;
