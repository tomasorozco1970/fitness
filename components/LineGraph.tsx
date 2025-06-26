
import React from 'react';

interface DataPoint {
  x: number; // Timestamp or index
  y: number;
  originalDate: string; // YYYY-MM-DD for tooltip/label
}

interface LineGraphProps {
  data: DataPoint[];
  title: string;
  color?: string;
  yLabel?: string;
  width?: number;
  height?: number;
  yTickCount?: number;
}

const LineGraph: React.FC<LineGraphProps> = ({
  data,
  title,
  color = 'rgb(20 184 166)', // teal-500
  yLabel = '',
  width = 300,
  height = 180,
  yTickCount = 5,
}) => {
  if (!data || data.length < 2) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg text-center text-gray-500 h-[220px] flex flex-col justify-center items-center border border-gray-200">
        <h4 className="text-md font-semibold text-teal-600 mb-2">{title}</h4>
        <p className="text-sm">No hay suficientes datos para la gráfica.</p>
        <p className="text-xs mt-1">Necesitas al menos 2 mediciones.</p>
      </div>
    );
  }

  const padding = { top: 10, right: 10, bottom: 40, left: 35 };
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  const yMin = Math.min(...data.map(p => p.y));
  const yMax = Math.max(...data.map(p => p.y));
  const xMin = 0;
  const xMax = data.length - 1;

  const yRange = yMax - yMin === 0 ? 1 : yMax - yMin;

  const getX = (index: number) => (index / xMax) * graphWidth;
  const getY = (value: number) => graphHeight - ((value - yMin) / yRange) * graphHeight;

  const pathD = data
    .map((point, i) => {
      const xPos = getX(i);
      const yPos = getY(point.y);
      return `${i === 0 ? 'M' : 'L'} ${xPos},${yPos}`;
    })
    .join(' ');

  const yTicks = [];
  if (yRange > 0) {
    const tickIncrement = yRange / yTickCount;
    for (let i = 0; i <= yTickCount; i++) {
        const val = yMin + tickIncrement * i;
        yTicks.push({
            value: val.toFixed(val % 1 !== 0 ? 1 : 0), // No decimal for whole numbers
            yPos: getY(val),
        });
    }
  }


  const xTickInterval = Math.max(1, Math.floor(data.length / 4));

  return (
    <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
      <h4 className="text-md font-semibold text-teal-600 mb-2 text-center">{title}</h4>
      <svg viewBox={`0 0 ${width} ${height}`} role="figure" aria-labelledby={`graph-title-${title.replace(/\s+/g, '-')}`}>
        <title id={`graph-title-${title.replace(/\s+/g, '-')}`}>{title}</title>
        <g transform={`translate(${padding.left}, ${padding.top})`}>
          {/* Y Axis Grid Lines & Labels */}
          {yTicks.map(tick => (
            <g key={`y-tick-${tick.value}`}>
              <line
                x1={0}
                y1={tick.yPos}
                x2={graphWidth}
                y2={tick.yPos}
                stroke="rgba(229, 231, 235, 1)" // gray-200
                strokeDasharray="2,3"
              />
              <text
                x={-5}
                y={tick.yPos + 3}
                textAnchor="end"
                fontSize="9"
                fill="rgb(107, 114, 128)" // gray-500
              >
                {tick.value}
              </text>
            </g>
          ))}

          {/* X Axis Labels (Dates) */}
          {data.map((point, i) => {
            if (i !== 0 && i !== data.length - 1 && i % xTickInterval !== 0) return null;
            const xPos = getX(i);
            const dateObj = new Date(point.originalDate + 'T00:00:00');
            const formattedDate = dateObj.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
            return (
               <text
                key={`x-label-${i}`}
                x={xPos}
                y={graphHeight + 15}
                textAnchor="middle"
                fontSize="9"
                fill="rgb(107, 114, 128)" // gray-500
              >
                {formattedDate}
              </text>
            );
          })}
           <text
                x={graphWidth / 2}
                y={graphHeight + 32}
                textAnchor="middle"
                fontSize="10"
                fontWeight="500"
                fill="rgb(107, 114, 128)" // gray-500
            >
                Fecha
            </text>


          {/* Y Axis Line */}
          <line x1={0} y1={0} x2={0} y2={graphHeight} stroke="rgb(209, 213, 219)" /> 
          {/* X Axis Line */}
          <line x1={0} y1={graphHeight} x2={graphWidth} y2={graphHeight} stroke="rgb(209, 213, 219)" />


          {/* Data Path */}
          <path d={pathD} fill="none" stroke={color} strokeWidth="2.5" />

          {/* Data Points */}
          {data.map((point, i) => (
            <circle
              key={`point-${i}`}
              cx={getX(i)}
              cy={getY(point.y)}
              r="3.5"
              fill={color}
              stroke="rgb(249 250 251)" // bg-gray-50
              strokeWidth="1.5"
            >
              <title>{`Fecha: ${new Date(point.originalDate+'T00:00:00').toLocaleDateString('es-ES')}, Valor: ${point.y.toFixed(1)}${yLabel.includes('%') ? '%' : 'kg'}`}</title>
            </circle>
          ))}

          {/* Y Axis Label */}
          {yLabel && (
             <text
                transform={`translate(${-padding.left + 12}, ${graphHeight / 2}) rotate(-90)`}
                textAnchor="middle"
                fontSize="10"
                fontWeight="500"
                fill="rgb(107, 114, 128)" // gray-500
             >
                {yLabel}
             </text>
          )}
        </g>
      </svg>
    </div>
  );
};

export default LineGraph;