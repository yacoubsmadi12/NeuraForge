export function Logo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--accent))" />
          <stop offset="100%" stopColor="hsl(var(--primary))" />
        </linearGradient>
      </defs>
      <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="url(#grad1)" />
      <path d="M2 17l10 5 10-5" stroke="url(#grad1)" />
      <path d="M2 12l10 5 10-5" stroke="url(#grad1)" />
    </svg>
  );
}
