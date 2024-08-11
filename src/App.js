import React, { useState, useEffect } from 'react';
import { PlusCircle, Trash2, CheckCircle, Circle, Edit, X, Calendar, Clock, Tag, ChevronDown } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const priorities = {
  low: { class: 'bg-green-100 text-green-800 border-green-300', label: 'Poco Importante', icon: '🟢' },
  medium: { class: 'bg-yellow-100 text-yellow-800 border-yellow-300', label: 'Importante', icon: '🟡' },
  high: { class: 'bg-red-100 text-red-800 border-red-300', label: 'Muy Importante', icon: '🔴' }
};

const categories = [
  { value: 'Personal', icon: '👤' },
  { value: 'Trabajo', icon: '💼' },
  { value: 'Estudio', icon: '📚' },
  { value: 'Hogar', icon: '🏠' },
  { value: 'Salud', icon: '❤️' }
];

const TodoApp = () => {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [newTask, setNewTask] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('Personal');
  const [dueDate, setDueDate] = useState(null);
  const [filter, setFilter] = useState('all');
  const [editingTask, setEditingTask] = useState(null);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e) => {
    e.preventDefault();
    if (newTask.trim()) {
      const newTaskObj = {
        id: Date.now(),
        text: newTask,
        completed: false,
        priority,
        category,
        dueDate: dueDate ? dueDate.toISOString() : null,
        details: '',
        createdAt: new Date().toISOString()
      };
      setTasks([...tasks, newTaskObj]);
      setNewTask('');
      setDueDate(null);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const startEditingTask = (task) => {
    setEditingTask({ ...task, dueDate: task.dueDate ? new Date(task.dueDate) : null });
  };

  const saveEditingTask = () => {
    setTasks(tasks.map(task =>
      task.id === editingTask.id ? { ...editingTask, dueDate: editingTask.dueDate ? editingTask.dueDate.toISOString() : null } : task
    ));
    setEditingTask(null);
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'Todas') return true;
    if (filter === 'Completadas') return task.completed;
    if (filter === 'Activas') return !task.completed;
    return true;
  });

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const CustomDatePickerInput = React.forwardRef(({ value, onClick }, ref) => (
    <div className="relative">
      <input
        value={value}
        onClick={onClick}
        ref={ref}
        readOnly
        placeholder="Fecha límite"
        className="w-full bg-white border-2 border-blue-300 rounded-lg py-2 px-4 pr-10 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-300 cursor-pointer"
      />
      <Calendar size={20} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 pointer-events-none" />
    </div>
  ));

  return (
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-2xl">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Organizador de Tareas</h1>
      
      {showAlert && (
        <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg shadow-md transition-all duration-500 ease-in-out transform hover:scale-105">
          ¡Tarea añadida con éxito! 🎉
        </div>
      )}
      
      <form onSubmit={addTask} className="mb-8">
        <div className="flex mb-4">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Nueva tarea"
            className="flex-grow p-3 border-2 border-blue-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-300"
          />
          <button type="submit" className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-r-lg hover:from-blue-600 hover:to-purple-600 transition duration-300 transform hover:scale-105">
            <PlusCircle size={24} />
          </button>
        </div>
        <div className="flex space-x-4">
          <div className="relative flex-1">
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full appearance-none bg-white border-2 border-blue-300 rounded-lg py-2 px-4 pr-8 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-300"
            >
              {Object.entries(priorities).map(([key, { label, icon }]) => (
                <option key={key} value={key}>{icon} {label}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-blue-500">
              <ChevronDown size={20} />
            </div>
          </div>
          <div className="relative flex-1">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full appearance-none bg-white border-2 border-blue-300 rounded-lg py-2 px-4 pr-8 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-300"
            >
              {categories.map(({ value, icon }) => (
                <option key={value} value={value}>{icon} {value}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-blue-500">
              <ChevronDown size={20} />
            </div>
          </div>
          <div className="relative flex-1">
            <DatePicker
              selected={dueDate}
              onChange={(date) => setDueDate(date)}
              dateFormat="dd/MM/yyyy"
              placeholderText="Fecha límite"
              className="w-full"
              customInput={<CustomDatePickerInput />}
              showPopperArrow={false}
              calendarClassName="bg-white shadow-lg rounded-lg border-2 border-blue-300"
              wrapperClassName="w-full"
            />
          </div>
        </div>
      </form>
      
      <div className="mb-6 flex justify-between items-center">
        <div className="flex space-x-2">
          {['Todas', 'Activas', 'Completadas'].map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption)}
              className={`px-4 py-2 rounded-full transition-all duration-300 ${
                filter === filterOption
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-blue-500 hover:bg-blue-100'
              }`}
            >
              {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      <ul className="space-y-4">
        {filteredTasks.map(task => (
          <li key={task.id} className={`p-4 rounded-lg border-2 ${priorities[task.priority].class} ${task.completed ? 'opacity-60' : ''} transition-all duration-300 ease-in-out transform hover:scale-102 hover:shadow-lg`}>
            {editingTask && editingTask.id === task.id ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editingTask.text}
                  onChange={(e) => setEditingTask({...editingTask, text: e.target.value})}
                  className="w-full p-2 border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                />
                <textarea
                  value={editingTask.details}
                  onChange={(e) => setEditingTask({...editingTask, details: e.target.value})}
                  placeholder="Detalles de la tarea..."
                  className="w-full p-2 border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  rows="3"
                />
                <DatePicker
                  selected={editingTask.dueDate}
                  onChange={(date) => setEditingTask({...editingTask, dueDate: date})}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Fecha límite"
                  className="w-full"
                  customInput={<CustomDatePickerInput />}
                  showPopperArrow={false}
                  calendarClassName="bg-white shadow-lg rounded-lg border-2 border-blue-300"
                  wrapperClassName="w-full"
                />
                <div className="flex justify-end space-x-2">
                  <button onClick={saveEditingTask} className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 transform hover:scale-105">
                    <CheckCircle size={20} />
                  </button>
                  <button onClick={() => setEditingTask(null)} className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 transform hover:scale-105">
                    <X size={20} />
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button onClick={() => toggleTask(task.id)} className="focus:outline-none transition duration-300 transform hover:scale-110">
                      {task.completed ? <CheckCircle size={24} className="text-green-500" /> : <Circle size={24} className="text-gray-400" />}
                    </button>
                    <span className={`text-lg ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>{task.text}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800">{categories.find(c => c.value === task.category).icon} {task.category}</span>
                    <button onClick={() => startEditingTask(task)} className="text-blue-500 hover:text-blue-600 transition duration-300 transform hover:scale-110">
                      <Edit size={20} />
                    </button>
                    <button onClick={() => deleteTask(task.id)} className="text-red-500 hover:text-red-600 transition duration-300 transform hover:scale-110">
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
                {task.details && (
                  <p className="mt-2 text-sm text-gray-600 bg-white bg-opacity-50 p-2 rounded">{task.details}</p>
                )}
                <div className="mt-3 flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Calendar size={16} className="mr-1 text-blue-500" />
                    {formatDate(task.createdAt)}
                  </span>
                  {task.dueDate && (
                    <span className="flex items-center">
                      <Clock size={16} className="mr-1 text-yellow-500" />
                      Fecha límite: {formatDate(task.dueDate)}
                    </span>
                  )}
                  <span className="flex items-center">
                    <Tag size={16} className="mr-1 text-purple-500" />
                    {priorities[task.priority].icon} {priorities[task.priority].label}
                  </span>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoApp;