export type AppTheme = 'light' | 'warm' | 'dark';

export const themeStorageKey = 'quizroom_theme';

export const themes: { id: AppTheme; label: string }[] = [
  { id: 'light', label: 'Light' },
  { id: 'warm', label: 'Warm' },
  { id: 'dark', label: 'Calm dark' },
];

export function readTheme() {
  const savedTheme = localStorage.getItem(themeStorageKey);
  return savedTheme === 'warm' || savedTheme === 'dark' ? savedTheme : 'light';
}
