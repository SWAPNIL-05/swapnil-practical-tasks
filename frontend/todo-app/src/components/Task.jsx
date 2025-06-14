import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { FiTrash2, FiCalendar, FiFlag } from 'react-icons/fi';

const Task = ({ task, index, onDelete }) => {
  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}npm 
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-white rounded-xl shadow p-4 mb-4 border border-gray-200 hover:shadow-md transition-all duration-200"
        >
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-semibold text-gray-800 text-lg">{task.title}</h4>
            <button
              onClick={() => onDelete(task._id)}
              className="text-red-500 hover:text-red-700 transition"
              title="Delete Task"
            >
              <FiTrash2 />
            </button>
          </div>

          <p className="text-gray-600 text-sm mb-2">
            {task.description || <span className="italic text-gray-400">No description</span>}
          </p>

          <div className="flex flex-col gap-1 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <FiCalendar />
              <span>
                Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FiFlag />
              <span className={`capitalize px-2 py-0.5 rounded text-xs font-medium ${
                task.priority === 'high' ? 'bg-red-100 text-red-700' :
                task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-green-100 text-green-700'
              }`}>
                {task.priority || 'medium'}
              </span>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default Task;
