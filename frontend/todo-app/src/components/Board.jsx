import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import {
  createBoard,
  deleteBoard,
  fetchBoards,
  setSelectedBoard,
  updateBoard,
  setColumns,
} from "../redux/slices/boardSlice";
import { DragDropContext } from "react-beautiful-dnd";
import Column from "./Column";
import { deleteTask, fetchTasks, updateTask } from "../redux/slices/taksSlice";
const API_URL = "http://localhost:5000/column";
const Board = () => {
  const dispatch = useDispatch();
  const { boards, selectedBoard, columns, loading, error } = useSelector(
    (state) => state.board
  );
  const { tasks } = useSelector((state) => state.tasks);
  const [boardError, setBoardError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [newBoardName, setNewBoardName] = useState("");
  const handleLogout = () => {
    dispatch(logout());
  };

  useEffect(() => {
    dispatch(fetchBoards());
  }, [dispatch]);

  useEffect(() => {
    if (selectedBoard?._id) {
      dispatch(fetchTasks(selectedBoard._id));
      axios
        .get(`${API_URL}/${selectedBoard._id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          dispatch(setColumns(response.data));
        })
        .catch((error) => {
          console.error("Error fetching columns:", error);
        });
    }
  }, [selectedBoard, dispatch]);
  const handleCreateBoard = (e) => {
    e.preventDefault();
    if (newBoardName.trim() === "") {
      setBoardError("Board name cannot be empty");
      return;
    }
    dispatch(createBoard({ title: newBoardName }));
    setNewBoardName("");
  };
  const handleDeleteTask = (taskId) => {
    dispatch(deleteTask(taskId));
  };
  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    dispatch(
      updateTask({
        taskId: draggableId,
        columnId: destination.droppableId,
        index: destination.index,
      })
    );
  };

  const handleUpdateSelectedBoard = (boardId, title) => {
    if (!title) return;
    dispatch(updateBoard({ boardId: boardId, title }));
  };

  const handleDeleteBoard = (boardId) => {
    dispatch(deleteBoard(boardId));
    if (selectedBoard?._id === boardId) {
      dispatch(setSelectedBoard(null));
    }
  };
  return (
    <>
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Task Board</h1>

          <button
            onClick={handleLogout}
            className="px-4 py-2  cursor-pointer bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
        {loading && <p className="text-gray-500">Loading boards...</p>}
        {boardError && <p className="text-red-500">{boardError}</p>}
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleCreateBoard} className="mb-6 flex space-x-2">
          <input
            type="text"
            placeholder="Create a new board"
            className="border border-gray-300 p-2 rounded w-full"
            value={newBoardName}
            onChange={(e) => setNewBoardName(e.target.value)}
          />
          <button
            type="submit"
            className="ml-2 px-4 py-2 cursor-pointer bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Create Board
          </button>
        </form>
        <div className="mb-6">
          <select
            key={selectedBoard?._id || "select-board"}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={selectedBoard?._id || ""}
            onChange={(e) => {
              const boardId = e.target.value;
              const board = boards.find((b) => b._id === boardId);
              if (board) {
                dispatch(setSelectedBoard(board));
              }
            }}
          >
            <option value="" disabled>
              Select a board
            </option>
            {boards.map((board) => (
              <option key={board._id} value={board._id}>
                {board.title}
              </option>
            ))}
          </select>
        </div>
        {!selectedBoard && (
          <>
            <div className="bg-white shadow-md rounded-lg p-6">
              <p className="text-gray-500">
                No board selected. Please select a board from the dropdown to
                view or create tasks.
              </p>
            </div>
          </>
        )}
        {selectedBoard && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 bg-white p-4 rounded-lg shadow">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">
                📋 {selectedBoard.title}
              </h2>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    const newTitle = prompt(
                      "Enter new board title",
                      selectedBoard.title
                    );
                    if (newTitle?.trim()) {
                      handleUpdateSelectedBoard(
                        selectedBoard._id,
                        newTitle.trim()
                      );
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2  cursor-pointer  bg-yellow-500 text-white font-medium rounded-md shadow hover:bg-yellow-600 transition"
                >
                  ✏️ Edit
                </button>

                <button
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to delete this board?"
                      )
                    ) {
                      handleDeleteBoard(selectedBoard._id);
                    }
                  }}
                  className="flex items-center gap-2 px-4 cursor-pointer py-2 bg-red-500 text-white font-medium rounded-md shadow hover:bg-red-600 transition"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <DragDropContext onDragEnd={handleDragEnd}>
              <div className="flex space-x-4 mt-6 overflow-x-auto">
                {columns.map((column) => (
                  <Column
                    key={column._id}
                    column={column}
                    tasks={tasks.filter(
                      (task) =>
                        task.columnId === column._id &&
                        (task.title
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase()) ||
                          task.description
                            ?.toLowerCase()
                            .includes(searchQuery.toLowerCase()))
                    )}
                    onDeleteTask={handleDeleteTask}
                  />
                ))}
              </div>
            </DragDropContext>
          </div>
        )}
      </div>
    </>
  );
};

export default Board;
