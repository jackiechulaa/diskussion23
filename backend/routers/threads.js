// routes/threads.js
const express = require("express");
const router = express.Router();
const db = require("../db/database1");

// Hämta alla trådar
router.get("/", (req, res) => {
  try {
    const threads = db
      .prepare("SELECT * FROM threads ORDER BY created_at DESC")
      .all();
    res.json(threads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Hämta en specifik tråd med svar
router.get("/:id", (req, res) => {
  try {
    const threadId = req.params.id;

    // Hämta tråden
    const thread = db
      .prepare("SELECT * FROM threads WHERE id = ?")
      .get(threadId);

    if (!thread) {
      return res.status(404).json({ error: "Tråden hittades inte" });
    }

    // Hämta svar till tråden
    const replies = db
      .prepare(
        "SELECT * FROM replies WHERE thread_id = ? ORDER BY created_at ASC"
      )
      .all(threadId);

    res.json({ thread, replies });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Skapa en ny tråd
router.post("/", (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: "Titel och innehåll krävs" });
    }

    const result = db
      .prepare("INSERT INTO threads (title, content) VALUES (?, ?)")
      .run(title, content);

    res.status(201).json({
      id: result.lastInsertRowid,
      title,
      content,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Skapa ett svar på en tråd
router.post("/:id/replies", (req, res) => {
  try {
    const threadId = req.params.id;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: "Innehåll krävs" });
    }

    // Kontrollera om tråden existerar
    const thread = db
      .prepare("SELECT * FROM threads WHERE id = ?")
      .get(threadId);
    if (!thread) {
      return res.status(404).json({ error: "Tråden hittades inte" });
    }

    const result = db
      .prepare("INSERT INTO replies (thread_id, content) VALUES (?, ?)")
      .run(threadId, content);

    res.status(201).json({
      id: result.lastInsertRowid,
      thread_id: threadId,
      content,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
