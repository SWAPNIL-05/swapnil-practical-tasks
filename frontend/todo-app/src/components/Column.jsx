import React, { useState } from "react";
import { Droppable } from "react-beautiful-dnd";
import { useDispatch, useSelector } from "react-redux";
import Task from "./Task";
import { createTask } from "../redux/slices/taksSlice";

const Column = ({ column, tasks, onDeleteTask }) => {
  const [showForm, setShowForm] = useState(false);
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.tasks);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
  });
  const [taksErrors, setTaskErrors] = useState({});
  const validateForm = () => {
    const errors = {};
    if (newTask.title.trim() === "") {
      errors.title = "Task title cannot be empty";
    }
    if (newTask.description.trim() === "") {
      errors.description = "Task description cannot be empty";
    }
    if (!newTask.dueDate) {
      errors.dueDate = "Due date is required";
    }
    setTaskErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    dispatch(createTask({ ...newTask, columnId: column._id }));
    setNewTask({
      title: "",
      description: "",
      priority: "medium",
      dueDate: "",
    });
    setShowForm(false);
  };
  return (
    <div className="bg-gray-200 rounded-lg shadow-md flex-shrink-0 p-4 w-64 mr-4">
      <h3 className="text-lg font-semibold mb-4">{column.title}</h3>
      {error && (
        <div className="mb-4 text-red-500 bg-red-100 p-3 rounded">{error}</div>
      )}
      {loading && (
        <div className="text-center text-gray-500">Loading tasks...</div>
      )}
      {tasks.length === 0 && !loading && (
        <div className="text-center text-gray-500">
          No tasks in this column
        </div>
      )}
      <Droppable droppableId={column._id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="space-y-4 min-h-[50px] transition-colors duration-200"
          >
            {tasks.length === 0 && snapshot.isDraggingOver && (
              <div className="p-4 border-2 border-dashed border-blue-400 rounded bg-blue-50 text-center text-sm text-blue-600">
                Drop here
              </div>
            )}

            {tasks.map((task, index) => (
              <Task
                key={task._id}
                task={task}
                index={index}
                onDelete={onDeleteTask}
              />
            ))}

            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="w-full mt-4 text-sm cursor-pointer text-blue-600 hover:underline"
        >
          ➕ Add Task
        </button>
      ) : (
        <form onSubmit={handleAddTask} className="mt-4 space-y-2">
          <input
            type="text"
            placeholder="Task Title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded"
          />
          {taksErrors.title && (
            <div className="text-red-500 text-sm mt-1">{taksErrors.title}</div>
          )}

          <textarea
            placeholder="Description"
            value={newTask.description}
            onChange={(e) =>
              setNewTask({ ...newTask, description: e.target.value })
            }
            className="w-full p-2 border border-gray-300 rounded"
          />
          {taksErrors.description && (
            <div className="text-red-500 text-sm mt-1">
              {taksErrors.description}
            </div>
          )}

          <select
            value={newTask.priority}
            onChange={(e) =>
              setNewTask({ ...newTask, priority: e.target.value })
            }
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="low">low</option>
            <option value="medium">medium</option>
            <option value="high">high</option>
          </select>

          <input
            type="date"
            value={newTask.dueDate}
            onChange={(e) =>
              setNewTask({ ...newTask, dueDate: e.target.value })
            }
            className="w-full p-2 border border-gray-300 rounded"
          />
          {taksErrors.dueDate && (
            <div className="text-red-500 text-sm mt-1">
              {taksErrors.dueDate}
            </div>
          )}

          <div className="flex gap-2">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              {loading ? "Adding..." : "Add Task"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="w-full bg-gray-300 text-black p-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Column;
