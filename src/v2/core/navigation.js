export function createNavigation(window) {
  const listeners = new Set();
  const history = window.history;
  const wrappedMethods = new Map();

  function getLocation() {
    return {
      pathname: window.location.pathname,
      search: window.location.search,
      hash: window.location.hash
    };
  }

  let currentLocation = getLocation();

  function notifyIfChanged() {
    const nextLocation = getLocation();
    if (
      nextLocation.pathname === currentLocation.pathname &&
      nextLocation.search === currentLocation.search &&
      nextLocation.hash === currentLocation.hash
    ) {
      return;
    }

    currentLocation = nextLocation;
    for (const listener of listeners) listener(nextLocation);
  }

  for (const method of ["pushState", "replaceState"]) {
    const original = history[method];
    const wrapped = function (...args) {
      const result = Reflect.apply(original, this, args);
      notifyIfChanged();
      return result;
    };
    history[method] = wrapped;
    wrappedMethods.set(method, { original, wrapped });
  }

  window.addEventListener("popstate", notifyIfChanged);
  window.addEventListener("hashchange", notifyIfChanged);

  function subscribe(listener) {
    if (typeof listener !== "function") {
      throw new TypeError("A navigation subscription requires a callback.");
    }

    listeners.add(listener);
    listener(currentLocation);
    return () => listeners.delete(listener);
  }

  function destroy() {
    window.removeEventListener("popstate", notifyIfChanged);
    window.removeEventListener("hashchange", notifyIfChanged);
    for (const [method, { original, wrapped }] of wrappedMethods) {
      if (history[method] === wrapped) history[method] = original;
    }
    wrappedMethods.clear();
    listeners.clear();
  }

  return { subscribe, destroy };
}
