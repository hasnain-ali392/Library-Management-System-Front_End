'use client';

import React, { useState } from 'react';
import { X, Star, BookOpen, Calendar, Hash, CheckCircle2, Loader2 } from 'lucide-react';

export default function BookDetailModal({ book, isOpen, onClose }) {
  const [isBorrowing, setIsBorrowing] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen || !book) return null;

  const isAvailable = book.available > 0;

  const handleBorrow = () => {
    setIsBorrowing(true);
    // Simulate API Borrow Request
    setTimeout(() => {
      setIsBorrowing(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose(); // Auto-close after success
      }, 2000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-md transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col md:flex-row">
          {/* Left Column: Image */}
          <div className="md:w-2/5 h-64 md:h-auto relative bg-slate-100 dark:bg-slate-800">
            <img
              src={book.image}
              alt={book.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right Column: Details */}
          <div className="md:w-3/5 p-6 sm:p-8 flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 rounded">
                {book.category}
              </span>
              <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded ${isAvailable ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300' : 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300'}`}>
                {isAvailable ? 'In Stock' : 'Unavailable'}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50 mb-1">{book.title}</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 mb-4">{book.author}</p>

            <div className="flex items-center gap-4 mb-6 text-sm text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-1.5"><Star className="w-4 h-4 text-amber-500 fill-amber-500" /> {book.rating} Rating</div>
              <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
              <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-slate-400" /> {book.year}</div>
              <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
              <div className="flex items-center gap-1.5"><Hash className="w-4 h-4 text-slate-400" /> {book.isbn}</div>
            </div>

            <div className="prose prose-sm dark:prose-invert text-slate-600 dark:text-slate-300 mb-8">
              <p>{book.description}</p>
              <p className="mt-2 text-xs text-slate-400">Published by: <strong className="text-slate-600 dark:text-slate-300">{book.publisher}</strong></p>
            </div>

            {/* Action Area */}
            <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800">
              {success ? (
                <div className="w-full h-12 flex items-center justify-center gap-2 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400 font-bold rounded-xl border border-emerald-200 dark:border-emerald-800/50">
                  <CheckCircle2 className="w-5 h-5" /> Book Issued Successfully!
                </div>
              ) : (
                <button
                  onClick={handleBorrow}
                  disabled={!isAvailable || isBorrowing}
                  className={`w-full h-12 flex items-center justify-center gap-2 font-bold rounded-xl transition-all shadow-sm ${
                    isAvailable 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-md' 
                      : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {isBorrowing ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                  ) : (
                    <><BookOpen className="w-5 h-5" /> {isAvailable ? 'Borrow This Book' : 'Currently Unavailable'}</>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}