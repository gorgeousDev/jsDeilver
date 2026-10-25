export function parseRgb(value) {
  const channels = (value || "").match(/[\d.]+/g);
  if (!channels || channels.length < 3 || Number(channels[3]) === 0) return null;
  return channels.slice(0, 3).map(Number);
}

export function luminance([red, green, blue]) {
  const linearize = (channel) => {
    const normalized = channel / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  };

  return 0.2126 * linearize(red) +
    0.7152 * linearize(green) +
    0.0722 * linearize(blue);
}

export function contrastRatio(foreground, background) {
  const foregroundLuminance = luminance(foreground);
  const backgroundLuminance = luminance(background);
  return (Math.max(foregroundLuminance, backgroundLuminance) + 0.05) /
    (Math.min(foregroundLuminance, backgroundLuminance) + 0.05);
}

export function closestPaintedBackground(element, window) {
  for (let current = element; current && current.nodeType === 1; current = current.parentElement) {
    const color = parseRgb(window.getComputedStyle(current).backgroundColor);
    if (color) return color;
  }
  return [255, 255, 255];
}

export function hasOwnText(element) {
  return [...element.childNodes].some((node) =>
    node.nodeType === 3 && node.nodeValue.trim()
  );
}

export function isNeutralColor(color) {
  return Math.max(...color) - Math.min(...color) < 26;
}
