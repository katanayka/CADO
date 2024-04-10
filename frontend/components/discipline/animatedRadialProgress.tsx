import { useEffect, useRef } from 'react';

const AnimatedRadialProgress = ({ value }: { value: number }) => {
  const prevValueRef = useRef(value);

  useEffect(() => {
    prevValueRef.current = value;
  });

  const prevValue = prevValueRef.current;
  const strokeDashoffset = ((100 - value) / 100) * 2 * Math.PI * 45;
  const prevStrokeDashoffset = ((100 - prevValue) / 100) * 2 * Math.PI * 45;

  return (
    <svg className="progress-ring" width="120" height="120">
      <circle className="progress-ring__circle" stroke="blue" strokeWidth="8" fill="transparent" r="45" cx="60" cy="60" style={{
        strokeDasharray: `${2 * Math.PI * 45} ${2 * Math.PI * 45}`,
        strokeDashoffset: strokeDashoffset,
        transition: `stroke-dashoffset 0.3s ease-in-out`,
        transitionDelay: `${prevStrokeDashoffset === strokeDashoffset ? '0s' : '0.1s'}`,
      }} />
      <text x="50%" y="50%" textAnchor="middle" fill="blue" dy=".3em" fontSize="20px">{value}%</text>
    </svg>
  );
};

export default AnimatedRadialProgress;