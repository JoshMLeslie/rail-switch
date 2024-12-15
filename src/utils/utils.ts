/**
 * (x - h)² + (y - k)² = r²
 * where the circle is at center [h, k] and has a radius r.
 */

const CSS_TARGET_OFFSET = 8;
/**
 * ! el should be immediate child of its bounding-box container !
 * 
 * where the raw .offsetXY coords are
 *   -y
 * -x   x
 *    y
 */
export const moveInRadiusBoundary = (
  el: HTMLElement,
  event: MouseEvent
) => {
  const containerEl = el.parentElement.getBoundingClientRect();

  const zeroY = containerEl.height;
  const zeroX = containerEl.width / 2;

  const { x, y } = { x: event.offsetX, y: event.offsetY };
  const testY = y - zeroY; // y is negative.... because it works.
  const testX = x - zeroX;

  const deltaRads = Math.atan2(testY, testX);
  const quarterOffset = Math.PI / 2; // more coordinate mapping nonsense
  const useRads = deltaRads + quarterOffset;

  const withinBBox =
    testY < -CSS_TARGET_OFFSET &&
    testY > -zeroY &&
    testX > -zeroX &&
    testX < zeroX;

  if (withinBBox) {
    el.style.transform = `rotate(${useRads}rad`;
  }
};

export const isOnTarget = (test: HTMLElement, target: HTMLElement): boolean => {
  const testRect = test.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();

  const centerX = (testRect.left + testRect.right) / 2;
  const centerY = (testRect.top + testRect.bottom) / 2;

  const xWithinTarget =
    centerX >= targetRect.left && centerX <= targetRect.right;
  const yWithinTarget =
    centerY >= targetRect.top && centerY <= targetRect.bottom;

  return xWithinTarget && yWithinTarget;
};
