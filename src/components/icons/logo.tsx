
import type { SVGProps } from 'react';

export function FinanceForwardLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 50" // Adjusted viewBox for new design
      width="120" // Adjusted width: 108 * (200/180) = 120
      height="30" // Height remains 30, aspect ratio slightly changes (200/50 = 4, 120/30 = 4)
      aria-label="Own Finance Logo"
      {...props}
    >
      <defs>
        <linearGradient id="logoGradient" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="400" y2="0"> {/* x2 = 2 * new viewBox width */}
          <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 1 }} />
          <stop offset="25%" style={{ stopColor: 'hsl(var(--accent))', stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 1 }} />
          <stop offset="75%" style={{ stopColor: 'hsl(var(--accent))', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 1 }} />
          
          <animateTransform
            attributeName="gradientTransform"
            type="translate"
            values="0 0; -200 0" // animation value = new viewBox width
            dur="3s"
            repeatCount="indefinite"
          />
        </linearGradient>
      </defs>
      <g fill="url(#logoGradient)">
        <text
          x="92" // Adjusted x for centering text part before dot
          y="25" 
          dominantBaseline="middle"
          textAnchor="middle"
          fontFamily="var(--font-geist-sans), Arial, sans-serif"
          fontSize="30"
          fontWeight="600" // Changed from bold to semibold for a sleeker look
        >
          Own Finance
        </text>
        {/* Small decorative circle after the text */}
        <circle cx="188" cy="25" r="3.5" /> 
      </g>
    </svg>
  );
}
