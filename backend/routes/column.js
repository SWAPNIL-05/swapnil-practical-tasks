const express = require("express");
const Board = require("../models/Board");
const Column = require("../models/Column");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
router.get("/:boardId", authMiddleware, async (req, res) => {
  try {
    const board = await Board.findOne({
      _id: req.params.boardId,
      userId: req.user.userId,
    });

    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }

    const columns = await Column.find({ boardId: req.params.boardId });
    res.status(200).json(columns);
  } catch (error) {
    res.status(500).json({ error: "Error fetching columns" });
  }
});


module.exports = router;
