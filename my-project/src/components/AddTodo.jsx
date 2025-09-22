import React, { useState, useRef, useEffect } from 'react';

const AddTodo = ({ onAddTask, loading }) => {
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [title]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      // Show better error indication
      textareaRef.current?.focus();
      return;
    }

    setIsSubmitting(true);
    try {
      // Enhanced task data with new fields
      const taskData = {
        title: title.trim(),
        priority,
        category: category.trim(),
        dueDate: dueDate || null,
      };
      
      await onAddTask(taskData);
      
      // Reset form
      setTitle('');
      setPriority('medium');
      setCategory('');
      setDueDate('');
      setShowAdvanced(false);
    } catch (error) {
      console.error('Error adding task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const priorityOptions = [
    { value: 'low', label: 'Low', color: 'from-blue-400 to-blue-500', icon: '⬇️' },
    { value: 'medium', label: 'Medium', color: 'from-yellow-400 to-yellow-500', icon: '➡️' },
    { value: 'high', label: 'High', color: 'from-red-400 to-red-500', icon: '⬆️' },
    { value: 'urgent', label: 'Urgent', color: 'from-purple-400 to-purple-500', icon: '🔥' }
  ];

  return (
    <div className="glass-card rounded-3xl p-8 transition-all duration-500 hover:shadow-2xl bg-gradient-to-br from-white/90 via-indigo-50/50 to-purple-50/50 dark:from-slate-800/90 dark:via-indigo-900/30 dark:to-purple-900/30 border border-white/40 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg hover:shadow-indigo-200 dark:hover:shadow-indigo-900/50 transition-all duration-300 transform hover:scale-110">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          Add New Task
        </h2>
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors duration-200 flex items-center"
        >
          <svg className={`w-4 h-4 mr-1 transition-transform duration-200 ${showAdvanced ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          {showAdvanced ? 'Simple' : 'Advanced'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Main input area */}
        <div className={`relative transition-all duration-500 ${isFocused ? 'transform scale-[1.02]' : ''}`}>
          <textarea
            ref={textareaRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder="What needs to be done? (Ctrl+Enter to submit)"
            className={`w-full px-6 py-4 border-3 rounded-2xl resize-none transition-all duration-500 bg-gradient-to-br from-white/90 via-indigo-50/80 to-purple-50/70 dark:from-slate-800/90 dark:via-indigo-900/60 dark:to-purple-900/50 backdrop-blur-sm focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-lg hover:shadow-xl ${
              isFocused
                ? 'border-indigo-400 ring-4 ring-indigo-100 dark:ring-indigo-900/50 shadow-indigo-200 dark:shadow-indigo-900/30'
                : 'border-indigo-200 dark:border-indigo-700 hover:border-indigo-300 dark:hover:border-indigo-600'
            } ${title.length > 180 ? 'border-amber-400 ring-amber-100 dark:ring-amber-900/50' : ''}`}
            disabled={loading || isSubmitting}
            maxLength={200}
            rows={1}
            style={{ minHeight: '56px' }}
          />
          <div className="absolute bottom-3 right-4 flex items-center space-x-3">
            {title.length > 0 && (
              <span className={`text-sm font-bold px-2 py-1 rounded-full transition-all duration-300 ${
                title.length > 180
                  ? 'text-amber-700 bg-amber-100 dark:text-amber-300 dark:bg-amber-900/50'
                  : 'text-indigo-600 bg-indigo-100 dark:text-indigo-400 dark:bg-indigo-900/50'
              }`}>
                {title.length}/200
              </span>
            )}
            <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 bg-white/60 dark:bg-slate-700/60 px-2 py-1 rounded-lg">
              <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-600 text-slate-700 dark:text-slate-300 rounded font-bold">Ctrl</kbd>
              <span className="mx-2">+</span>
              <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-600 text-slate-700 dark:text-slate-300 rounded font-bold">Enter</kbd>
            </div>
          </div>
        </div>

        {/* Advanced options */}
        <div className={`transition-all duration-300 overflow-hidden ${
          showAdvanced ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-slate-700">
            {/* Priority and Category row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Priority Selection */}
              <div>
                <label className="block text-sm font-bold text-indigo-700 dark:text-indigo-300 mb-3">Priority</label>
                <div className="grid grid-cols-2 gap-3">
                  {priorityOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setPriority(option.value)}
                      className={`p-3 rounded-2xl border-3 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${
                        priority === option.value
                          ? `bg-gradient-to-r ${option.color} text-white border-transparent shadow-lg`
                          : 'bg-white/80 dark:bg-slate-800/80 border-indigo-200 dark:border-indigo-700 hover:border-indigo-300 dark:hover:border-indigo-600 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30'
                      }`}
                    >
                      <span className="text-sm font-bold flex items-center justify-center">
                        <span className="mr-2 text-lg">{option.icon}</span>
                        {option.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Input */}
              <div>
                <label className="block text-sm font-bold text-purple-700 dark:text-purple-300 mb-3">Category</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g., Work, Personal, Shopping"
                  className="w-full px-4 py-3 border-2 border-purple-200 dark:border-purple-700 bg-white/80 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-300 focus:border-purple-400 dark:focus:border-purple-500 transition-all duration-300 shadow-lg hover:shadow-purple-200 dark:hover:shadow-purple-900/50"
                  maxLength={30}
                />
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-bold text-amber-700 dark:text-amber-300 mb-3">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full sm:w-auto px-4 py-3 border-2 border-amber-200 dark:border-amber-700 bg-white/80 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-amber-300 focus:border-amber-400 dark:focus:border-amber-500 transition-all duration-300 shadow-lg hover:shadow-amber-200 dark:hover:shadow-amber-900/50"
              />
            </div>
          </div>
        </div>

        {/* Submit button */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <button
            type="submit"
            disabled={loading || isSubmitting || !title.trim()}
            className="flex-1 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 hover:from-emerald-600 hover:via-green-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed py-4 px-8 text-lg font-bold text-white rounded-2xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-emerald-200 shadow-lg hover:shadow-emerald-200 dark:hover:shadow-emerald-900/50 transform"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-3 border-white border-t-transparent mr-3"></div>
                Creating Task...
              </div>
            ) : (
              <span className="flex items-center justify-center">
                <div className="w-6 h-6 mr-3 bg-white/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                Add Task
              </span>
            )}
          </button>

          {title.trim() && (
            <button
              type="button"
              onClick={() => {
                setTitle('');
                setPriority('medium');
                setCategory('');
                setDueDate('');
                textareaRef.current?.focus();
              }}
              className="px-6 py-4 bg-gradient-to-r from-slate-100 to-gray-100 dark:from-slate-700 dark:to-slate-600 text-slate-600 dark:text-slate-300 hover:from-slate-200 hover:to-gray-200 dark:hover:from-slate-600 dark:hover:to-slate-500 transition-all duration-300 font-bold border-2 border-slate-200 dark:border-slate-600 rounded-2xl shadow-lg hover:shadow-slate-200 dark:hover:shadow-slate-900/50 transform hover:scale-105"
            >
              Clear
            </button>
          )}
        </div>

        {/* Character count and validation */}
        {title.length > 0 && (
          <div className="flex items-center justify-between text-xs text-muted pt-2">
            <div className="flex items-center space-x-4">
              {priority !== 'medium' && (
                <span className="flex items-center">
                  <span className="w-2 h-2 rounded-full bg-gradient-to-r from-primary-400 to-success-400 mr-1"></span>
                  Priority: {priorityOptions.find(p => p.value === priority)?.label}
                </span>
              )}
              {category && (
                <span className="flex items-center">
                  <span className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 mr-1"></span>
                  Category: {category}
                </span>
              )}
              {dueDate && (
                <span className="flex items-center">
                  <span className="w-2 h-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 mr-1"></span>
                  Due: {new Date(dueDate).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default AddTodo;
