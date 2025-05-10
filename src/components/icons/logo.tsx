
import type { SVGProps } from 'react';

export function FinanceForwardLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 180 50" // viewBox width kept at 180
      width="108" 
      height="30"
      aria-label="Own Finance Logo"
      {...props}
    >
      <defs>
        <linearGradient id="logoGradient" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="360" y2="0"> {/* Gradient width 2x of viewBox width */}
          <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 1 }} />
          <stop offset="25%" style={{ stopColor: 'hsl(var(--accent))', stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 1 }} />
          <stop offset="75%" style={{ stopColor: 'hsl(var(--accent))', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 1 }} />
          
          <animateTransform
            attributeName="gradientTransform"
            type="translate"
            values="0 0; -180 0" // Changed: continuous flow in one direction
            dur="3s"
            repeatCount="indefinite"
          />
        </linearGradient>
      </defs>
      <text
        x="90" // Center the text horizontally (viewBoxWidth / 2)
        y="35" // Baseline for the text
        textAnchor="middle" // Anchor the text from its middle point for centering
        fontFamily="var(--font-geist-sans), Arial, sans-serif"
        fontSize="30"
        fontWeight="bold"
        fill="url(#logoGradient)"
      >
        Own Finance
      </text>
    </svg>
  );
}

