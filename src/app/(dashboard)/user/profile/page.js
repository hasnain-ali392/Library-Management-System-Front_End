'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { updateSelfProfile } from '@/redux/slices/usersSlice';
import { authSuccess } from '@/redux/slices/authSlice'; // Updates identity state cookies
import { User, Mail, Phone, ShieldCheck, Save, Loader2, CheckCircle } from 'lucide-react';

const profileSchema = z.object({
  name: z.string().min(1, 'Name string field cannot read null value mappings'),
  phone: z.string().regex(/^\+?[0-9]{10,14}$/, 'Invalid phone number formatting constraint passed'),
});

export default function UserSelfProfileDashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [serverError, setServerError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
    }
  });

  const onSubmitProfile = async (data) => {
    try {
      setServerError('');
      setSaveSuccess(false);

      const updatedUser = await dispatch(updateSelfProfile(data)).unwrap();

      // Update local storage/cookie state in auth slice
      dispatch(authSuccess({ user: updatedUser, token: null }));
      setSaveSuccess(true);
    } catch (err) {
      setServerError(err || 'Failed to update user parameters.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Profile Preferences</h1>
        <p className="text-sm text-slate-500">Manage contact information, verify role privileges, and inspect subscription keys.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 sm:p-8">

        {saveSuccess && (
          <div className="mb-6 p-3 bg-emerald-50 text-emerald-600 rounded-xl text-sm font-semibold flex items-center gap-2 border border-emerald-200/50">
            <CheckCircle className="w-4 h-4" /> Account metadata changes written successfully.
          </div>
        )}
        {serverError && (
          <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-xl text-sm font-semibold">{serverError}</div>
        )}

        <form onSubmit={handleSubmit(onSubmitProfile)} className="space-y-5">

          {/* Static Immutable Node Row */}
          <div>
            <label className="block text-sm font-semibold text-slate-500 mb-1">System Account Type</label>
            <div className="h-10 px-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center gap-2 text-slate-500 text-sm select-none">
              <ShieldCheck className="w-4 h-4 text-blue-500" />
              <span className="capitalize font-bold">{user?.role || 'user'} Clearing Level</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-500 mb-1">Registered Academic Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full h-10 pl-10 pr-4 bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-400 cursor-not-allowed"
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Email mappings act as core database indexes and cannot be altered.</p>
          </div>

          {/* Mutable Fields */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Legal Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                {...register('name')}
                className="w-full h-10 pl-10 pr-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:border-blue-500 text-slate-900 dark:text-slate-100"
              />
            </div>
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Mobile Contact String</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                {...register('phone')}
                placeholder="+920000000000"
                className="w-full h-10 pl-10 pr-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:border-blue-500 text-slate-900 dark:text-slate-100"
              />
            </div>
            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 h-10 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-sm rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Changes
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}