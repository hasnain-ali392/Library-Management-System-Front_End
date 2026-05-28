'use client';

import { useState, useEffect } from 'react';

// Simulated API Call / Mock Data Database
const mockDatabase = [
  { id: '1', title: 'Clean Code', author: 'Robert C. Martin', category: 'Engineering', rating: 4.8, available: 5, total: 5, image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=400', isbn: '978-0132350884', publisher: 'Prentice Hall', year: 2008, description: 'Even bad code can function. But if code isn’t clean, it can bring a development organization to its knees.' },
  { id: '2', title: 'The Pragmatic Programmer', author: 'Andrew Hunt', category: 'Software', rating: 4.9, available: 0, total: 3, image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&q=80&w=400', isbn: '978-0135957059', publisher: 'Addison-Wesley', year: 1999, description: 'The Pragmatic Programmer cuts through the increasing specialization and technicalities of modern software development.' },
  { id: '3', title: 'Design Patterns', author: 'Erich Gamma', category: 'Architecture', rating: 4.7, available: 2, total: 4, image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400', isbn: '978-0201633610', publisher: 'Addison-Wesley', year: 1994, description: 'Capturing a wealth of experience about the design of object-oriented software.' },
  { id: '4', title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', category: 'Mathematics', rating: 4.6, available: 1, total: 6, image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=400', isbn: '978-0262033848', publisher: 'MIT Press', year: 2009, description: 'A comprehensive update of the leading algorithms text, with new material on matchings in bipartite graphs, online algorithms, and machine learning.' },
  { id: '5', title: 'You Don\'t Know JS', author: 'Kyle Simpson', category: 'Web Dev', rating: 4.8, available: 8, total: 8, image: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&q=80&w=400', isbn: '978-1491904244', publisher: 'O\'Reilly', year: 2015, description: 'Learn the inner workings of JavaScript\'s core mechanisms.' },
];

export const useSearch = (delay = 500) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ category: 'All', status: 'All' });
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(true);

  useEffect(() => {
    setIsSearching(true);
    
    // Debounce timer
    const handler = setTimeout(() => {
      // Simulate Backend Filtering Logic
      const filtered = mockDatabase.filter((book) => {
        const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              book.author.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filters.category === 'All' || book.category === filters.category;
        const matchesStatus = filters.status === 'All' || 
                              (filters.status === 'Available' && book.available > 0) ||
                              (filters.status === 'Borrowed' && book.available === 0);
        
        return matchesSearch && matchesCategory && matchesStatus;
      });

      setResults(filtered);
      setIsSearching(false);
    }, delay);

    return () => clearTimeout(handler);
  }, [searchTerm, filters, delay]);

  return {
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    results,
    isSearching,
  };
};