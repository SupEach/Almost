const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

function pathData(shape) {
  if (shape.localName === 'path') return shape.getAttribute('d');
  if (shape.localName === 'polygon') return `M ${shape.getAttribute('points')} Z`;

  const [x, y, width, height] = ['x', 'y', 'width', 'height'].map(name => Number(shape.getAttribute(name)));
  return `M ${x} ${y} h ${width} v ${height} h ${-width} Z`;
}

export async function loadTechTextArtwork(url, signal) {
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error('Could not load wordmark artwork');

  const source = new DOMParser().parseFromString(await response.text(), 'image/svg+xml').documentElement;
  const [x, y, width, height] = (source.getAttribute('viewBox') ?? '').trim().split(/[\s,]+/).map(Number);
  if (source.localName !== 'svg' || !(width > 0 && height > 0)) throw new Error('Invalid wordmark viewBox');

  // Measure only geometry from the flat SVG. The original document is never inserted into the page.
  const measurement = document.createElementNS(SVG_NAMESPACE, 'svg');
  measurement.setAttribute('width', '0');
  measurement.setAttribute('height', '0');
  measurement.style.position = 'absolute';
  measurement.setAttribute('aria-hidden', 'true');
  document.body.append(measurement);

  try {
    const shapes = Array.from(source.children)
      .filter(shape => ['path', 'polygon', 'rect'].includes(shape.localName))
      .map(shape => {
        const data = pathData(shape);
        const path = document.createElementNS(SVG_NAMESPACE, 'path');
        path.setAttribute('d', data);
        measurement.append(path);
        // In the studio SVG, each glyph starts with its outer contour, followed by any counters.
        const [outerContour] = data.split(/(?=[Mm])/).filter(part => part.trim());
        return { bounds: path.getBBox(), outline: new Path2D(data), contour: new Path2D(outerContour) };
      })
      .sort((a, b) => a.bounds.x - b.bounds.x);
    return { x, y, width, height, shapes };
  } finally {
    measurement.remove();
  }
}
