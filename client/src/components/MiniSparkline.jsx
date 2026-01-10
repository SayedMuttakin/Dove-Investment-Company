import React from 'react';

const MiniSparkline = ({ data }) => {
    if (!data || data.length === 0) return null;

    const width = 60;
    const height = 24;
    const padding = 2;

    // Find min and max values for scaling
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    // Create SVG path
    const points = data.map((value, index) => {
        const x = (index / (data.length - 1)) * (width - 2 * padding) + padding;
        const y = height - padding - ((value - min) / range) * (height - 2 * padding);
        return `${x},${y}`;
    });

    const pathData = `M ${points.join(' L ')}`;

    // Determine if trend is positive or negative
    const isPositive = data[data.length - 1] >= data[0];
    const color = isPositive ? '#10b981' : '#ef4444'; // green or red

    return (
        <svg width={width} height={height} className="inline-block">
            <path
                d={pathData}
                fill="none"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

export default MiniSparkline;
