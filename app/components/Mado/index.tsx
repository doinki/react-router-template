import { forwardRef, type SVGProps } from 'react';

export const Mado = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(
  (props, ref) => {
    return (
      <svg
        ref={ref}
        fill="white"
        height="32"
        stroke="black"
        viewBox="0 0 24 24"
        width="32"
        aria-hidden
        {...props}
      >
        <polygon
          points="4,5 2,7 14,7 16,5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="0.4"
        />
        <polygon
          points="2,7 2,13 14,13 14,7"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="0.4"
        />
        <polygon
          points="14,7 14,13 16,11 16,5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="0.4"
        />
        <polygon
          points="16,11 14,13 20,13 22,11"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="0.4"
        />
        <polygon
          points="8,13 8,19 20,19 20,13"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="0.4"
        />
        <polygon
          points="20,13 20,19 22,17 22,11"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="0.4"
        />
      </svg>
    );
  },
);

Mado.displayName = 'Mado';
