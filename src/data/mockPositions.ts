import { LPPosition } from '../types';

export const INITIAL_POSITIONS: LPPosition[] = [];

const POSITIONS_STORAGE_KEY = 'divergeguard_user_fetched_positions_v3';

export function loadStoredPositions(): LPPosition[] {
  try {
    // Clear out any legacy keys that held mock default positions
    localStorage.removeItem('divergeguard_robinhood_positions_v2');
    localStorage.removeItem('divergeguard_robinhood_positions_v1');
    localStorage.removeItem('divergeguard_robinhood_positions');
    localStorage.removeItem('omnilp_saved_positions_v1');
    localStorage.removeItem('omnilp_saved_positions');

    const raw = localStorage.getItem(POSITIONS_STORAGE_KEY);
    if (raw) {
      const parsed: LPPosition[] = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Filter out any lingering mock items
        const userOnly = parsed.filter(
          (p) => !p.id.includes('pos-robinhood') && !p.id.includes('pos-rh-')
        );
        return userOnly;
      }
    }
  } catch (e) {
    console.error('Failed to load stored positions', e);
  }
  return [];
}

export function saveStoredPositions(positions: LPPosition[]) {
  try {
    localStorage.setItem(POSITIONS_STORAGE_KEY, JSON.stringify(positions));
  } catch (e) {
    console.error('Failed to save positions', e);
  }
}

