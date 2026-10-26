import storage from 'local-storage-fallback'

if (typeof window !== 'undefined' && !window.localStorage) {
  window.localStorage = storage
}