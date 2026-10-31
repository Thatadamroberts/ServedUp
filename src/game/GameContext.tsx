import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { AppState } from 'react-native';
import type { Achievement } from './achievements';
import * as P from './progression';
import type { CuisineId, GameState } from './types';

const STORAGE_KEY = 'servedup:save:v1';

interface GameApi {
  loaded: boolean;
  state: GameState | null;
  /** Achievements unlocked but not yet shown to the player. */
  toasts: Achievement[];
  dismissToast: () => void;
  start: (chefName: string, cuisine: CuisineId) => void;
  buy: (ingredientId: string) => P.Result;
  unlockCuisine: (cuisine: CuisineId) => P.Result;
  switchCuisine: (cuisine: CuisineId) => void;
  cook: (recipeId: string) => ReturnType<typeof P.completeRecipe>;
  attachPhoto: (completionId: string, uri: string) => void;
  removePhoto: (completionId: string) => void;
  setNote: (completionId: string, note: string) => void;
  buyCosmetic: (id: string) => P.Result;
  equip: (id: string) => void;
  refreshDaily: () => void;
  reset: () => Promise<void>;
}

const Ctx = createContext<GameApi | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [toasts, setToasts] = useState<Achievement[]>([]);
  // Mirror of state so synchronous actions can compute results without waiting on a render.
  const ref = useRef<GameState | null>(null);

  /** Every state change goes through here: achievements are checked, then the save is written. */
  const commit = useCallback((next: GameState | null) => {
    if (next) {
      const checked = P.applyAchievements(next);
      next = checked.state;
      if (checked.unlocked.length) setToasts((t) => [...t, ...checked.unlocked]);
    }
    ref.current = next;
    setState(next);
    if (next) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch((e) => console.warn('Save failed', e));
    else AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
  }, []);

  const refreshDaily = useCallback(() => {
    const s = ref.current;
    if (!s) return;
    const next = P.ensureDailySpecial(s);
    if (next !== s) commit(next);
  }, [commit]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!raw) return;
        const parsed = JSON.parse(raw) as GameState;
        if (parsed?.version !== 1) return;
        const s = P.ensureDailySpecial(P.normalizeState(parsed));
        ref.current = s;
        setState(s);
      })
      .catch((e) => console.warn('Failed to load save', e))
      .finally(() => setLoaded(true));
  }, []);

  // Roll a new Chef's Special when the app comes back to the foreground on a new day.
  useEffect(() => {
    const sub = AppState.addEventListener('change', (s) => {
      if (s === 'active') refreshDaily();
    });
    return () => sub.remove();
  }, [refreshDaily]);

  const api = useMemo<GameApi>(() => {
    const withState = <T,>(fn: (s: GameState) => T, fallback: T): T => (ref.current ? fn(ref.current) : fallback);
    const notStarted = { ok: false as const, error: 'unknown' as const };
    const result = (fn: (s: GameState) => P.Result) =>
      withState((s) => {
        const r = fn(s);
        if (r.ok) commit(r.state);
        return r;
      }, notStarted as P.Result);
    return {
      loaded,
      state,
      toasts,
      dismissToast: () => setToasts((t) => t.slice(1)),
      start: (name, cuisine) => commit(P.ensureDailySpecial(P.newGame(name, cuisine))),
      buy: (id) => result((s) => P.buyIngredient(s, id)),
      unlockCuisine: (c) => result((s) => P.unlockCuisine(s, c)),
      switchCuisine: (c) => withState((s) => commit(P.setActiveCuisine(s, c)), undefined),
      cook: (recipeId) =>
        withState((s) => {
          const r = P.completeRecipe(s, recipeId);
          if (r.ok) commit(r.outcome.state);
          return r;
        }, notStarted),
      attachPhoto: (id, uri) => withState((s) => commit(P.attachPhoto(s, id, uri)), undefined),
      removePhoto: (id) => withState((s) => commit(P.removePhoto(s, id)), undefined),
      setNote: (id, note) => withState((s) => commit(P.setNote(s, id, note)), undefined),
      buyCosmetic: (id) => result((s) => P.buyCosmetic(s, id)),
      equip: (id) => withState((s) => commit(P.equipCosmetic(s, id)), undefined),
      refreshDaily,
      reset: async () => {
        setToasts([]);
        commit(null);
      },
    };
  }, [loaded, state, toasts, commit, refreshDaily]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useGame(): GameApi {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useGame must be used inside GameProvider');
  return ctx;
}

/** For screens that only render after onboarding. */
export function useGameState(): GameState {
  const { state } = useGame();
  if (!state) throw new Error('Game not started');
  return state;
}
