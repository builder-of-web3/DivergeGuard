import { AlertNotification } from '../types';

export async function requestBrowserNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.warn('Browser does not support desktop notification');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

export function sendBrowserNotification(title: string, body: string, icon?: string) {
  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon: icon || 'https://raw.githubusercontent.com/feathericons/feather/master/icons/alert-triangle.svg',
        tag: 'divergeguard-alert',
      });
    } catch (e) {
      console.error('Failed to trigger browser notification:', e);
    }
  }
}

export async function sendTelegramAlert(
  botToken: string,
  chatId: string,
  alert: Pick<AlertNotification, 'poolName' | 'chainId' | 'message' | 'severity' | 'priceAtTrigger'>
): Promise<{ success: boolean; error?: string }> {
  if (!botToken || !chatId) {
    return { success: false, error: 'Telegram Bot Token or Chat ID missing' };
  }

  const emoji = alert.severity === 'critical' ? '🚨' : alert.severity === 'warning' ? '⚠️' : 'ℹ️';
  
  const text = `${emoji} *DivergeGuard Pool Alert Triggered!*

*Pool:* ${alert.poolName}
*Chain:* ${alert.chainId}
*Current Price:* $${alert.priceAtTrigger.toLocaleString()}
*Status:* ${alert.message}

👉 _Open DivergeGuard Dashboard to rebalance or protect your liquidity position!_`;

  try {
    const url = `https://api.telegram.org/bot${botToken.trim()}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId.trim(),
        text,
        parse_mode: 'Markdown',
      }),
    });

    const data = await response.json();
    if (data.ok) {
      return { success: true };
    } else {
      return { success: false, error: data.description || 'Telegram API returned error' };
    }
  } catch (e: unknown) {
    const errMsg = e instanceof Error ? e.message : 'Network error reaching Telegram API';
    return { success: false, error: errMsg };
  }
}

export async function sendWebhookAlert(
  webhookUrl: string,
  alert: AlertNotification
): Promise<{ success: boolean; error?: string }> {
  if (!webhookUrl) {
    return { success: false, error: 'Webhook URL missing' };
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'omnilp_alert',
        timestamp: alert.timestamp,
        pool: alert.poolName,
        chain: alert.chainId,
        severity: alert.severity,
        price: alert.priceAtTrigger,
        message: alert.message,
      }),
    });

    if (response.ok) {
      return { success: true };
    } else {
      return { success: false, error: `HTTP ${response.status}: ${response.statusText}` };
    }
  } catch (e: unknown) {
    const errMsg = e instanceof Error ? e.message : 'Failed to reach webhook URL';
    return { success: false, error: errMsg };
  }
}
