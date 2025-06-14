const express = require("express");
const Board = require("../models/Board");
const Column = require("../models/Column");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

// Create a new board
router.post("/create", authMiddleware, async (req, res) => {
  const { title } = req.body;
  try {
    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }
    const board = new Board({ title, userId: req.user.userId });
    await board.save();

    const columns = [
      { title: "To Do", boardId: board._id },
      { title: "In Progress", boardId: board._id },
      { title: "Done", boardId: board._id },
    ];
    const columnsCreated = await Column.insertMany(columns);

    res.status(201).json({ board, columns: columnsCreated });
  } catch (error) {
    res.status(500).json({ error: "Error creating board" });
  }
});
// Get all boards for the authenticated user
router.get("/getAllBoards", authMiddleware, async (req, res) => {
  try {
    const boards = await Board.find({ userId: req.user.userId })
    res.status(200).json(boards);
  } catch (error) {
    res.status(500).json({ error: "Error fetching boards" });
  }
});
// Delete a board by ID
router.delete("/delete/:boardId", authMiddleware, async (req, res) => {
  const { boardId } = req.params;
  try {
    const board = await Board.findById(boardId);
    if (!board || board.userId.toString() !== req.user.userId.toString()) {
      return res.status(404).json({ error: "Board not found" });
    }
    await Column.deleteMany({ boardId: board._id });
    await Board.findByIdAndDelete(boardId);
    res.status(200).json({ message: "Board deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting board" });
  }
});

// // Update a board by ID
router.put("/update/:boardId", authMiddleware, async (req, res) => {
  const { boardId } = req.params;
  const { title } = req.body;
  try {
    const board = await Board.findById(boardId);
    if (!board || board.userId.toString() !== req.user.userId.toString()) {
      return res.status(404).json({ error: "Board not found" });
    }
    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }
    board.title = title;
    await board.save();
    res.status(200).json(board);
  } catch (error) {
    res.status(500).json({ error: "Error updating board" });
  }
});

module.exports = router;
