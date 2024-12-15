/**
 * Generates a radial path of thickness T,
 * offset by half from the center of the radius R
 */
export function generateRadialSVG(
  radius: number,
  startDegree: number,
  endDegree: number,
  x: number,
  y: number,
  thickness: number
): SVGElement {
  // Convert degrees to radians
  const startAngle = (startDegree * Math.PI) / 180;
  const endAngle = (endDegree * Math.PI) / 180;

  // Adjust radii for thickness T
  const R1 = radius + thickness / 2; // Outer radius
  const R2 = radius - thickness / 2; // Inner radius

  // Calculate the control points for the quadratic bezier curves that will approximate the arc with thickness
  const dx1 = R1 * Math.cos(startAngle);
  const dy1 = R1 * Math.sin(startAngle);
  const dx2 = R2 * Math.cos(endAngle);
  const dy2 = R2 * Math.sin(endAngle);

  // Create the SVG radial gradient path with thickness T
  const svgPath = `M ${x + dx1},${y + dy1} Q ${
    x + ((R1 + R2) / 2) * Math.cos((startAngle + endAngle) / 2)
  },${y + ((R1 + R2) / 2) * Math.sin((startAngle + endAngle) / 2)} ${x + dx2},${
    y + dy2
  } A ${R2} ${R2} 0 0 1 ${x + R2 * Math.cos(endAngle)},${
    y + R2 * Math.sin(endAngle)
  }`;

  const svgContainer = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );
  svgContainer.innerHTML = `<path d="${svgPath}" stroke="black" fill="none" stroke-width="${thickness}"/>`;

  return svgContainer;
}
