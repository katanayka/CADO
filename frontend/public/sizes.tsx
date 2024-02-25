type ElementType = 'Rewritable' | 'VideoNode';

const getElementSize = (type: ElementType) => {
  const sizes = {
    Rewritable: { width: 256, height: 256 },
    VideoNode: { width: 200, height: 200 },
  };

  return sizes[type] || { width: 100, height: 100 };
}


export { getElementSize };
export type { ElementType };
