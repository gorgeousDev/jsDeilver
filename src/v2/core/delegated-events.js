function normalizeOptions(options) {
  return {
    capture: options === true || Boolean(options && options.capture),
    passive: Boolean(options && options.passive)
  };
}

export function createDelegatedEvents(document) {
  // Each key owns one real document listener; subscriptions are fanned out
  // through it so features don't install duplicate listeners for the same event.
  const listeners = new Map();

  function getKey(type, options) {
    return `${type}:${options.capture}:${options.passive}`;
  }

  function add(type, selector, callback, options = {}) {
    if (typeof type !== "string" || !type) {
      throw new TypeError("An event subscription requires an event type.");
    }
    if (selector !== null && typeof selector !== "string") {
      throw new TypeError("An event selector must be a string or null.");
    }
    if (typeof callback !== "function") {
      throw new TypeError("An event subscription requires a callback.");
    }

    const normalized = normalizeOptions(options);
    const key = getKey(type, normalized);
    let listener = listeners.get(key);

    if (!listener) {
      const subscriptions = new Set();
      const dispatch = (event) => {
        for (const subscription of subscriptions) {
          // A null selector means "listen everywhere"; otherwise only call
          // the subscriber when the event started inside a matching element.
          const matched = subscription.selector === null
            ? null
            : event.target && typeof event.target.closest === "function"
              ? event.target.closest(subscription.selector)
              : null;
          if (subscription.selector === null || matched) {
            try {
              subscription.callback(event, matched);
            } catch (error) {
              console.error(`[Akkad] Event feature callback failed: ${type}`, error);
            }
          }
        }
      };

      listener = { type, options: normalized, subscriptions, dispatch };
      listeners.set(key, listener);
      document.addEventListener(type, dispatch, normalized);
    }

    const subscription = { selector, callback };
    listener.subscriptions.add(subscription);

    // Removing a subscription only removes the native listener when it was
    // the last consumer of that event/options group.
    return () => {
      listener.subscriptions.delete(subscription);
      if (listener.subscriptions.size > 0) return;

      document.removeEventListener(type, listener.dispatch, normalized);
      listeners.delete(key);
    };
  }

  function destroy() {
    // Runtime shutdown removes every native listener, even if a feature forgot
    // to unsubscribe individually.
    for (const listener of listeners.values()) {
      document.removeEventListener(listener.type, listener.dispatch, listener.options);
    }
    listeners.clear();
  }

  return {
    on(type, selector, callback, options) {
      return add(type, selector, callback, options);
    },
    destroy
  };
}
