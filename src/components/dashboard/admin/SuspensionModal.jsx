'use client';

import React from 'react';
import { X, ShieldAlert, AlertCircle, Loader2 } from 'lucide-react';

export default function SuspensionModal({ isOpen, onClose, user, onConfirm, isProcessing }) {
  if (!isOpen || !user) return null;

  const willSuspend = !user.isSuspended;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-6 text-center animate-in fade-in zoom-in-95 duration-150">
        
        <div className="flex justify-end absolute top-4 right-4">
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
            willSuspend ? 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400' : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'
          }`}>
            {willSuspend ? <ShieldAlert className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">
            {willSuspend ? 'Suspend User Access' : 'Restore User Access'}
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Target Profile: <strong className="text-slate-800 dark:text-slate-200">{user.name}</strong> ({user.email})
          </p>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-left text-slate-600 dark:text-slate-400 mb-6 space-y-1.5">
          {willSuspend ? (
            <>
              <p className="font-bold text-slate-700 dark:text-slate-300">Systemic Violations Imposed:</p>
              <p>• Revokes immediate book catalog reservation/borrow token issuance privileges.</p>
              <p>• Blocks active login handshakes across public cluster terminals.</p>
            </>
          ) : (
            <>
              <p className="font-bold text-slate-700 dark:text-slate-300">Systemic Restorations Imposed:</p>
              <p>• Restores structural dashboard access pathways immediately.</p>
              <p>• Enables normal circulation clearing workflows if liabilities match zero benchmarks.</p>
            </>
          )}
        </div>

        <div className="flex gap-3">
          <button 
            type="button" 
            onClick={onClose} 
            className="flex-1 h-10 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            Cancel Actions
          </button>
          <button 
            type="button" 
            onClick={onConfirm}
            disabled={isProcessing}
            className={`flex-1 h-10 text-sm font-semibold text-white rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              willSuspend ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {willSuspend ? 'Confirm Suspension' : 'Confirm Restoration'}
          </button>
        </div>

      </div>
    </div>
  );
}