import React from 'react';
import { AlertNotification } from '../types';
import { X, Bell, Trash2, CheckCircle, AlertTriangle, ShieldAlert } from 'lucide-react';

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AlertNotification[];
  onClearAll: () => void;
  onMarkAllAsRead: () => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onClearAll,
  onMarkAllAsRead,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#121824] border border-slate-800 text-white rounded-2xl w-full max-w-lg p-6 shadow-2xl relative my-8 animate-fadeIn max-h-[85vh] flex flex-col">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Alert Notifications History</h2>
              <p className="text-xs text-slate-400">
                Log of triggered range divergence and impermanent loss warnings
              </p>
            </div>
          </div>
        </div>

        {/* Action controls */}
        {notifications.length > 0 && (
          <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-800/80">
            <button
              onClick={onMarkAllAsRead}
              className="text-emerald-400 hover:underline font-medium"
            >
              Mark all as read
            </button>
            <button
              onClick={onClearAll}
              className="text-slate-400 hover:text-rose-400 transition flex items-center space-x-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All Logs</span>
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div className="overflow-y-auto flex-1 space-y-3 py-3 pr-1">
          {notifications.length > 0 ? (
            notifications.map((item) => (
              <div
                key={item.id}
                className={`p-3.5 rounded-xl border transition ${
                  item.severity === 'critical'
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-200'
                    : item.severity === 'warning'
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                    : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center space-x-2 font-bold">
                    {item.severity === 'critical' ? (
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                    ) : (
                      <ShieldAlert className="w-4 h-4 text-amber-400" />
                    )}
                    <span>{item.poolName}</span>
                    <span className="text-[10px] bg-slate-800/80 px-1.5 py-0.5 rounded text-slate-400 uppercase">
                      {item.chainId}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <p className="text-xs font-medium mt-1 leading-snug">
                  {item.message}
                </p>

                <div className="mt-2 pt-1.5 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Price at Trigger: ${item.priceAtTrigger.toLocaleString()}</span>
                  <span className="text-[10px] text-emerald-400">Pushed to Browser & Telegram</span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-slate-500 space-y-2">
              <Bell className="w-8 h-8 mx-auto opacity-30" />
              <p className="text-xs">No alerts triggered yet. Your LP positions are operating within safe range bounds.</p>
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-xl"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
