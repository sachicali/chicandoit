import React, { useState } from 'react';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

const TaskManager = ({ tasks, onCreateTask, onUpdateTask }) => {
  const [newTask, setNewTask] = useState({
    task: '',
    priority: 'medium',
    estimatedTime: 60,
    category: 'general'
  });
  const [isAddingTask, setIsAddingTask] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTask.task.trim()) return;

    try {
      await onCreateTask(newTask);
      setNewTask({
        task: '',
        priority: 'medium',
        estimatedTime: 60,
        category: 'general'
      });
      setIsAddingTask(false);
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const toggleTaskStatus = async (task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    await onUpdateTask(task.id, { status: newStatus });
  };

  const updateTaskPriority = async (task, priority) => {
    await onUpdateTask(task.id, { priority });
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high':
        return 'border-red-200 bg-red-50 text-red-800';
      case 'medium':
        return 'border-yellow-200 bg-yellow-50 text-yellow-800';
      case 'low':
        return 'border-green-200 bg-green-50 text-green-800';
      default:
        return 'border-gray-200 bg-gray-50 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">{
      /* This needs to be properly structured as a complete component */
    }

      <div className="p-6">
        {tasks.length === 0 ? (
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No tasks added yet. Create your first task to get started!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`border rounded-lg p-4 transition-all ${getPriorityColor(task.priority)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => toggleTaskStatus(task)}
                      className={`p-1 rounded-full transition-colors ${
                        task.status === 'completed'
                          ? 'text-green-600 bg-green-100'
                          : 'text-gray-400 hover:text-green-600'
                      }`}
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                    
                    <div className="flex-1">
                      <h3
                        className={`font-medium ${
                          task.status === 'completed'
                            ? 'line-through text-gray-500'
                            : 'text-gray-900'
                        }`}
                      >
                        {task.task}
                      </h3>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {task.estimatedTime}min
                        </span>
                        <span className="capitalize">{task.category}</span>
                        {task.createdAt && (
                          <span>
                            Added {new Date(task.createdAt).toLocaleTimeString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                    <select
                      value={task.priority}
                      onChange={(e) => updateTaskPriority(task, e.target.value)}
                      className={`px-2 py-1 rounded text-xs font-medium border-0 ${getPriorityColor(task.priority)}`}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskManager;