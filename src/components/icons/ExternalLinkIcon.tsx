interface ExternalLinkIconProps {
  className?: string;
}

export function ExternalLinkIcon({ className = "h-3.5 w-3.5" }: ExternalLinkIconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M9 2.5h4.5V7" />
      <path d="m13.25 2.75-5.75 5.75" />
      <path d="M13.5 9.5v3a1 1 0 0 1-1 1h-9a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1h3" />
    </svg>
  );
}
