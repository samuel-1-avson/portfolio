import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

export function Container({ className = "", children }: { className?: string; children: ReactNode }) {
  return <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`label ${className}`}>{children}</p>;
}

type SectionHeadingProps = {
  index?: string;
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  id?: string;
};

/** Numbered section header: "01 — Selected work" eyebrow, large title, optional action. */
export function SectionHeading({ index, eyebrow, title, description, action, id }: SectionHeadingProps) {
  return (
    <div className="flex flex-col gap-6 border-t border-line-strong pt-6 md:flex-row md:items-end md:justify-between">
      <div className="max-w-3xl">
        <p className="label">
          {index && <span className="mr-3 text-fg">{index}</span>}
          {eyebrow}
        </p>
        <h2 id={id} className="mt-4 text-title font-semibold">
          {title}
        </h2>
        {description && <p className="mt-4 max-w-2xl text-muted">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

const buttonBase =
  "group inline-flex min-h-11 items-center justify-center gap-2 px-5 text-[0.95rem] font-medium transition-colors duration-200 focus-visible:outline-offset-4";

const buttonVariants = {
  primary: "bg-fg text-bg hover:bg-muted",
  secondary: "border border-line-strong text-fg hover:bg-fg hover:text-bg",
  ghost: "text-fg underline-offset-4 hover:underline",
} as const;

type ButtonVariant = keyof typeof buttonVariants;

export function ButtonLink({
  href,
  variant = "primary",
  external,
  children,
  className = "",
  ...rest
}: { href: string; variant?: ButtonVariant; external?: boolean; children: ReactNode; className?: string } & Omit<ComponentProps<"a">, "href">) {
  const classes = `${buttonBase} ${buttonVariants[variant]} ${className}`;
  if (external || href.startsWith("http") || href.startsWith("mailto:") || href.endsWith(".pdf")) {
    const isHttp = href.startsWith("http");
    return (
      <a href={href} className={classes} {...(isHttp ? { target: "_blank", rel: "noopener noreferrer" } : {})} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes} {...rest}>
      {children}
    </Link>
  );
}

export function buttonClasses(variant: ButtonVariant = "primary", className = "") {
  return `${buttonBase} ${buttonVariants[variant]} ${className}`;
}

export function Tag({ children }: { children: ReactNode }) {
  return <span className="inline-flex items-center border border-line px-2 py-0.5 font-mono text-[0.72rem] leading-5 text-muted">{children}</span>;
}

export function TagList({ items, max, label }: { items: string[]; max?: number; label?: string }) {
  const visible = max ? items.slice(0, max) : items;
  const hidden = items.length - visible.length;
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label={label}>
      {visible.map((item) => (
        <li key={item}>
          <Tag>{item}</Tag>
        </li>
      ))}
      {hidden > 0 && (
        <li>
          <Tag>+{hidden}</Tag>
        </li>
      )}
    </ul>
  );
}

/** Status shown as text with a square marker: filled for live/released, outlined otherwise. */
export function StatusLabel({ status, label, note }: { status: string; label: string; note?: string }) {
  const solid = status === "live" || status === "released";
  return (
    <span className="inline-flex items-center gap-2 font-mono text-[0.75rem] uppercase tracking-[0.08em] text-fg">
      <span aria-hidden="true" className={`inline-block size-2 border border-fg ${solid ? "bg-fg" : ""}`} />
      <span>{label}</span>
      {note && <span className="sr-only">: {note}</span>}
    </span>
  );
}

export function ArrowRight({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className={`arrow size-4 ${className}`} fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 8h11M9 4l4 4-4 4" strokeLinecap="square" />
    </svg>
  );
}

export function ArrowUpRight({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className={`arrow arrow-ne size-3.5 ${className}`} fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4.5 11.5l7-7M5.5 4.5h6v6" strokeLinecap="square" />
    </svg>
  );
}

export function DownloadIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className={`size-4 ${className}`} fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M8 2v8.5M4.5 7.5 8 11l3.5-3.5M2.5 13.5h11" strokeLinecap="square" />
    </svg>
  );
}

export function ExternalLink({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`group inline-flex items-center gap-1.5 ${className}`}>
      <span className="link">{children}</span>
      <ArrowUpRight />
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}
