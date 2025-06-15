// Polyfill for crypto.getRandomValues
if (typeof globalThis.crypto === 'undefined') {
  const crypto = require('crypto');
  globalThis.crypto = {
    getRandomValues: function(buffer) {
      const bytes = crypto.randomBytes(buffer.length);
      buffer.set(bytes);
      return buffer;
    }
  };
} 