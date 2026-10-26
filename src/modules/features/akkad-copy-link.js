(function () {
  function addCopyButton() {
    var panel = document.querySelector('div[id^="headlessui-popover-panel"]');
    if (!panel) return;

    var container = panel.querySelector('.flex.gap-3');
    if (!container) return;
    if (container.querySelector('.akkad-copy')) return;

    var copy = document.createElement("a");
    copy.href = "#";
    copy.className = "flex items-center gap-3 akkad-copy";
    copy.innerHTML = '<i class="fa-solid fa-link h-6 w-6"></i>';

    copy.onclick = function (e) {
      e.preventDefault();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(location.href)
          .then(function () {
            copy.style.color = "#16a34a";
            setTimeout(function () {
              copy.style.color = "";
            }, 1500);
          })
          .catch(function (err) {
            console.error("Clipboard copy failed:", err);
          });
      } else {
        // Fallback for older browsers
        var textarea = document.createElement("textarea");
        textarea.value = location.href;
        textarea.style.position = "fixed";
        document.body.appendChild(textarea);
        textarea.select();
        try {
          document.execCommand("copy");
          copy.style.color = "#16a34a";
          setTimeout(function () {
            copy.style.color = "";
          }, 1500);
        } catch (err) {
          console.error("Fallback copy failed:", err);
        }
        document.body.removeChild(textarea);
      }
    };

    container.appendChild(copy);
  }

    // 8. addCopyButton Execution
    var copyBtnObserver = null;
    var copyBtnTimer = null;

    function syncCopyLinkRoute() {
      if (window.location.pathname.indexOf("/products/") !== 0) {
        if (copyBtnObserver) copyBtnObserver.disconnect();
        copyBtnObserver = null;
        clearTimeout(copyBtnTimer);
        copyBtnTimer = null;
        return;
      }

      addCopyButton();
      if (copyBtnObserver || !document.body) return;

      copyBtnObserver = new MutationObserver(function () {
        clearTimeout(copyBtnTimer);
        copyBtnTimer = setTimeout(addCopyButton, 100);
      });
      copyBtnObserver.observe(document.body, { childList: true, subtree: true });
    }

    window.addEventListener("akkad:route-change", syncCopyLinkRoute);
    syncCopyLinkRoute();
})();
