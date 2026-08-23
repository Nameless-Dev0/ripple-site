export function getInitialTheme() {
  if (typeof document !== 'undefined') {
    const fromDom = document.documentElement.getAttribute('data-theme');
    if (fromDom === 'light' || fromDom === 'dark') return fromDom;
  }
  if (typeof localStorage !== 'undefined') {
    const stored = localStorage.getItem('ripple-theme');
    if (stored === 'light' || stored === 'dark') return stored;
  }
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
}

export function persistTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('ripple-theme', theme);
}
