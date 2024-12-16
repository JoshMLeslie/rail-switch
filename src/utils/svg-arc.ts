/**
 * eg
 * 
    const svgBgRadius = generateRadialSVG(
      this.switchContainerRef.clientHeight *.75,
      -120,
      100,
      2,
      this.switchContainerRef.clientHeight,
      this.switchContainerRef.clientWidth
    );
    svgBgRadius.style.transformOrigin = "top left";
    svgBgRadius.style.transform = `translate(${
      this.switchContainerRef.clientWidth * 0.75
    }px, ${this.switchContainerRef.clientHeight * 2}px) rotate(-120deg)`;

    this.switchContainerRef.appendChild(svgBgRadius);
 */

/**
 * Generates a radial path of thickness T,
 * offset by half from the center of the radius R
 */
export function generateRadialSVG(
  radius: number,
  startDegree: number,
  endDegree: number,
  thickness: number,
  containerHeight: number,
  containerWidth: number
): SVGElement {
  // SVG Path params
  // "A rx ry x-axis-rotation large-arc-flag sweep-flag x y"
  // where rx and ry are the radii of the ellipse
  // and x y are the terminus of the ellipse

  // Convert degrees to radians
  const startRadian = (startDegree * Math.PI) / 180;
  const endRadian = (endDegree * Math.PI) / 180;

  // Calculate the coords for the curve
  const startX = radius * Math.cos(startRadian) + containerWidth / 2;
  const startY = radius * Math.sin(startRadian);
  const endX = radius * Math.cos(endRadian) + containerWidth / 2;
  const endY = radius * Math.sin(endRadian);

  const xAxisRotation = 30;
  const largeArcFlag = endDegree - startDegree >= 180 ? 1 : 0;
  const sweepFlag = 1;

  const pathEl = document.createElementNS("http://www.w3.org/2000/svg", "path");
  const startingPoint = `M ${startX} ${startY}`;
  const pathData =
    "A " +
    [startX, startY, xAxisRotation, largeArcFlag, sweepFlag, endX, endY].join(
      " "
    );
  pathEl.setAttribute("d", startingPoint + " " + pathData);
  pathEl.setAttribute("stroke", "black");
  pathEl.setAttribute("fill", "none");
  pathEl.setAttribute("stroke-width", thickness.toString());

  const svgContainer = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );
  svgContainer.style.height = containerHeight + "px";
  svgContainer.style.width = containerWidth + "px";
  svgContainer.style.zIndex = "100";

  svgContainer.appendChild(pathEl);

  return svgContainer;
}
