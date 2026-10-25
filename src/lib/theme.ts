// Light/dark theme: manual choice persisted in localStorage, system preference otherwise.
// The inline script in src/routes/__root.tsx applies the class before first paint.
import { useSyncExternalStore } from 'react';

const KEY = 'myworld:theme';
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function storedChoice(): 'light' | 'dark' | null {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'light' || v === 'dark' ? v : null;
  } catch {
    return null;
  }
}

function systemDark(): boolean {
  return typeof matchMedia !== 'undefined' && matchMedia('(prefers-color-scheme: dark)').matches;
}

function applyClass() {
  const choice = storedChoice();
  document.documentElement.classList.toggle('dark', choice ? choice === 'dark' : systemDark());
}

export function toggleTheme() {
  const dark = document.documentElement.classList.contains('dark');
  try {
    localStorage.setItem(KEY, dark ? 'light' : 'dark');
  } catch {
    /* private mode: fall back to class only */
  }
  applyClass();
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const mq = matchMedia('(prefers-color-scheme: dark)');
  const onSystem = () => {
    if (!storedChoice()) applyClass();
    emit();
  };
  mq.addEventListener('change', onSystem);
  return () => {
    listeners.delete(listener);
    mq.removeEventListener('change', onSystem);
  };
}

export function useIsDark() {
  return useSyncExternalStore(
    subscribe,
    () => document.documentElement.classList.contains('dark'),
    () => false,
  );
}
