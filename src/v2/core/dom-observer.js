export function createDomObserver(document, window) {
  // One observer serves every subscriber; each subscription has its own
  // selector and callback, while the core owns the shared observer lifecycle.
  const subscriptions = new Set();
  const addedNodeListeners = new Set();
  const scopedObservers = new Set();
  let observer = null;
  let observedRoot = null;

  function notify(subscription, node) {
    // Mutation records include text nodes. Selectors apply only to elements.
    if (node.nodeType !== 1) return;

    // Check the added node itself as well as descendants. A newly inserted
    // <video> won't be returned by querying inside that video node.
    if (node.matches(subscription.selector)) {
      invoke(subscription, node);
    }

    for (const element of node.querySelectorAll(subscription.selector)) {
      invoke(subscription, element);
    }
  }

  function invoke(subscription, element) {
    try {
      subscription.onElement(element);
    } catch (error) {
      window.console.error("[Akkad] DOM feature callback failed.", error);
    }
  }

  function notifyTree(node) {
    for (const subscription of subscriptions) {
      notify(subscription, node);
    }
  }

  function stopIfUnused() {
    // Either API can keep the shared observer alive, so stop only after both
    // kinds of subscribers are gone.
    if (subscriptions.size > 0 || addedNodeListeners.size > 0 || !observer) return;
    observer.disconnect();
    observedRoot = null;
  }

  function startObserving() {
    // A script in <head> may run before body exists. Observe the document root
    // for that short period, then move the same observer to body.
    const root = document.body || document.documentElement;
    if (!root || root === observedRoot) return;

    if (!observer) {
      observer = new window.MutationObserver((mutations) => {
        if (document.body && observedRoot !== document.body) {
          observer.disconnect();
          observedRoot = null;
          startObserving();
          return;
        }

        for (const mutation of mutations) {
          for (const node of mutation.addedNodes) {
            notifyTree(node);
            for (const onAdded of addedNodeListeners) {
              try {
                onAdded(node);
              } catch (error) {
                window.console.error("[Akkad] DOM addition callback failed.", error);
              }
            }
          }
        }
      });
    } else {
      observer.disconnect();
    }

    observedRoot = root;
    observer.observe(root, { childList: true, subtree: true });
    notifyTree(root);
    for (const onAdded of addedNodeListeners) {
      try {
        onAdded(root);
      } catch (error) {
        window.console.error("[Akkad] DOM addition callback failed.", error);
      }
    }
  }

  function subscribe(selector, onElement) {
    if (typeof selector !== "string" || !selector) {
      throw new TypeError("A DOM subscription requires a selector.");
    }
    if (typeof onElement !== "function") {
      throw new TypeError("A DOM subscription requires an element callback.");
    }

    const subscription = { selector, onElement };
    const previousRoot = observedRoot;
    subscriptions.add(subscription);
    startObserving();
    // startObserving scans all subscriptions when it attaches/re-attaches.
    // If already attached, scan only this new subscriber to avoid repeating
    // the work for existing subscribers.
    if (previousRoot === observedRoot && observedRoot) {
      notify(subscription, observedRoot);
    }

    return () => {
      subscriptions.delete(subscription);
      // Stop spending work on DOM mutations when nobody is listening.
      stopIfUnused();
    };
  }

  function destroy() {
    subscriptions.clear();
    addedNodeListeners.clear();
    if (observer) observer.disconnect();
    observer = null;
    observedRoot = null;
    for (const scopedObserver of scopedObservers) {
      scopedObserver.disconnect();
    }
    scopedObservers.clear();
  }

  function observe(target, callback, options = {}) {
    if (!target || typeof target.nodeType !== "number") {
      throw new TypeError("A scoped DOM observer requires a DOM node.");
    }
    if (typeof callback !== "function") {
      throw new TypeError("A scoped DOM observer requires a callback.");
    }

    const scopedObserver = new window.MutationObserver(callback);
    const observerOptions = {
      childList: options.childList !== false,
      subtree: options.subtree !== false,
      characterData: options.characterData === true,
      attributes: options.attributes === true
    };
    if (options.attributeFilter) observerOptions.attributeFilter = options.attributeFilter;
    scopedObserver.observe(target, observerOptions);
    scopedObservers.add(scopedObserver);

    return () => {
      if (!scopedObservers.delete(scopedObserver)) return;
      scopedObserver.disconnect();
    };
  }

  function onNodesAdded(callback) {
    if (typeof callback !== "function") {
      throw new TypeError("A DOM addition subscription requires a callback.");
    }

    addedNodeListeners.add(callback);
    startObserving();

    return () => {
      addedNodeListeners.delete(callback);
      stopIfUnused();
    };
  }

  return { subscribe, onNodesAdded, observe, destroy };
}
