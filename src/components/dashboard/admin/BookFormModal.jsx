'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { addBook, updateBook } from '@/redux/slices/booksSlice';
import { X, Save, Loader2 } from 'lucide-react';

const bookSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  category: z.string().min(1, 'Category is required'),
  isbn: z.string().optional(),
  publisher: z.string().min(1, 'Publisher is required'),
  publishYear: z.number().min(1000).max(new Date().getFullYear()),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  description: z.string().optional(),
});

export default function BookFormModal({ isOpen, onClose, book = null }) {
  const dispatch = useDispatch();
  const { actionLoading, error } = useSelector((state) => state.books);
  const isEditing = !!book;

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(bookSchema),
    defaultValues: { quantity: 1, publishYear: new Date().getFullYear() }
  });

  // Populate form if editing
  useEffect(() => {
    if (book && isOpen) {
      reset({ ...book });
    } else if (!book && isOpen) {
      reset({ title: '', author: '', category: '', isbn: '', publisher: '', publishYear: new Date().getFullYear(), quantity: 1, description: '' });
    }
  }, [book, isOpen, reset]);

  const onSubmit = async (data) => {
    try {
      if (isEditing) {
        await dispatch(updateBook({ id: book._id, data })).unwrap();
      } else {
        await dispatch(addBook(data)).unwrap();
      }
      onClose();
    } catch (err) {
      // Error is handled in Redux state
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">
            {isEditing ? 'Edit Book Details' : 'Add New Book'}
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && <div className="m-6 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Title *</label>
              <input {...register('title')} className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-sm focus:outline-none focus:border-blue-500" />
              {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Author *</label>
              <input {...register('author')} className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-sm focus:outline-none focus:border-blue-500" />
              {errors.author && <p className="text-xs text-red-500 mt-1">{errors.author.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Category *</label>
              <input {...register('category')} className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-sm focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">ISBN</label>
              <input {...register('isbn')} className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-sm focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Publisher *</label>
              <input {...register('publisher')} className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-sm focus:outline-none focus:border-blue-500" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Year</label>
                <input type="number" {...register('publishYear', { valueAsNumber: true })} className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-sm focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Total Copies *</label>
                <input type="number" {...register('quantity', { valueAsNumber: true })} className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-sm focus:outline-none focus:border-blue-500" />
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Description</label>
            <textarea {...register('description')} rows={3} className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-sm focus:outline-none focus:border-blue-500 resize-none" />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={actionLoading} className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50">
              {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isEditing ? 'Save Changes' : 'Add Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}