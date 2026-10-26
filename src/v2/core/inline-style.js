export function captureInlineProperties(element, properties) {
  return new Map(properties.map((property) => [
    property,
    {
      value: element.style.getPropertyValue(property),
      priority: element.style.getPropertyPriority(property)
    }
  ]));
}

export function restoreInlineProperties(element, snapshot) {
  for (const [property, original] of snapshot) {
    if (original.value) element.style.setProperty(property, original.value, original.priority);
    else element.style.removeProperty(property);
  }
}
