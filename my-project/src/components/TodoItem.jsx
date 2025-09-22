import React, { useState, useRef, useEffect } from 'react';

const TodoItem = ({ task, onUpdateTask, onDeleteTask, onToggleTask }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const editInputRef = useRef(null);

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [isEditing]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditTitle(task.title);
  };

  const handleSave = async () => {
    if (!editTitle.trim()) {
      return;
    }

    setIsLoading(true);
    try {
      await onUpdateTask(task._id, { title: editTitle.trim(), status: task.status });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditTitle(task.title);
  };

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      await onToggleTask(task._id);
    } catch (error) {
      console.error('Error toggling task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await onDeleteTask(task._id);
    } catch (error) {
      console.error('Error deleting task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  // Format date with modern options
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } else if (diffInHours < 168) { // Less than a week
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = (now - date) / (1000 * 60);
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${Math.floor(diffInMinutes)}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`;
    return formatDate(dateString);
  };

  const getPriorityConfig = (priority = 'medium') => {
    const configs = {
      low: { 
        color: 'from-blue-400 to-blue-500', 
        icon: '⬇️', 
        borderColor: 'border-blue-200 dark:border-blue-700', 
        bgColor: 'bg-blue-50 dark:bg-blue-900/20',
        textColor: 'text-blue-700 dark:text-blue-300'
      },
      medium: { 
        color: 'from-yellow-400 to-yellow-500', 
        icon: '➡️', 
        borderColor: 'border-yellow-200 dark:border-yellow-700', 
        bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
        textColor: 'text-yellow-700 dark:text-yellow-300'
      },
      high: { 
        color: 'from-red-400 to-red-500', 
        icon: '⬆️', 
        borderColor: 'border-red-200 dark:border-red-700', 
        bgColor: 'bg-red-50 dark:bg-red-900/20',
        textColor: 'text-red-700 dark:text-red-300'
      },
      urgent: { 
        color: 'from-purple-400 to-purple-500', 
        icon: '🔥', 
        borderColor: 'border-purple-200 dark:border-purple-700', 
        bgColor: 'bg-purple-50 dark:bg-purple-900/20',
        textColor: 'text-purple-700 dark:text-purple-300'
      }
    };
    return configs[priority] || configs.medium;
  };

  const { title, status, createdAt, updatedAt, priority, category } = task;
  const priorityConfig = getPriorityConfig(priority);

  return (
    <>
      <div
        className={`relative glass-card rounded-3xl p-6 transition-all duration-300 transform hover:shadow-2xl border-l-8 ${
          status
            ? 'border-l-emerald-400 bg-gradient-to-r from-emerald-50/80 via-green-50/60 to-teal-50/40 dark:from-emerald-900/20 dark:via-green-900/15 dark:to-teal-900/10'
            : `border-l-${priorityConfig.borderColor.split('-')[1]}-400 bg-gradient-to-r from-white via-slate-50/50 to-gray-50/30 dark:from-slate-800 dark:via-slate-800/50 dark:to-slate-700/30`
        } ${isHovered ? 'shadow-2xl shadow-slate-200/50 dark:shadow-slate-900/50' : 'shadow-lg'}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-blue-50/80 to-indigo-50/70 dark:from-slate-800/90 dark:via-blue-900/60 dark:to-indigo-900/50 backdrop-blur-md flex items-center justify-center rounded-3xl z-10 border border-white/30">
          <div className="flex items-center space-x-3 bg-white/80 dark:bg-slate-700/80 px-4 py-2 rounded-2xl shadow-lg">
            <div className="animate-spin rounded-full h-6 w-6 border-3 border-indigo-400 border-t-indigo-600 dark:border-indigo-300 dark:border-t-indigo-500"></div>
            <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">Processing...</span>
          </div>
        </div>
      )}

      <div className="flex items-start space-x-4">
        {/* Enhanced Checkbox */}
        <div className="flex-shrink-0 mt-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggle();
            }}
            disabled={isLoading}
            className={`w-8 h-8 rounded-2xl border-3 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-300 shadow-lg hover:shadow-xl transform hover:scale-110 ${
              status
                ? 'bg-gradient-to-br from-emerald-400 via-green-500 to-teal-500 border-emerald-400 text-white shadow-emerald-200 dark:shadow-emerald-900/50'
                : 'border-slate-300 dark:border-slate-600 hover:border-indigo-400 bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 hover:shadow-indigo-100 dark:hover:shadow-indigo-900/30'
            }`}
          >
            {status && (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            /* Edit Mode */
            <div className="space-y-4">
              <textarea
                ref={editInputRef}
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full px-4 py-3 border-2 border-indigo-200 dark:border-indigo-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:border-indigo-400 dark:focus:border-indigo-500 resize-none shadow-lg transition-all duration-300 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                disabled={isLoading}
                maxLength={200}
                rows={3}
                placeholder="Enter your beautiful task title..."
              />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-full">
                  {editTitle.length}/200 characters
                </span>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleSave}
                    disabled={isLoading || !editTitle.trim()}
                    className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white rounded-2xl text-sm font-semibold hover:from-emerald-600 hover:via-green-600 hover:to-teal-600 disabled:opacity-50 transition-all duration-300 shadow-lg hover:shadow-emerald-200 dark:hover:shadow-emerald-900/50"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={isLoading}
                    className="px-6 py-2.5 bg-gradient-to-r from-slate-100 to-gray-100 dark:from-slate-700 dark:to-slate-600 text-slate-600 dark:text-slate-300 rounded-2xl text-sm font-semibold hover:from-slate-200 hover:to-gray-200 dark:hover:from-slate-600 dark:hover:to-slate-500 disabled:opacity-50 transition-all duration-300 shadow-lg hover:shadow-slate-200 dark:hover:shadow-slate-900/50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Display Mode */
            <div className="space-y-2">
              {/* Task Title */}
              <div className="flex items-start justify-between">
                <h3 
                  className={`text-lg font-medium leading-relaxed transition-all duration-300 ${
                    status 
                      ? 'line-through text-muted' 
                      : 'text-hero'
                  }`}
                >
                  {title}
                </h3>
                
                {/* Action buttons - only show on hover or mobile */}
                <div className={`flex items-center space-x-2 transition-all duration-300 opacity-100 translate-x-0 md:opacity-0 md:translate-x-2 ${
                  isHovered ? 'md:opacity-100 md:translate-x-0' : ''
                }`}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit();
                    }}
                    disabled={isLoading}
                    className="p-2.5 text-indigo-600 dark:text-indigo-400 hover:bg-gradient-to-br hover:from-indigo-100 hover:to-blue-100 dark:hover:from-indigo-900/30 dark:hover:to-blue-900/30 rounded-2xl disabled:opacity-50 transition-all duration-300 shadow-lg hover:shadow-indigo-200 dark:hover:shadow-indigo-900/50"
                    title="Edit task"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete();
                    }}
                    disabled={isLoading}
                    className="p-2.5 text-red-500 dark:text-red-400 hover:bg-gradient-to-br hover:from-red-100 hover:to-pink-100 dark:hover:from-red-900/30 dark:hover:to-pink-900/30 rounded-2xl disabled:opacity-50 transition-all duration-300 shadow-lg hover:shadow-red-200 dark:hover:shadow-red-900/50"
                    title="Delete task"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Task metadata */}
              <div className="flex flex-wrap items-center gap-3 text-sm">
                {/* Priority badge */}
                {priority && priority !== 'medium' && (
                  <div className={`flex items-center px-3 py-1.5 rounded-2xl ${priorityConfig.bgColor} ${priorityConfig.textColor} border-2 ${priorityConfig.borderColor} shadow-lg hover:shadow-xl transition-all duration-300`}>
                    <span className="mr-2 text-sm">{priorityConfig.icon}</span>
                    <span className="font-bold text-sm">{priority.charAt(0).toUpperCase() + priority.slice(1)}</span>
                  </div>
                )}

                {/* Category badge */}
                {category && (
                  <div className="flex items-center px-3 py-1.5 rounded-2xl bg-gradient-to-r from-purple-100 via-pink-100 to-violet-100 dark:from-purple-900/30 dark:via-pink-900/30 dark:to-violet-900/30 text-purple-700 dark:text-purple-300 border-2 border-purple-200 dark:border-purple-700 shadow-lg hover:shadow-purple-200 dark:hover:shadow-purple-900/50 transition-all duration-300">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <span className="font-bold text-sm">{category}</span>
                  </div>
                )}

                {/* Status badge */}
                <div className={`flex items-center px-3 py-1.5 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ${
                  status
                    ? 'bg-gradient-to-r from-emerald-100 via-green-100 to-teal-100 dark:from-emerald-900/30 dark:via-green-900/30 dark:to-teal-900/30 text-emerald-700 dark:text-emerald-300 border-2 border-emerald-200 dark:border-emerald-700'
                    : 'bg-gradient-to-r from-amber-100 via-orange-100 to-yellow-100 dark:from-amber-900/30 dark:via-orange-900/30 dark:to-yellow-900/30 text-amber-700 dark:text-amber-300 border-2 border-amber-200 dark:border-amber-700'
                }`}>
                  <div className={`w-3 h-3 rounded-full mr-2 shadow-sm ${
                    status ? 'bg-gradient-to-r from-emerald-400 to-teal-400' : 'bg-gradient-to-r from-amber-400 to-orange-400'
                  }`}></div>
                  <span className="font-bold text-sm">
                    {status ? '✓ Completed' : '○ Pending'}
                  </span>
                </div>
              </div>

              {/* Timestamps */}
              <div className="flex items-center justify-between text-xs text-muted pt-2 border-t border-gray-100 dark:border-slate-700">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Created {getTimeAgo(createdAt)}
                  </span>
                  {updatedAt !== createdAt && (
                    <span className="flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Updated {getTimeAgo(updatedAt)}
                    </span>
                  )}
                </div>
                
                {/* Quick toggle on mobile */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggle();
                  }}
                  disabled={isLoading}
                  className="sm:hidden text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
                >
                  {status ? 'Mark Pending' : 'Mark Complete'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    
    </>
  );
};

export default TodoItem;
