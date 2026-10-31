import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { CuisineId, GameState } from './types';
import * as P from './progression';

const STORAGE_KEY = 'servedup:save:v1';

interface GameApi {
  loaded: boolean;
  state: GameState | null;
  start: (chefName: string, cuisine: CuisineId) => void;
  buy: (ingredientId: string) => P.Result;
  unlockCuisine: (cuisine: CuisineId) => P.Result;
  switchCuisine: (cuisine: CuisineId) => void;
  cook: (recipeId: string) => ReturnType<typeof P.completeRecipe>;
  attachPhoto: (completionId: string, uri: string) => void;
  removePhoto: (completionId: string) => void;
  setNote: (completionId: string, note: string) => void;
  reset: () => Promise<void>;
}

const Ctx = createContext<GameApi | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState | null>(null);
  const [loaded, setLoaded] = useState(false);
  // Mirror of state so synchronous actions can compute results without waiting on a render.
  const ref = useRef<GameState | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) {
          const parsed = JSON.parse(raw) as GameState;
          if (parsed?.version === 1) {
            ref.current = parsed;
            setState(parsed);
          }
        }
      })
      .catch((e) => console.warn('Failed to load save', e))
      .finally(() => setLoaded(true));
  }, []);

  const commit = useCallback((next: GameState | null) => {
    ref.current = next;
    setState(next);
    if (next) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch((e) => console.warn('Save failed', e));
    else AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
  }, []);

  const api = useMemo<GameApi>(() => {
    const withState = <T,>(fn: (s: GameState) => T, fallback: T): T => (ref.current ? fn(ref.current) : fallback);
    const notStarted = { ok: false as const, error: 'unknown' as const };
    return {
      loaded,
      state,
      start: (name, cuisine) => commit(P.newGame(name, cuisine)),
      buy: (id) =>
        withState((s) => {
          const r = P.buyIngredient(s, id);
          if (r.ok) commit(r.state);
          return r;
        }, notStarted),
      unlockCuisine: (c) =>
        withState((s) => {
          const r = P.unlockCuisine(s, c);
          if (r.ok) commit(r.state);
          return r;
        }, notStarted),
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
      reset: async () => commit(null),
    };
  }, [loaded, state, commit]);

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
