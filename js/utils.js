/**
 * Production-grade debounce utility
 * Supports trailing execution (default), optional leading mode,
 * and cancel capability for enterprise apps.
 */

function debounce(func, delay, options = {}) {
  let timer = null;

  const {
    leading = false,
    trailing = true
  } = options;

  let lastArgs = null;
  let lastThis = null;
  let hasCalledLeading = false;

  function debounced(...args) {
    lastArgs = args;
    lastThis = this;

    // Leading execution (optional)
    if (leading && !hasCalledLeading) {
      func.apply(lastThis, lastArgs);
      hasCalledLeading = true;
    }

    clearTimeout(timer);

    timer = setTimeout(() => {
      if (trailing && (!leading || hasCalledLeading)) {
        func.apply(lastThis, lastArgs);
      }
      hasCalledLeading = false;
      timer = null;
    }, delay);
  }

  // Cancel pending execution
  debounced.cancel = function () {
    clearTimeout(timer);
    timer = null;
    lastArgs = null;
    lastThis = null;
    hasCalledLeading = false;
  };

  // Force execution immediately
  debounced.flush = function () {
    if (timer) {
      clearTimeout(timer);
      func.apply(lastThis, lastArgs);
      timer = null;
      hasCalledLeading = false;
    }
  };

  return debounced;
}