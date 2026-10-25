export function createDomObserver(document, window) {
  // One observer serves every subscriber; each subscription has its own
  // selector and callback, while the core owns the shared observer lifecycle.
  const subscriptions = new Set();
  let observer = null;
  let observedRoot = null;

  function notify(subscription, node) {
    // Mutation records include text nodes. Selectors apply only to elements.
    if (node.nodeType !== 1) return;

    // Check the added node itself as well as descendants. A newly inserted
    // <video> won't be returned by querying inside that video node.
    if (node.matches(subscription.selector)) {
      subscription.onElement(node);
    }

    for (const element of node.querySelectorAll(subscription.selector)) {
      subscription.onElement(element);
    }
  }

  function notifyTree(node) {
    for (const subscription of subscriptions) {
      notify(subscription, node);
    }
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
          }
        }
      });
    } else {
      observer.disconnect();
    }

    observedRoot = root;
    observer.observe(root, { childList: true, subtree: true });
    notifyTree(root);
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
      if (subscriptions.size === 0 && observer) {
        observer.disconnect();
        observedRoot = null;
      }
    };
  }

  function destroy() {
    subscriptions.clear();
    if (observer) observer.disconnect();
    observer = null;
    observedRoot = null;
  }

  return { subscribe, destroy };
}
