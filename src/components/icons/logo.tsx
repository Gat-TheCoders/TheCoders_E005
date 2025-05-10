
import type { SVGProps } from 'react';

export function FinanceForwardLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 180 50" // Adjusted viewBox width for "Own Finance"
      width="108" // Adjusted width for "Own Finance" to maintain aspect ratio with height 30
      height="30"
      aria-label="Own Finance Logo"
      {...props}
    >
      <defs>
        <linearGradient id="logoGradient" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="360" y2="0"> {/* Gradient width x2 of viewBox */}
          <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 1 }} />
          <stop offset="25%" style={{ stopColor: 'hsl(var(--accent))', stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 1 }} />
          <stop offset="75%" style={{ stopColor: 'hsl(var(--accent))', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 1 }} />
          
          <animateTransform
            attributeName="gradientTransform"
            type="translate"
            values="0 0; -180 0; 0 0" // Translate by negative viewBox width
            dur="3s"
            repeatCount="indefinite"
          />
        </linearGradient>
      </defs>
      <text
        x="0"
        y="35"
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

