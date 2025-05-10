
import type { SVGProps } from 'react';

export function FinanceForwardLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 220 55" // Adjusted viewBox for more space, maintains aspect ratio of 4 with height 55
      width="120" // Maintained width
      height="30" // Maintained height (120 / (220/55) = 30)
      aria-label="Own Finance Logo"
      {...props}
    >
      <defs>
        <linearGradient id="logoGradient" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="440" y2="0"> {/* x2 = 2 * new viewBox width */}
          <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 1 }} />
          <stop offset="25%" style={{ stopColor: 'hsl(var(--accent))', stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 1 }} />
          <stop offset="75%" style={{ stopColor: 'hsl(var(--accent))', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 1 }} />
          
          <animateTransform
            attributeName="gradientTransform"
            type="translate"
            values="0 0; -220 0" // animation value = new viewBox width
            dur="3s"
            repeatCount="indefinite"
          />
        </linearGradient>
      </defs>
      <g fill="url(#logoGradient)">
        <text
          x="110" // Centered in the new viewBox width
          y="27.5" // Centered in the new viewBox height
          dominantBaseline="middle"
          textAnchor="middle"
          fontFamily="var(--font-geist-sans), Arial, sans-serif"
          fontSize="30" // Kept font size
          fontWeight="600" // Kept semibold for a sleek look
        >
          Own Finance
        </text>
        {/* Removed the small decorative circle for a cleaner design */}
      </g>
    </svg>
  );
}

