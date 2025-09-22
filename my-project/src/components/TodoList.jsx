import React, { useState, useEffect } from 'react';
import AddTodo from './AddTodo.jsx';
import TodoItem from './TodoItem.jsx';
import { taskService } from '../services/taskService.js';

// Custom CSS animations
const customStyles = `
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(180deg); }
  }
  
  @keyframes float-delay-1 {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-15px) rotate(-180deg); }
  }
  
  @keyframes float-delay-2 {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-25px) rotate(270deg); }
  }
  
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  .animate-float {
    animation: float 6s ease-in-out infinite;
  }
  
  .animate-float-delay-1 {
    animation: float-delay-1 8s ease-in-out infinite;
  }
  
  .animate-float-delay-2 {
    animation: float-delay-2 10s ease-in-out infinite;
  }
  
  .animate-spin-slow {
    animation: spin-slow 20s linear infinite;
  }
  
  .bg-gradient-radial {
    background: radial-gradient(circle, var(--tw-gradient-stops));
  }
`;

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, pending, completed

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await taskService.getAllTasks();
      setTasks(response.data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Failed to load tasks. Please check if the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (taskData) => {
    try {
      // Handle both string (legacy) and object (new) formats
      const title = typeof taskData === 'string' ? taskData : taskData.title;
      const response = await taskService.createTask(title);
      setTasks(prevTasks => [response.data, ...prevTasks]);
    } catch (error) {
      console.error('Error adding task:', error);
      throw error;
    }
  };

  const handleUpdateTask = async (id, taskData) => {
    try {
      const response = await taskService.updateTask(id, taskData);
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task._id === id ? response.data : task
        )
      );
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await taskService.deleteTask(id);
      setTasks(prevTasks => prevTasks.filter(task => task._id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  };

  const handleToggleTask = async (id) => {
    try {
      const response = await taskService.toggleTask(id);
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task._id === id ? response.data : task
        )
      );
    } catch (error) {
      console.error('Error toggling task:', error);
      throw error;
    }
  };

  // Using ES6 array methods and destructuring
  const filteredTasks = tasks.filter(task => {
    switch (filter) {
      case 'pending':
        return !task.status;
      case 'completed':
        return task.status;
      default:
        return true;
    }
  });

  const completedCount = tasks.filter(task => task.status).length;
  const pendingCount = tasks.filter(task => !task.status).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20">
        <div className="text-center glass-card rounded-3xl p-10 max-w-md mx-auto shadow-2xl border border-white/20 backdrop-blur-xl">
          <div className="relative mb-8">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-emerald-200 dark:border-emerald-300 border-t-emerald-600 dark:border-t-emerald-400 mx-auto shadow-lg"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 opacity-30 animate-pulse"></div>
          </div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent mb-3">Loading your tasks</h3>
          <p className="text-slate-600 dark:text-slate-300 text-lg">Please wait while we fetch your data...</p>
          <div className="mt-6 flex justify-center space-x-2">
            <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full animate-bounce shadow-sm"></div>
            <div className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full animate-bounce shadow-sm" style={{animationDelay: '0.1s'}}></div>
            <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-bounce shadow-sm" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-red-900/20 dark:to-orange-900/20">
        <div className="text-center glass-card rounded-3xl p-10 max-w-md mx-auto shadow-2xl border border-red-200/50 backdrop-blur-xl">
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-red-400 via-red-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl animate-pulse">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-4">Connection Error</h2>
          <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed mb-8">{error}</p>
          <button
            onClick={fetchTasks}
            className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-200 shadow-lg hover:shadow-xl transform"
          >
            <span className="flex items-center">
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Try Again
            </span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Inject custom styles */}
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      
      <div className="min-h-screen py-6 px-4 sm:py-12 bg-gradient-to-br from-violet-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-violet-900/20 dark:to-blue-900/20 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Animated floating shapes */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-violet-400/20 to-purple-400/20 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-xl animate-float-delay-1"></div>
        <div className="absolute bottom-40 left-20 w-40 h-40 bg-gradient-to-br from-pink-400/20 to-rose-400/20 rounded-full blur-xl animate-float-delay-2"></div>
        <div className="absolute bottom-20 right-10 w-28 h-28 bg-gradient-to-br from-indigo-400/20 to-blue-400/20 rounded-full blur-xl animate-float"></div>
        
        {/* Geometric patterns */}
        <div className="absolute top-1/4 left-1/4 opacity-10 dark:opacity-5">
          <svg width="200" height="200" viewBox="0 0 200 200" className="text-violet-500 animate-spin-slow">
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="200" height="200" fill="url(#grid)" />
          </svg>
        </div>
        
        <div className="absolute top-3/4 right-1/4 opacity-10 dark:opacity-5">
          <svg width="150" height="150" viewBox="0 0 150 150" className="text-blue-500 animate-pulse">
            <circle cx="75" cy="75" r="70" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="10,10"/>
            <circle cx="75" cy="75" r="50" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5"/>
            <circle cx="75" cy="75" r="30" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="3,3"/>
          </svg>
        </div>
        
        {/* Floating icons */}
        <div className="absolute top-32 right-32 opacity-20 animate-float-delay-1">
          <svg className="w-16 h-16 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        
        <div className="absolute bottom-32 left-32 opacity-20 animate-float-delay-2">
          <svg className="w-20 h-20 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
          </svg>
        </div>
        
        {/* Gradient orbs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-radial from-violet-300/30 via-purple-200/20 to-transparent blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-radial from-blue-300/30 via-cyan-200/20 to-transparent blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-radial from-pink-200/20 via-rose-100/10 to-transparent blur-3xl"></div>
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header with enhanced styling */}
        <div className="text-center mb-8 sm:mb-12 relative">
          {/* Background decoration for header */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 dark:opacity-3">
            <svg width="400" height="300" viewBox="0 0 400 300" className="text-violet-500">
              <defs>
                <radialGradient id="headerGradient" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="currentColor" stopOpacity="0.3"/>
                  <stop offset="100%" stopColor="currentColor" stopOpacity="0"/>
                </radialGradient>
              </defs>
              <circle cx="200" cy="150" r="120" fill="url(#headerGradient)"/>
              <circle cx="200" cy="150" r="80" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="5,5" opacity="0.5"/>
              <circle cx="200" cy="150" r="40" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3,3" opacity="0.7"/>
            </svg>
          </div>
          
          <div className="inline-block animate-float mb-6 relative z-10">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mb-6 shadow-2xl hover:shadow-violet-500/25 transition-all duration-300 hover:scale-110 relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-violet-400 via-purple-400 to-pink-400 rounded-3xl blur-xl opacity-70 animate-pulse"></div>
              <svg className="w-10 h-10 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 leading-tight">
            Todo App
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Stay organized and boost your productivity with our beautiful task management system
          </p>
        </div>

        {/* Enhanced responsive grid layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8">
          
          {/* Main content area */}
          <div className="xl:col-span-8 space-y-6">
            {/* Add Todo Component */}
            <AddTodo onAddTask={handleAddTask} loading={loading} />

            {/* Enhanced Filter Section */}
            <div className="glass-card rounded-3xl p-8 bg-gradient-to-br from-white/80 via-blue-50/50 to-purple-50/50 dark:from-slate-800/80 dark:via-blue-900/30 dark:to-purple-900/30 border border-white/30 backdrop-blur-xl shadow-xl relative overflow-hidden">
              {/* Background pattern */}
              <div className="absolute top-0 right-0 opacity-5 dark:opacity-3 pointer-events-none">
                <svg width="200" height="150" viewBox="0 0 200 150" className="text-violet-400">
                  <path d="M0,75 Q50,25 100,75 T200,75" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <path d="M0,100 Q50,50 100,100 T200,100" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.7"/>
                  <path d="M0,50 Q50,0 100,50 T200,50" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.5"/>
                </svg>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 relative z-10">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                  Manage Your Tasks
                </h2>
                <div className="flex items-center text-sm text-slate-600 dark:text-slate-300 bg-white/60 dark:bg-slate-700/60 px-4 py-2 rounded-full border border-violet-200 dark:border-violet-700">
                  <svg className="w-4 h-4 mr-2 text-violet-500 dark:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Last updated: {new Date().toLocaleDateString()}
                </div>
              </div>

              {/* Filter Buttons with enhanced design */}
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg ${
                    filter === 'all'
                      ? 'bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 text-white shadow-violet-500/25'
                      : 'bg-white/80 dark:bg-slate-700/80 text-slate-700 dark:text-slate-300 hover:bg-violet-50 dark:hover:bg-violet-900/30 border border-violet-200 dark:border-violet-700 hover:border-violet-300 dark:hover:border-violet-400 hover:shadow-violet-200/50'
                  }`}
                >
                  <span className="flex items-center">
                    <span className="w-3 h-3 rounded-full bg-current mr-3 shadow-sm"></span>
                    All Tasks ({tasks.length})
                  </span>
                </button>
                <button
                  onClick={() => setFilter('pending')}
                  className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg ${
                    filter === 'pending'
                      ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white shadow-amber-500/25'
                      : 'bg-white/80 dark:bg-slate-700/80 text-slate-700 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-amber-900/30 border border-amber-200 dark:border-amber-700 hover:border-amber-300 dark:hover:border-amber-400 hover:shadow-amber-200/50'
                  }`}
                >
                  <span className="flex items-center">
                    <span className="w-3 h-3 rounded-full bg-current mr-3 shadow-sm"></span>
                    Pending ({pendingCount})
                  </span>
                </button>
                <button
                  onClick={() => setFilter('completed')}
                  className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg ${
                    filter === 'completed'
                      ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-emerald-500/25'
                      : 'bg-white/80 dark:bg-slate-700/80 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700 hover:border-emerald-300 dark:hover:border-emerald-400 hover:shadow-emerald-200/50'
                  }`}
                >
                  <span className="flex items-center">
                    <span className="w-3 h-3 rounded-full bg-current mr-3 shadow-sm"></span>
                    Completed ({completedCount})
                  </span>
                </button>
              </div>
            </div>

            {/* Tasks List with enhanced styling */}
            <div className="glass-card rounded-3xl p-8 bg-gradient-to-br from-white/90 via-indigo-50/50 to-blue-50/50 dark:from-slate-800/90 dark:via-indigo-900/30 dark:to-blue-900/30 border border-white/40 backdrop-blur-xl shadow-xl relative overflow-hidden">
              {/* Background decorative elements */}
              <div className="absolute bottom-0 left-0 opacity-5 dark:opacity-3 pointer-events-none">
                <svg width="300" height="200" viewBox="0 0 300 200" className="text-indigo-400">
                  <defs>
                    <pattern id="dots" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
                      <circle cx="15" cy="15" r="2" fill="currentColor"/>
                    </pattern>
                  </defs>
                  <rect width="300" height="200" fill="url(#dots)" opacity="0.3"/>
                </svg>
              </div>
              
              <div className="absolute top-0 right-0 opacity-10 dark:opacity-5 pointer-events-none">
                <svg width="150" height="150" viewBox="0 0 150 150" className="text-blue-400">
                  <polygon points="75,10 90,50 130,50 100,75 115,115 75,90 35,115 50,75 20,50 60,50" fill="currentColor" opacity="0.3"/>
                  <polygon points="75,25 85,55 115,55 95,75 105,105 75,85 45,105 55,75 35,55 65,55" fill="none" stroke="currentColor" strokeWidth="1"/>
                </svg>
              </div>
              
              <div className="flex items-center justify-between mb-8 relative z-10">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                  {filter === 'all' && 'All Tasks'}
                  {filter === 'pending' && 'Pending Tasks'}
                  {filter === 'completed' && 'Completed Tasks'}
                </h3>
                {filteredTasks.length > 0 && (
                  <span className="text-sm text-white bg-gradient-to-r from-indigo-500 to-blue-500 px-4 py-2 rounded-full border border-indigo-200 dark:border-indigo-700 shadow-lg font-medium">
                    {filteredTasks.length} {filteredTasks.length === 1 ? 'item' : 'items'}
                  </span>
                )}
              </div>

              {filteredTasks.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 dark:from-indigo-900/50 dark:via-purple-900/50 dark:to-pink-900/50 rounded-3xl flex items-center justify-center shadow-2xl">
                    <svg className="w-16 h-16 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
                    {filter === 'all' && 'No tasks yet'}
                    {filter === 'pending' && 'No pending tasks'}
                    {filter === 'completed' && 'No completed tasks'}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-xl leading-relaxed max-w-lg mx-auto">
                    {filter === 'all' && 'Create your first task to get started on your productivity journey!'}
                    {filter === 'pending' && 'Fantastic! All your tasks are completed! 🎉'}
                    {filter === 'completed' && 'Complete some tasks to see them here and track your progress.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredTasks.map((task, index) => (
                    <div
                      key={task._id}
                      className="transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <TodoItem
                        task={task}
                        onUpdateTask={handleUpdateTask}
                        onDeleteTask={handleDeleteTask}
                        onToggleTask={handleToggleTask}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Sidebar with Stats */}
          <div className="xl:col-span-4 space-y-8">
            {/* Enhanced Stats Dashboard */}
            <div className="glass-card rounded-3xl p-8 bg-gradient-to-br from-white/90 via-cyan-50/50 to-blue-50/50 dark:from-slate-800/90 dark:via-cyan-900/30 dark:to-blue-900/30 border border-white/40 backdrop-blur-xl shadow-xl relative overflow-hidden">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-5 dark:opacity-3 pointer-events-none">
                <svg width="100%" height="100%" className="text-cyan-400">
                  <defs>
                    <pattern id="statsPattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                      <rect x="0" y="0" width="60" height="60" fill="none"/>
                      <path d="M30 10 L50 30 L30 50 L10 30 Z" fill="currentColor" opacity="0.1"/>
                      <circle cx="30" cy="30" r="3" fill="currentColor" opacity="0.3"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#statsPattern)"/>
                </svg>
              </div>
              
              <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-8 flex items-center relative z-10">
                <svg className="w-6 h-6 mr-3 text-cyan-500 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Statistics
              </h3>

              <div className="space-y-6">
                {/* Total Tasks */}
                <div className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 rounded-2xl p-6 text-white shadow-lg hover:shadow-cyan-500/25 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-cyan-100 text-sm font-medium uppercase tracking-wide">Total Tasks</p>
                      <p className="text-4xl font-bold mt-1">{tasks.length}</p>
                    </div>
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Pending Tasks */}
                <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-2xl p-6 text-white shadow-lg hover:shadow-amber-500/25 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-amber-100 text-sm font-medium uppercase tracking-wide">Pending</p>
                      <p className="text-4xl font-bold mt-1">{pendingCount}</p>
                    </div>
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Completed Tasks */}
                <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500 rounded-2xl p-6 text-white shadow-lg hover:shadow-emerald-500/25 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-emerald-100 text-sm font-medium uppercase tracking-wide">Completed</p>
                      <p className="text-4xl font-bold mt-1">{completedCount}</p>
                    </div>
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                {tasks.length > 0 && (
                  <div className="bg-white/80 dark:bg-slate-800/80 rounded-2xl p-6 border border-cyan-200 dark:border-cyan-700 shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-semibold text-slate-700 dark:text-slate-300">Progress</span>
                      <span className="text-lg font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                        {Math.round((completedCount / tasks.length) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4 shadow-inner">
                      <div
                        className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 h-4 rounded-full transition-all duration-700 ease-out shadow-sm"
                        style={{ width: `${(completedCount / tasks.length) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-3 text-center">
                      {completedCount} of {tasks.length} tasks completed
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="glass-card rounded-3xl p-8 bg-gradient-to-br from-white/90 via-purple-50/50 to-pink-50/50 dark:from-slate-800/90 dark:via-purple-900/30 dark:to-pink-900/30 border border-white/40 backdrop-blur-xl shadow-xl relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 opacity-5 dark:opacity-3 pointer-events-none">
                <svg width="150" height="150" viewBox="0 0 150 150" className="text-purple-400">
                  <path d="M75 0 L150 75 L75 150 L0 75 Z" fill="currentColor" opacity="0.1"/>
                  <path d="M75 20 L130 75 L75 130 L20 75 Z" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3"/>
                  <path d="M75 40 L110 75 L75 110 L40 75 Z" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
                  <circle cx="75" cy="75" r="5" fill="currentColor" opacity="0.7"/>
                </svg>
              </div>
              
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 flex items-center relative z-10">
                <svg className="w-6 h-6 mr-3 text-purple-500 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Quick Actions
              </h3>
              <div className="space-y-4">
                <button
                  onClick={() => setFilter('pending')}
                  className="w-full text-left px-6 py-4 bg-white/80 dark:bg-slate-800/80 rounded-2xl border border-amber-200 dark:border-amber-700 hover:border-amber-300 dark:hover:border-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/30 transition-all duration-300 shadow-lg hover:shadow-amber-200/50 transform hover:scale-105"
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                      <svg className="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="font-semibold text-slate-700 dark:text-slate-300 text-lg">View Pending Tasks</span>
                  </div>
                </button>
                <button
                  onClick={() => setFilter('completed')}
                  className="w-full text-left px-6 py-4 bg-white/80 dark:bg-slate-800/80 rounded-2xl border border-emerald-200 dark:border-emerald-700 hover:border-emerald-300 dark:hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-all duration-300 shadow-lg hover:shadow-emerald-200/50 transform hover:scale-105"
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                      <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="font-semibold text-slate-700 dark:text-slate-300 text-lg">View Completed</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default TodoList;
