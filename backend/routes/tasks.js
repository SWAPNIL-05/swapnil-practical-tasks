const express = require("express");
const Task = require("../models/Task");
const Column = require("../models/Column");
const Board = require("../models/Board");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

router.get("/:boardId", authMiddleware, async (req, res) => {
  try {
    const columns = await Column.find({ boardId: req.params.boardId });
    const columnIds = columns.map((column) => column._id);

    const tasks = await Task.find({ columnId: { $in: columnIds } }).sort({
      index: 1,
    });
    console.log(tasks, "tasks");

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Error fetching tasks" });
  }
});
// Create a new task
router.post("/create", authMiddleware, async (req, res) => {
  const { title, description, columnId, dueDate, priority } = req.body;
  try {
    if (!title || !columnId) {
      return res
        .status(400)
        .json({ error: "Title and column ID are required" });
    }
  const userBoardIds = await Board.find({ userId: req.user.userId }).distinct("_id");
  console.log(userBoardIds, "userBoardIds");
      const column = await Column.findOne({
      _id: columnId,
      boardId: { $in: userBoardIds },
    });
    if (!column) {
      return res.status(404).json({ error: "Column not found" });
    }
   const maxIndexTask = await Task.findOne({ columnId }).sort({ index: -1 }).lean();
const maxIndex = typeof maxIndexTask?.index === 'number' ? maxIndexTask.index : -1;
const index = maxIndex + 1;

const task = new Task({
  title,
  description,
  dueDate,
  priority: priority || "medium",
  columnId,
  index,
  userId: req.user.userId,
});
await task.save();
    res.status(201).json(task);
 } catch (error) {
  console.error("Error creating task:", error);
  res.status(500).json({ error: "Error creating task", details: error.message });
}
});

router.put("/update/:taskId", authMiddleware, async (req, res) => {
  const { taskId } = req.params;
  const { title, description, dueDate, priority, columnId, index } = req.body;

  try {
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    if (columnId) {
      const column = await Column.findOne({
        _id: columnId,
        boardId: {
          $in: await Board.find({ userId: req.user.userId }).distinct("_id"),
        },
      });
      if (!column) {
        return res.status(404).json({ error: "Column not found" });
      }
    }
    const updateFields = {
      title: title || task.title,
      description: description || task.description,
      dueDate: dueDate || task.dueDate,
      priority: priority || task.priority,
      columnId: columnId || task.columnId,
      index: index !== undefined ? index : task.index,
    };
    const updatedTask = await Task.findByIdAndUpdate(taskId, updateFields, {
      new: true,
    });

    return res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: "Error updating task" });
  }
});

router.delete("/delete/:taskId", authMiddleware, async (req, res) => {
  const { taskId } = req.params;
  try {
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    const column = await Column.findOne({
      _id: task.columnId,
      boardId: {
        $in: await Board.find({ userId: req.user.userId }).distinct("_id"),
      },
    });
    if (!column) {
      return res.status(404).json({ error: "Column not found" });
    }
   await Task.findByIdAndDelete(taskId);

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting task" });
  }
});

module.exports = router;
