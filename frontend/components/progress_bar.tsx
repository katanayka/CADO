import React from 'react'

type Props = {
  value: number;
}

export default function Progress_bar({ value }: Props) {
  return (
    <div className="relative progress-bar h-2 bg-gray-300 rounded-lg">
      {Array.from({ length: 5 }, (_, i) => (
        <div
          key={i}
          className="absolute h-2 w-px bg-white"
          style={{ left: `${(i + 1) * 20}%` }}
        />
      ))}
      <div className="progress-bar-fill h-2 bg-blue-500 rounded-lg" style={{ width: `${value}%` }}></div>
    </div>
  )
}