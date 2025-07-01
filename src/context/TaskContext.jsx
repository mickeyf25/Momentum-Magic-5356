import React, { createContext, useContext, useReducer, useEffect } from 'react';

const TaskContext = createContext();

const initialState = {
  tasks: [],
  filter: 'all',
  sortBy: 'dueDate',
  searchQuery: '',
  categories: ['Work', 'Personal', 'Health', 'Education', 'Shopping']
};

const taskReducer = (state, action) => {
  switch (action.type) {
    case 'SET_TASKS':
      return { ...state, tasks: action.payload };
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? action.payload : task
        )
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload)
      };
    case 'SET_FILTER':
      return { ...state, filter: action.payload };
    case 'SET_SORT':
      return { ...state, sortBy: action.payload };
    case 'SET_SEARCH':
      return { ...state, searchQuery: action.payload };
    case 'ADD_CATEGORY':
      return {
        ...state,
        categories: [...new Set([...state.categories, action.payload])]
      };
    default:
      return state;
  }
};

export const TaskProvider = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    const savedCategories = localStorage.getItem('categories');

    if (savedTasks) {
      dispatch({ type: 'SET_TASKS', payload: JSON.parse(savedTasks) });
    }

    if (savedCategories) {
      dispatch({ type: 'SET_CATEGORIES', payload: JSON.parse(savedCategories) });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(state.tasks));
  }, [state.tasks]);

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(state.categories));
  }, [state.categories]);

  const addTask = (task) => {
    const newTask = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      completed: false,
      category: task.category || 'Personal'
    };

    // Add new category if it doesn't exist
    if (task.category && !state.categories.includes(task.category)) {
      dispatch({ type: 'ADD_CATEGORY', payload: task.category });
    }

    dispatch({ type: 'ADD_TASK', payload: newTask });
  };

  const updateTask = (task) => {
    // Add new category if it doesn't exist
    if (task.category && !state.categories.includes(task.category)) {
      dispatch({ type: 'ADD_CATEGORY', payload: task.category });
    }

    dispatch({ type: 'UPDATE_TASK', payload: task });
  };

  const deleteTask = (taskId) => {
    dispatch({ type: 'DELETE_TASK', payload: taskId });
  };

  const toggleTask = (taskId) => {
    const task = state.tasks.find(t => t.id === taskId);
    if (task) {
      updateTask({ ...task, completed: !task.completed });
    }
  };

  const setFilter = (filter) => {
    dispatch({ type: 'SET_FILTER', payload: filter });
  };

  const setSort = (sortBy) => {
    dispatch({ type: 'SET_SORT', payload: sortBy });
  };

  const setSearch = (query) => {
    dispatch({ type: 'SET_SEARCH', payload: query });
  };

  const getFilteredTasks = () => {
    let filtered = [...state.tasks];

    // Apply search filter
    if (state.searchQuery) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        task.category.toLowerCase().includes(state.searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    switch (state.filter) {
      case 'completed':
        filtered = filtered.filter(task => task.completed);
        break;
      case 'pending':
        filtered = filtered.filter(task => !task.completed);
        break;
      case 'overdue':
        filtered = filtered.filter(task =>
          !task.completed && task.dueDate && new Date(task.dueDate) < new Date()
        );
        break;
      default:
        break;
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (state.sortBy) {
        case 'category':
          // First sort by category, then by due date within category
          if (a.category !== b.category) {
            return a.category.localeCompare(b.category);
          }
          // Within same category, sort by due date
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        case 'dueDate':
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'title':
          return a.title.localeCompare(b.title);
        case 'created':
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });

    return filtered;
  };

  const getTasksByCategory = () => {
    const tasksByCategory = {};

    // Initialize with all categories
    state.categories.forEach(category => {
      tasksByCategory[category] = [];
    });

    // Group tasks by category
    state.tasks.forEach(task => {
      const category = task.category || 'Uncategorized';
      if (!tasksByCategory[category]) {
        tasksByCategory[category] = [];
      }
      tasksByCategory[category].push(task);
    });

    // Sort tasks within each category by due date
    Object.keys(tasksByCategory).forEach(category => {
      tasksByCategory[category].sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      });
    });

    return tasksByCategory;
  };

  const value = {
    ...state,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    setFilter,
    setSort,
    setSearch,
    getFilteredTasks,
    getTasksByCategory
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};