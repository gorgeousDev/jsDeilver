const COUNTER_ID = "akkad-floating-counter";

const COUNTER_CSS = `
#${COUNTER_ID}{position:fixed;left:20px;bottom:20px;z-index:99999;display:flex;align-items:center;gap:10px;width:270px;height:54px;padding:0 16px;background:#44174E;color:#fff;border-radius:999px;box-sizing:border-box;font-size:14px;font-weight:600;white-space:nowrap}
#${COUNTER_ID} .text{flex:1;display:flex;align-items:center;justify-content:center;gap:5px;overflow:hidden}
#${COUNTER_ID} b{flex:0 0 48px;text-align:center;color:#7dd3fc;font-size:18px;font-weight:700}
#${COUNTER_ID} .live-dot{flex-shrink:0;width:10px;height:10px;border-radius:50%;background:#22c55e;animation:akkad-live-pulse 1.5s infinite}
@keyframes akkad-live-pulse{0%{transform:scale(1);box-shadow:0 0 0 0 rgba(34,197,94,.7)}70%{transform:scale(1.15);box-shadow:0 0 0 10px rgba(34,197,94,0)}100%{transform:scale(1);box-shadow:0 0 0 0 rgba(34,197,94,0)}}
@media(max-width:768px){#${COUNTER_ID}{left:12px;bottom:20px;width:245px;height:48px;font-size:12px}#${COUNTER_ID} b{flex-basis:44px;font-size:16px}}
`;

export function initFloatingLiveCounter({ document, navigation, styles, window }) {
  let timer = 0;
  let counter = null;
  const removeStyle = styles.add("akkad-v2-live-counter-css", COUNTER_CSS);

  function onHome(pathname = window.location.pathname) {
    return pathname.replace(/\/+$/, "") === "";
  }

  function formatNumber(value) {
    if (value >= 1000) return `${(value / 1000).toFixed(1).replace(/\.0$/, "")}K`;
    return String(value);
  }

  function update() {
    if (!counter?.isConnected || !onHome()) return;
    const number = counter.querySelector("b");
    if (number) number.textContent = formatNumber(Math.floor(Math.random() * 5000) + 1);
    timer = window.setTimeout(update, Math.random() * 5000 + 3000);
  }

  function removeCounter() {
    window.clearTimeout(timer);
    timer = 0;
    counter?.remove();
    counter = null;
  }

  function sync({ pathname }) {
    if (!onHome(pathname)) {
      removeCounter();
      return;
    }
    if (counter?.isConnected || !document.body) return;
    counter = document.createElement("div");
    counter.id = COUNTER_ID;
    counter.innerHTML = '<span class="live-dot" aria-hidden="true"></span><span class="text"><b>42</b>عميل يشاهد هذه الصفحة</span>';
    document.body.appendChild(counter);
    update();
  }

  const stopNavigation = navigation.subscribe(sync);
  return () => {
    stopNavigation();
    removeCounter();
    removeStyle();
  };
}
