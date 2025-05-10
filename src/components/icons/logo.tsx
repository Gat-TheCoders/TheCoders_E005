import type { SVGProps } from 'react';

export function FinanceForwardLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 50" // Assuming text "FinanceForward" fits well within this width at fontSize 30
      width="120" // This is the display width; viewBox handles internal coordinates
      height="30"
      aria-label="FinanceForward Logo"
      {...props}
    >
      <defs>
        {/* 
          The gradient is defined to be wider than the text.
          Text is roughly 0-200 units wide in the viewBox.
          We define a 400-unit wide gradient (x2="400").
          The pattern P-A-P (Primary-Accent-Primary) spans 200 units.
          This P-A-P pattern is repeated twice in the 400-unit gradient.
          Animating the translation by -200 units makes the gradient appear to flow.
        */}
        <linearGradient id="logoGradient" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="400" y2="0">
          <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 1 }} />
          <stop offset="25%" style={{ stopColor: 'hsl(var(--accent))', stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 1 }} />
          {/* This second P-A-P segment ensures seamless looping when translating by -200 units */}
          <stop offset="75%" style={{ stopColor: 'hsl(var(--accent))', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 1 }} />
          
          <animateTransform
            attributeName="gradientTransform"
            type="translate"
            values="0 0; -200 0; 0 0" // Keyframes: start, shifted, back to start for smooth loop
            dur="3s" // Duration for one cycle of the flow
            repeatCount="indefinite" // Loop indefinitely
          />
        </linearGradient>
      </defs>
      <text
        x="0" // Position of the text. Adjust if needed for centering.
        y="35" // Baseline for the text.
        fontFamily="var(--font-geist-sans), Arial, sans-serif" // Use GeistSans defined globally
        fontSize="30" // Font size
        fontWeight="bold"
        fill="url(#logoGradient)" // Apply the animated gradient
      >
        FinanceForward
      </text>
    </svg>
  );
}
