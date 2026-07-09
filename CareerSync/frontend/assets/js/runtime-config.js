(function () {
  var isLocalHost =
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1';

  var configuredBackend = String(window.CAREERSYNC_BACKEND_URL || '').trim();
  var defaultBackend = isLocalHost
    ? 'http://localhost:3000'
    : 'https://YOUR_RENDER_BACKEND_URL';

  var backendUrl = (configuredBackend || defaultBackend).replace(/\/$/, '');

  function resolveUrl(url) {
    if (typeof url !== 'string') return url;
    if (url === '/api' || url.indexOf('/api/') === 0) return backendUrl + url;
    if (url === '/uploads' || url.indexOf('/uploads/') === 0) return backendUrl + url;
    return url;
  }

  window.CAREERSYNC_BACKEND_URL = backendUrl;
  window.CAREERSYNC_API_BASE = backendUrl + '/api';
  window.CAREERSYNC_RESOLVE_URL = resolveUrl;

  var originalFetch = window.fetch ? window.fetch.bind(window) : null;
  if (originalFetch) {
    window.fetch = function (input, init) {
      if (typeof input === 'string') {
        return originalFetch(resolveUrl(input), init);
      }
      return originalFetch(input, init);
    };
  }

  var originalOpen = window.open ? window.open.bind(window) : null;
  if (originalOpen) {
    window.open = function (url, target, features) {
      return originalOpen(resolveUrl(url), target, features);
    };
  }
})();
