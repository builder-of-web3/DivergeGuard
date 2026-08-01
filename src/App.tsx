import React, { useState, useEffect, useCallback } from 'react';
import { 
  LPPosition, 
  Chain, 
  AlertNotification 
} from './types';
import { 
  INITIAL_POSITIONS, 
  loadStoredPositions, 
  saveStoredPositions 
} from './data/mockPositions';
import { 
  getStoredChains, 
  saveCustomChain 
} from './data/chains';
import { 
  calculateConcentratedAmounts, 
  calculateImpermanentLoss, 
  evaluatePositionStatus 
} from './utils/lpMath';
import { playAlertSound } from './utils/sound';
import { 
  requestBrowserNotificationPermission, 
  sendBrowserNotification, 
  sendTelegramAlert 
} from './utils/notifications';
import { 
  fetchWalletPortfolio, 
  WalletPortfolioResult 
} from './utils/blockchain';

import { Navbar } from './components/Navbar';
import { PriceSimulatorBar } from './components/PriceSimulatorBar';
import { PositionList } from './components/PositionList';
import { PositionDetailView } from './components/PositionDetailView';
import { AddPositionModal } from './components/AddPositionModal';
import { AddCustomChainModal } from './components/AddCustomChainModal';
import { TelegramConfigModal } from './components/TelegramConfigModal';
import { NotificationCenterModal } from './components/NotificationCenterModal';
import { LandingPage } from './components/LandingPage';

import { ExternalLink, Layers, Plus, ShieldCheck, Zap, Globe, Sparkles, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [pageMode, setPageMode] = useState<'landing' | 'app'>('landing');
  const [positions, setPositions] = useState<LPPosition[]>(() => loadStoredPositions());
  const [chains, setChains] = useState<Chain[]>(() => getStoredChains());
  const [selectedChainId, setSelectedChainId] = useState<string>('robinhood');
  const [activeTab, setActiveTab] = useState<'positions' | 'chains'>('positions');
  const [selectedPositionId, setSelectedPositionId] = useState<string | null>(null);
  const [isFetchingWallet, setIsFetchingWallet] = useState<boolean>(false);

  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [telegramBotToken, setTelegramBotToken] = useState<string>('');
  const [telegramChatId, setTelegramChatId] = useState<string>('');

  const [notifications, setNotifications] = useState<AlertNotification[]>([]);
  const [activeSmsToast, setActiveSmsToast] = useState<{ phone: string; message: string; pool: string } | null>(null);

  // Modals state
  const [isAddPosOpen, setIsAddPosOpen] = useState(false);
  const [isAddChainOpen, setIsAddChainOpen] = useState(false);
  const [isTelegramOpen, setIsTelegramOpen] = useState(false);
  const [isNotifCenterOpen, setIsNotifCenterOpen] = useState(false);

  useEffect(() => {
    requestBrowserNotificationPermission();
  }, []);

  // Sync positions to localStorage
  useEffect(() => {
    saveStoredPositions(positions);
  }, [positions]);

  const selectedPosition = selectedPositionId ? positions.find((p) => p.id === selectedPositionId) || null : null;

  const handleFetchPositions = async (address: string, chainId: string) => {
    setIsFetchingWallet(true);
    try {
      const res = await fetchWalletPortfolio(address, chainId);
      if (res.lpPositions && res.lpPositions.length > 0) {
        setPositions(res.lpPositions);
        setSelectedChainId(chainId);
      } else {
        alert(`No active LP positions found for address ${address} on network ${chainId}.`);
      }
    } catch (e) {
      console.error(e);
      alert('Failed to fetch LP positions for address. Please check your network connection.');
    } finally {
      setIsFetchingWallet(false);
    }
  };

  // Handle live price updates and trigger alerts
  const handleUpdatePrice = useCallback((positionId: string, newPrice: number) => {
    setPositions((prevPositions) =>
      prevPositions.map((pos) => {
        if (pos.id !== positionId) return pos;

        // Recalculate concentrated token amounts
        const { token0Amount, token1Amount } = calculateConcentratedAmounts(
          newPrice,
          pos.minPrice,
          pos.maxPrice,
          pos.token0.initialAmount,
          pos.token1.initialAmount,
          pos.entryPrice
        );

        const newStatus = evaluatePositionStatus(
          newPrice,
          pos.minPrice,
          pos.maxPrice,
          pos.alertConfig.lowerPriceThreshold,
          pos.alertConfig.upperPriceThreshold
        );

        const updatedToken0 = { ...pos.token0, amount: token0Amount, priceUSD: newPrice };
        const updatedToken1 = { ...pos.token1, amount: token1Amount };

        const tempPos = { ...pos, token0: updatedToken0, token1: updatedToken1, currentPrice: newPrice };
        const ilData = calculateImpermanentLoss(tempPos);

        // Check if price crosses lower or upper alert threshold
        const isUpperExceeded = newPrice >= pos.alertConfig.upperPriceThreshold;
        const isLowerExceeded = newPrice <= pos.alertConfig.lowerPriceThreshold;
        const isILExceeded = Math.abs(ilData.ilPercentage) >= pos.alertConfig.ilPercentageLimit;

        if (pos.alertConfig.enabled && (isUpperExceeded || isLowerExceeded || isILExceeded)) {
          let alertMsg = '';
          let severity: 'warning' | 'critical' = 'warning';

          if (isUpperExceeded) {
            alertMsg = `Upper Alert Triggered! Price $${newPrice.toLocaleString()} >= Threshold $${pos.alertConfig.upperPriceThreshold}`;
            severity = 'warning';
          } else if (isLowerExceeded) {
            alertMsg = `Lower Alert Triggered! Price $${newPrice.toLocaleString()} <= Threshold $${pos.alertConfig.lowerPriceThreshold}`;
            severity = 'warning';
          } else if (isILExceeded) {
            alertMsg = `Impermanent Loss Alert! Current IL is ${ilData.ilPercentage}% (Exceeds limit ${pos.alertConfig.ilPercentageLimit}%)`;
            severity = 'critical';
          }

          // Trigger sound
          if (soundEnabled && pos.alertConfig.notifySound) {
            playAlertSound(severity);
          }

          // Trigger Browser Push
          if (pos.alertConfig.notifyBrowser) {
            sendBrowserNotification(`🚨 ${pos.poolName} LP Alert!`, alertMsg);
          }

          // Trigger SMS On Screen
          if (pos.alertConfig.notifySMS ?? true) {
            setActiveSmsToast({
              phone: pos.alertConfig.smsNumber || '+1 (555) 392-8104',
              message: alertMsg,
              pool: pos.poolName,
            });
          }

          // Trigger Telegram Bot
          const activeBotToken = pos.alertConfig.telegramBotToken || telegramBotToken;
          const activeChatId = pos.alertConfig.telegramChatId || telegramChatId;
          if (pos.alertConfig.notifyTelegram && activeBotToken && activeChatId) {
            sendTelegramAlert(activeBotToken, activeChatId, {
              poolName: pos.poolName,
              chainId: pos.chainId,
              message: alertMsg,
              severity,
              priceAtTrigger: newPrice,
            });
          }

          // Append to Notification Center
          const newNotif: AlertNotification = {
            id: `notif-${Date.now()}`,
            positionId: pos.id,
            poolName: pos.poolName,
            chainId: pos.chainId,
            timestamp: new Date().toISOString(),
            type: isUpperExceeded ? 'upper_bound' : isLowerExceeded ? 'lower_bound' : 'il_limit',
            message: alertMsg,
            severity,
            read: false,
            priceAtTrigger: newPrice,
          };

          setNotifications((prev) => [newNotif, ...prev]);

          // Log in position history
          const historyEntry = {
            id: `hist-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            action: 'Alert Triggered' as const,
            valueUSD: ilData.lpValueUSD,
            token0Amount,
            token1Amount,
            notes: alertMsg,
          };

          return {
            ...pos,
            currentPrice: newPrice,
            status: newStatus,
            token0: updatedToken0,
            token1: updatedToken1,
            positionHistory: [historyEntry, ...pos.positionHistory],
          };
        }

        return {
          ...pos,
          currentPrice: newPrice,
          status: newStatus,
          token0: updatedToken0,
          token1: updatedToken1,
        };
      })
    );
  }, [soundEnabled, telegramBotToken, telegramChatId]);

  // Trigger explicit test alert
  const handleTriggerTestAlert = (pos: LPPosition) => {
    if (soundEnabled) playAlertSound('warning');
    sendBrowserNotification(`🚨 ${pos.poolName} Test Alert`, `Test divergence warning fired at $${pos.currentPrice}`);

    const newNotif: AlertNotification = {
      id: `notif-${Date.now()}`,
      positionId: pos.id,
      poolName: pos.poolName,
      chainId: pos.chainId,
      timestamp: new Date().toISOString(),
      type: 'price_shift',
      message: `Manual test notification triggered at current price $${pos.currentPrice}`,
      severity: 'info',
      read: false,
      priceAtTrigger: pos.currentPrice,
    };

    setNotifications((prev) => [newNotif, ...prev]);

    // Dispatch SMS Toast on screen
    setActiveSmsToast({
      phone: pos.alertConfig.smsNumber || '+1 (555) 392-8104',
      message: `[DivergeGuard SMS] TEST ALERT: Manual test warning fired for ${pos.poolName} at price $${pos.currentPrice}`,
      pool: pos.poolName,
    });

    if (telegramBotToken && telegramChatId) {
      sendTelegramAlert(telegramBotToken, telegramChatId, {
        poolName: pos.poolName,
        chainId: pos.chainId,
        message: 'Manual test message from OmniLP Dashboard',
        severity: 'info',
        priceAtTrigger: pos.currentPrice,
      });
    }
  };

  const handleAddPosition = (newPos: LPPosition) => {
    setPositions((prev) => [newPos, ...prev]);
    setSelectedPositionId(newPos.id);
  };

  const handleUpdateAlertConfig = (updatedPos: LPPosition) => {
    setPositions((prev) => prev.map((p) => (p.id === updatedPos.id ? updatedPos : p)));
  };

  const handleDeletePosition = (posId: string) => {
    setPositions((prev) => prev.filter((p) => p.id !== posId));
    if (selectedPositionId === posId) {
      setSelectedPositionId(null);
    }
  };

  const handleSaveCustomChain = (newChain: Chain) => {
    const updated = saveCustomChain(newChain);
    setChains(updated);
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950 flex flex-col">
      
      {/* Top Navigation */}
      <Navbar
        chains={chains}
        selectedChainId={selectedChainId}
        onSelectChain={setSelectedChainId}
        onOpenAddCustomChain={() => setIsAddChainOpen(true)}
        onOpenAddPosition={() => setIsAddPosOpen(true)}
        onOpenTelegramConfig={() => setIsTelegramOpen(true)}
        onOpenNotificationCenter={() => setIsNotifCenterOpen(true)}
        notifications={notifications}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        pageMode={pageMode}
        onSelectPageMode={setPageMode}
      />

      {/* Main Container Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* Global Active Red Alert SMS & Sentinel Banner */}
        {activeSmsToast && (
          <div className="bg-red-950/95 border-2 border-red-500 text-red-100 p-4 rounded-2xl shadow-2xl shadow-red-950/80 flex items-center justify-between gap-4 animate-pulse">
            <div className="flex items-center space-x-3">
              <span className="text-2xl animate-bounce">🚨</span>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-sm text-red-200 uppercase tracking-wide flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                    RED ALERT TRIGGERED — {activeSmsToast.pool}
                  </span>
                  <span className="text-xs bg-red-900 text-red-200 px-2.5 py-0.5 rounded-full font-mono border border-red-700/60 font-bold">
                    SMS: {activeSmsToast.phone}
                  </span>
                </div>
                <p className="text-xs text-red-100 mt-1.5 font-mono bg-red-900/60 p-2 rounded-xl border border-red-700/80 font-medium">
                  "{activeSmsToast.message}"
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveSmsToast(null)}
              className="text-xs font-bold text-red-200 hover:text-white bg-red-900/80 hover:bg-red-800 px-3 py-2 rounded-xl border border-red-600 shadow-md cursor-pointer whitespace-nowrap"
            >
              Dismiss ✕
            </button>
          </div>
        )}
        
        {/* Landing Page (Home View) */}
        {pageMode === 'landing' ? (
          <LandingPage 
            onLaunchApp={() => setPageMode('app')} 
            chains={chains} 
          />
        ) : (
          <>
            {/* Positions View */}
            {activeTab === 'positions' && (
          <>
            {selectedPositionId && selectedPosition ? (
              <div className="space-y-4">
                
                {/* Live Volatility Price Simulator Header Bar */}
                <PriceSimulatorBar
                  position={selectedPosition}
                  onUpdatePrice={(newP) => handleUpdatePrice(selectedPosition.id, newP)}
                  onResetPrice={() => handleUpdatePrice(selectedPosition.id, selectedPosition.entryPrice)}
                />

                {/* Position High-Fidelity Detail View */}
                <PositionDetailView
                  position={selectedPosition}
                  chain={chains.find((c) => c.id === selectedPosition.chainId)}
                  onBack={() => setSelectedPositionId(null)}
                  onUpdateAlertConfig={handleUpdateAlertConfig}
                  onDeletePosition={handleDeletePosition}
                  onTriggerTestAlert={handleTriggerTestAlert}
                />
              </div>
            ) : (
              /* Grid Overview of All Positions */
              <PositionList
                positions={positions}
                chains={chains}
                selectedChainId={selectedChainId}
                onSelectChain={setSelectedChainId}
                onSelectPosition={(pos) => setSelectedPositionId(pos.id)}
                onOpenAddPosition={() => setIsAddPosOpen(true)}
                onFetchPositions={handleFetchPositions}
                isFetchingWallet={isFetchingWallet}
              />
            )}
          </>
        )}

        {/* Blockchains & Provisioning View */}
        {activeTab === 'chains' && (
          <div className="space-y-6 text-white pb-12">
            <div className="bg-[#121824] border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold flex items-center space-x-2">
                  <Globe className="w-5 h-5 text-emerald-400" />
                  <span>Supported Blockchains & Custom Chains</span>
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  DivergeGuard supports monitoring liquidity positions on any EVM or non-EVM network with custom RPC provision
                </p>
              </div>

              <button
                onClick={() => setIsAddChainOpen(true)}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition flex items-center space-x-1.5 self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Provision New Chain</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {chains.map((chain) => {
                const chainPosCount = positions.filter((p) => p.chainId === chain.id).length;

                return (
                  <div
                    key={chain.id}
                    className="bg-[#121824] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2.5">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs border ${chain.iconBg}`}>
                            {chain.symbol.substring(0, 3)}
                          </div>
                          <div>
                            <h3 className="font-bold text-sm text-white">{chain.name}</h3>
                            <span className="text-[11px] text-slate-400 font-mono">
                              Native: {chain.symbol}
                            </span>
                          </div>
                        </div>

                        {chain.isCustom ? (
                          <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full">
                            Custom
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full">
                            Pre-configured
                          </span>
                        )}
                      </div>

                      <div className="mt-4 bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1 text-xs text-slate-400 font-mono">
                        <div className="flex justify-between">
                          <span>RPC:</span>
                          <span className="text-slate-200 truncate max-w-[180px]" title={chain.rpcUrl}>
                            {chain.rpcUrl || 'Default RPC'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Chain ID:</span>
                          <span className="text-slate-200">{chain.chainIdNumber || '-'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                      <span className="text-slate-400">
                        Active Pools: <strong className="text-white">{chainPosCount}</strong>
                      </span>
                      <button
                        onClick={() => {
                          setSelectedChainId(chain.id);
                          setActiveTab('positions');
                          setSelectedPositionId(null);
                        }}
                        className="text-emerald-400 hover:underline font-semibold"
                      >
                        Filter Positions ↗
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </>
    )}
  </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#0A0D12] py-6 text-center text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>DivergeGuard — Cross-Chain Liquidity Pool Range Bounds & Impermanent Loss Alert Engine</span>
          <span className="text-slate-400">Supporting Robinhood Chain, Ethereum, Arbitrum, Solana & Custom EVMs</span>
        </div>
      </footer>

      {/* Modals */}
      <AddPositionModal
        chains={chains}
        isOpen={isAddPosOpen}
        onClose={() => setIsAddPosOpen(false)}
        onAddPosition={handleAddPosition}
      />

      <AddCustomChainModal
        isOpen={isAddChainOpen}
        onClose={() => setIsAddChainOpen(false)}
        onSaveChain={handleSaveCustomChain}
      />

      <TelegramConfigModal
        isOpen={isTelegramOpen}
        onClose={() => setIsTelegramOpen(false)}
        telegramBotToken={telegramBotToken}
        telegramChatId={telegramChatId}
        onSaveTelegram={(tok, id) => {
          setTelegramBotToken(tok);
          setTelegramChatId(id);
        }}
      />

      <NotificationCenterModal
        isOpen={isNotifCenterOpen}
        onClose={() => setIsNotifCenterOpen(false)}
        notifications={notifications}
        onClearAll={() => setNotifications([])}
        onMarkAllAsRead={() => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))}
      />

    </div>
  );
}
