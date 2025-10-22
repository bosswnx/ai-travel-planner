const resolveApiBase = () => {
  if (import.meta.env.VITE_API_BASE) {
    return import.meta.env.VITE_API_BASE;
  }

  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  return '';
};

export const appConfig = {
  apiBase: resolveApiBase(),
  amapKey: import.meta.env.VITE_AMAP_KEY || '',
};
