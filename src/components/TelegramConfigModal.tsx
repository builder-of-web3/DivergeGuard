import React, { useState } from 'react';
import { X, Send, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';
import { sendTelegramAlert } from '../utils/notifications';

interface TelegramConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  telegramBotToken: string;
  telegramChatId: string;
  onSaveTelegram: (botToken: string, chatId: string) => void;
}

export const TelegramConfigModal: React.FC<TelegramConfigModalProps> = ({
  isOpen,
  onClose,
  telegramBotToken,
  telegramChatId,
  onSaveTelegram,
}) => {
  if (!isOpen) return null;

  const [botToken, setBotToken] = useState(telegramBotToken);
  const [chatId, setChatId] = useState(telegramChatId);
  const [testResult, setTestResult] = useState<{ loading: boolean; success?: boolean; msg?: string }>({ loading: false });

  const handleTestConnection = async () => {
    if (!botToken.trim() || !chatId.trim()) {
      setTestResult({ loading: false, success: false, msg: 'Please provide both Bot Token and Chat ID' });
      return;
    }

    setTestResult({ loading: true });

    const res = await sendTelegramAlert(botToken, chatId, {
      poolName: 'ETH - USDG (Robinhood Chain)',
      chainId: 'Robinhood Chain',
      message: 'Lower alert threshold ($1,850) test check complete!',
      severity: 'warning',
      priceAtTrigger: 1848.50,
    });

    if (res.success) {
      setTestResult({ loading: false, success: true, msg: '✅ Test message sent successfully to your Telegram chat!' });
      onSaveTelegram(botToken, chatId);
    } else {
      setTestResult({ loading: false, success: false, msg: `❌ Telegram Error: ${res.error}` });
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveTelegram(botToken, chatId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#121824] border border-slate-800 text-white rounded-2xl w-full max-w-lg p-6 shadow-2xl relative animate-fadeIn">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 border-b border-slate-800 pb-4 mb-4">
          <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
            <Send className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-bold">Telegram Bot Push Notifications</h2>
              <span className="px-2 py-0.5 text-[10px] bg-amber-500/20 text-amber-300 font-bold rounded border border-amber-500/30 font-mono">
                Coming Soon
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Receive instant LP divergence and impermanent loss alerts on mobile & desktop via Telegram
            </p>
          </div>
        </div>

        {/* Coming Soon Notice Banner */}
        <div className="mb-4 bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl text-amber-300 text-xs flex items-start space-x-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold block text-amber-300">Feature Status: Coming Soon</span>
            <span className="text-amber-200/90 text-[11px] leading-relaxed block">
              Automated Telegram cloud push relay is currently under active development and not fully live yet. You can configure and test your bot credentials below. Browser Audio & Sentinel In-App alerts are active.
            </span>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          
          {/* Quick Guide */}
          <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-slate-300 space-y-1.5">
            <span className="font-bold text-sky-400 block text-xs">How to connect in 2 minutes:</span>
            <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-400">
              <li>Open Telegram and search for <strong className="text-white">@BotFather</strong></li>
              <li>Send <code className="bg-slate-800 px-1 rounded text-sky-300">/newbot</code> to get your HTTP API Bot Token</li>
              <li>Start a chat with your new bot and get your Chat ID (using <strong className="text-white">@userinfobot</strong>)</li>
            </ol>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Telegram Bot Token *</label>
            <input
              type="text"
              required
              value={botToken}
              onChange={(e) => setBotToken(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 font-mono text-xs text-sky-200 rounded-xl p-2.5 focus:border-sky-500 focus:outline-none"
              placeholder="e.g. 123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Telegram Chat ID *</label>
            <input
              type="text"
              required
              value={chatId}
              onChange={(e) => setChatId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 font-mono text-xs text-sky-200 rounded-xl p-2.5 focus:border-sky-500 focus:outline-none"
              placeholder="e.g. 987654321 or -100123456789"
            />
          </div>

          {testResult.msg && (
            <div className={`p-3 rounded-xl text-xs font-semibold flex items-center space-x-2 ${
              testResult.success ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
            }`}>
              {testResult.success ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-rose-400" />}
              <span>{testResult.msg}</span>
            </div>
          )}

          <div className="flex justify-between items-center pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testResult.loading}
              className="px-4 py-2 bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/40 text-xs font-semibold rounded-xl transition flex items-center space-x-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{testResult.loading ? 'Sending Test...' : 'Send Test Alert'}</span>
            </button>

            <div className="flex space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-sky-500/20"
              >
                Save Settings
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
