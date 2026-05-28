'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '@/utils/validation';
import api from '@/services/api';
import Link from 'next/link';
import { User, Mail, Phone, Lock, Eye, EyeOff, Check, X, Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
    mode: 'onChange'
  });

  const passwordValue = watch('password', '');

  // Live Metric Rules Arrays
  const [strengthScore, setStrengthScore] = useState(0);
  const requirements = [
    { label: 'At least 8 characters long', valid: passwordValue.length >= 8 },
    { label: 'Contains an uppercase letter', valid: /[A-Z]/.test(passwordValue) },
    { label: 'Contains at least one number', valid: /[0-9]/.test(passwordValue) },
    { label: 'Contains a special character (!@#$%^&*)', valid: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(passwordValue) },
  ];

  useEffect(() => {
    const metCount = requirements.filter(req => req.valid).length;
    setStrengthScore(metCount);
  }, [passwordValue]);

  const getStrengthLabel = () => {
    if (!passwordValue) return { label: 'None', color: 'bg-slate-200 dark:bg-slate-800 text-slate-400', width: 'w-0' };
    if (strengthScore <= 1) return { label: 'Weak', color: 'bg-red-500 text-red-500', width: 'w-1/4' };
    if (strengthScore <= 3) return { label: 'Medium', color: 'bg-amber-500 text-amber-500', width: 'w-3/4' };
    return { label: 'Strong Security Profile', color: 'bg-emerald-500 text-emerald-500', width: 'w-full' };
  };

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      setServerError('');

      await api.post('/auth/register', {
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone || undefined,
      });

      setSuccess(true);
    } catch (error) {
      setServerError(error.response?.data?.message || 'Account creation halted. User might already exist.');
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/40 rounded-2xl p-8 text-center shadow-lg">
          <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4">
            <Check className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">Registration Complete</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Your academic profile is active. You can now log into your catalog workstation dashboard.</p>
          <Link href="/login" className="mt-6 inline-block w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-all">
            Proceed to Login Page
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 py-12 px-4">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-xl">

        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">Create Library Account</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Register to start borrowing and browsing the catalog.</p>
        </div>

        {serverError && (
          <div className="mt-6 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-lg text-sm text-red-600 dark:text-red-400 text-center font-medium">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          {/* Full Name Input */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                {...register('name')}
                placeholder="John Doe"
                className={`w-full h-10 pl-10 pr-4 rounded-lg border bg-slate-50 dark:bg-slate-800/40 text-sm focus:outline-none transition-all ${errors.name ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-slate-200 dark:border-slate-700 focus:border-blue-500'}`}
              />
            </div>
            {errors.name && <p className="text-xs font-medium text-red-500 mt-1">{errors.name.message}</p>}
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Academic Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                {...register('email')}
                placeholder="student@university.edu"
                className={`w-full h-10 pl-10 pr-4 rounded-lg border bg-slate-50 dark:bg-slate-800/40 text-sm focus:outline-none transition-all ${errors.email ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-slate-200 dark:border-slate-700 focus:border-blue-500'}`}
              />
            </div>
            {errors.email && <p className="text-xs font-medium text-red-500 mt-1">{errors.email.message}</p>}
          </div>

          {/* Phone Input */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Contact Phone</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                {...register('phone')}
                placeholder="+923001234567"
                className={`w-full h-10 pl-10 pr-4 rounded-lg border bg-slate-50 dark:bg-slate-800/40 text-sm focus:outline-none transition-all ${errors.phone ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-slate-200 dark:border-slate-700 focus:border-blue-500'}`}
              />
            </div>
            {errors.phone && <p className="text-xs font-medium text-red-500 mt-1">{errors.phone.message}</p>}
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Security Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className={`w-full h-10 pl-10 pr-10 rounded-lg border bg-slate-50 dark:bg-slate-800/40 text-sm focus:outline-none transition-all ${errors.password ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-slate-200 dark:border-slate-700 focus:border-blue-500'}`}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Live Strength Track Slider */}
            {passwordValue && (
              <div className="mt-2.5 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-medium text-slate-500">Password Strength:</span>
                  <span className={`font-bold ${getStrengthLabel().color.split(' ')[1]}`}>{getStrengthLabel().label}</span>
                </div>
                <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-300 ${getStrengthLabel().color.split(' ')[0]} ${getStrengthLabel().width}`} />
                </div>

                {/* Visual Checklist */}
                <ul className="mt-3 space-y-1">
                  {requirements.map((req, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                      {req.valid ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      ) : (
                        <X className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 shrink-0" />
                      )}
                      <span className={req.valid ? 'text-slate-700 dark:text-slate-300 line-through opacity-60' : ''}>{req.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {errors.password && <p className="text-xs font-medium text-red-500 mt-1">{errors.password.message}</p>}
          </div>

          {/* Confirm Password Input */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                {...register('confirmPassword')}
                type="password"
                placeholder="••••••••"
                className={`w-full h-10 pl-10 pr-4 rounded-lg border bg-slate-50 dark:bg-slate-800/40 text-sm focus:outline-none transition-all ${errors.confirmPassword ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-slate-200 dark:border-slate-700 focus:border-blue-500'}`}
              />
            </div>
            {errors.confirmPassword && <p className="text-xs font-medium text-red-500 mt-1">{errors.confirmPassword.message}</p>}
          </div>

          {/* Terms & Conditions Checkbox */}
          <div>
            <div className="flex items-start">
              <input
                {...register('terms')}
                type="checkbox"
                id="terms"
                className="w-4 h-4 rounded border-slate-300 text-blue-600 mt-0.5 focus:ring-blue-500/20"
              />
              <label htmlFor="terms" className="ml-2 text-xs text-slate-600 dark:text-slate-400 select-none cursor-pointer leading-tight">
                I hereby declare that all profile metrics are valid and accept systemic liability for book return rules.
              </label>
            </div>
            {errors.terms && <p className="text-xs font-medium text-red-500 mt-1">{errors.terms.message}</p>}
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
            Login instead
          </Link>
        </div>

      </div>
    </div>
  );
}