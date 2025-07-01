import React, { createContext, useContext, useReducer, useEffect } from 'react';
import supabase from '../lib/supabase';

const JournalContext = createContext();

const initialState = {
  entries: [],
  filter: 'all',
  sortBy: 'recent',
  searchQuery: '',
  loading: false,
  error: null
};

const journalReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_ENTRIES':
      return { ...state, entries: action.payload, loading: false };
    case 'ADD_ENTRY':
      return { ...state, entries: [action.payload, ...state.entries] };
    case 'UPDATE_ENTRY':
      return {
        ...state,
        entries: state.entries.map(entry =>
          entry.id === action.payload.id ? action.payload : entry
        )
      };
    case 'DELETE_ENTRY':
      return {
        ...state,
        entries: state.entries.filter(entry => entry.id !== action.payload)
      };
    case 'SET_FILTER':
      return { ...state, filter: action.payload };
    case 'SET_SORT':
      return { ...state, sortBy: action.payload };
    case 'SET_SEARCH':
      return { ...state, searchQuery: action.payload };
    default:
      return state;
  }
};

export const JournalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(journalReducer, initialState);

  // Load entries on mount
  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('journal_entries_j9k2m3n7p1')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        const formattedEntries = (data || []).map(entry => ({
          ...entry,
          isFavorite: entry.is_favorite || false,
          createdAt: entry.created_at,
          updatedAt: entry.updated_at
        }));

        dispatch({ type: 'SET_ENTRIES', payload: formattedEntries });
      } catch (error) {
        console.warn('Supabase load failed, using localStorage:', error);
        loadFromLocalStorage();
      }
    } else {
      loadFromLocalStorage();
    }
  };

  const loadFromLocalStorage = () => {
    try {
      const savedEntries = localStorage.getItem('journalEntries');
      if (savedEntries) {
        const entries = JSON.parse(savedEntries);
        dispatch({ type: 'SET_ENTRIES', payload: entries });
      } else {
        dispatch({ type: 'SET_ENTRIES', payload: [] });
      }
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load entries' });
    }
  };

  const saveToLocalStorage = (entries) => {
    try {
      localStorage.setItem('journalEntries', JSON.stringify(entries));
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  };

  const addEntry = async (entry) => {
    const newEntry = {
      ...entry,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      isFavorite: entry.isFavorite || false
    };

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('journal_entries_j9k2m3n7p1')
          .insert([{
            id: newEntry.id,
            title: newEntry.title || null,
            content: newEntry.content,
            mood: newEntry.mood || null,
            tags: newEntry.tags || [],
            is_favorite: newEntry.isFavorite,
            created_at: newEntry.createdAt,
            updated_at: newEntry.updatedAt
          }])
          .select()
          .single();

        if (error) throw error;

        const formattedEntry = {
          ...data,
          isFavorite: data.is_favorite,
          createdAt: data.created_at,
          updatedAt: data.updated_at
        };

        dispatch({ type: 'ADD_ENTRY', payload: formattedEntry });
        return;
      } catch (error) {
        console.warn('Supabase add failed, using localStorage:', error);
      }
    }

    // Fallback to localStorage
    dispatch({ type: 'ADD_ENTRY', payload: newEntry });
    const updatedEntries = [newEntry, ...state.entries];
    saveToLocalStorage(updatedEntries);
  };

  const updateEntry = async (entry) => {
    const updatedEntry = {
      ...entry,
      updatedAt: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('journal_entries_j9k2m3n7p1')
          .update({
            title: updatedEntry.title || null,
            content: updatedEntry.content,
            mood: updatedEntry.mood || null,
            tags: updatedEntry.tags || [],
            is_favorite: updatedEntry.isFavorite,
            updated_at: updatedEntry.updatedAt
          })
          .eq('id', entry.id)
          .select()
          .single();

        if (error) throw error;

        const formattedEntry = {
          ...data,
          isFavorite: data.is_favorite,
          createdAt: data.created_at,
          updatedAt: data.updated_at
        };

        dispatch({ type: 'UPDATE_ENTRY', payload: formattedEntry });
        return;
      } catch (error) {
        console.warn('Supabase update failed, using localStorage:', error);
      }
    }

    // Fallback to localStorage
    dispatch({ type: 'UPDATE_ENTRY', payload: updatedEntry });
    const updatedEntries = state.entries.map(e => 
      e.id === entry.id ? updatedEntry : e
    );
    saveToLocalStorage(updatedEntries);
  };

  const deleteEntry = async (entryId) => {
    if (supabase) {
      try {
        const { error } = await supabase
          .from('journal_entries_j9k2m3n7p1')
          .delete()
          .eq('id', entryId);

        if (error) throw error;

        dispatch({ type: 'DELETE_ENTRY', payload: entryId });
        return;
      } catch (error) {
        console.warn('Supabase delete failed, using localStorage:', error);
      }
    }

    // Fallback to localStorage
    dispatch({ type: 'DELETE_ENTRY', payload: entryId });
    const updatedEntries = state.entries.filter(entry => entry.id !== entryId);
    saveToLocalStorage(updatedEntries);
  };

  const toggleFavorite = async (entryId) => {
    const entry = state.entries.find(e => e.id === entryId);
    if (entry) {
      await updateEntry({ ...entry, isFavorite: !entry.isFavorite });
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

  const getFilteredEntries = () => {
    let filtered = [...state.entries];

    // Apply search filter
    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase();
      filtered = filtered.filter(entry =>
        (entry.title && entry.title.toLowerCase().includes(query)) ||
        (entry.content && entry.content.toLowerCase().includes(query)) ||
        (entry.tags && entry.tags.some(tag => 
          tag.toLowerCase().includes(query)
        ))
      );
    }

    // Apply status filter
    switch (state.filter) {
      case 'favorites':
        filtered = filtered.filter(entry => entry.isFavorite);
        break;
      case 'mood':
        filtered = filtered.filter(entry => entry.mood);
        break;
      case 'tagged':
        filtered = filtered.filter(entry => entry.tags && entry.tags.length > 0);
        break;
      default:
        break;
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (state.sortBy) {
        case 'recent':
          return new Date(b.createdAt || b.created_at) - new Date(a.createdAt || a.created_at);
        case 'oldest':
          return new Date(a.createdAt || a.created_at) - new Date(b.createdAt || b.created_at);
        case 'updated':
          return new Date(b.updatedAt || b.updated_at) - new Date(a.updatedAt || a.updated_at);
        case 'title':
          const aTitle = a.title || a.content.substring(0, 50);
          const bTitle = b.title || b.content.substring(0, 50);
          return aTitle.localeCompare(bTitle);
        default:
          return 0;
      }
    });

    return filtered;
  };

  const getEntryStats = () => {
    const totalEntries = state.entries.length;
    const favoriteEntries = state.entries.filter(entry => entry.isFavorite).length;
    const taggedEntries = state.entries.filter(entry => entry.tags && entry.tags.length > 0).length;
    const moodEntries = state.entries.filter(entry => entry.mood).length;

    // Get all unique tags
    const allTags = state.entries
      .filter(entry => entry.tags)
      .flatMap(entry => entry.tags);
    const uniqueTags = [...new Set(allTags)];

    // Get mood distribution
    const moodDistribution = state.entries.reduce((acc, entry) => {
      if (entry.mood) {
        acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      }
      return acc;
    }, {});

    return {
      totalEntries,
      favoriteEntries,
      taggedEntries,
      moodEntries,
      uniqueTags,
      moodDistribution
    };
  };

  const value = {
    ...state,
    addEntry,
    updateEntry,
    deleteEntry,
    toggleFavorite,
    setFilter,
    setSort,
    setSearch,
    getFilteredEntries,
    getEntryStats,
    loadEntries
  };

  return (
    <JournalContext.Provider value={value}>
      {children}
    </JournalContext.Provider>
  );
};

export const useJournal = () => {
  const context = useContext(JournalContext);
  if (!context) {
    throw new Error('useJournal must be used within a JournalProvider');
  }
  return context;
};