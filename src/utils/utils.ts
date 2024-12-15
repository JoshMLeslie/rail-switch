/**
 * (x - h)² + (y - k)² = r²
 * where the circle is at center [h, k] and has a radius r.
 */

/**
 * where the raw .offsetXY coords are
 *   -y
 * -x   x
 *    y
 */
const CSS_TARGET_OFFSET = 8;
export const moveInRadiusBoundary = (
  element: HTMLElement,
  event: MouseEvent,
  outerRadius: number,
  boundaryWidth = 8 // subtractive width, in px
) => {
  if (outerRadius === 0 || boundaryWidth === 0) {
    throw ReferenceError("Radius must be non-zero");
  }
  const parentEl = element.parentElement.getBoundingClientRect();

  const zeroY = parentEl.height;
  const zeroX = parentEl.width / 2;

  const { x, y } = { x: event.offsetX, y: event.offsetY };
  const testY = y - zeroY; // y is negative.... because it works.
  const testX = x - zeroX;

  const deltaRads = Math.atan2(testY, testX);
  const quarterOffset = Math.PI / 2;

  const withinBBox =
    testY < -CSS_TARGET_OFFSET && testY > -zeroY && testX > -zeroX && testX < zeroX;

  if (withinBBox) {
    element.style.transform = `rotate(${deltaRads + quarterOffset}rad`;
  }
};
