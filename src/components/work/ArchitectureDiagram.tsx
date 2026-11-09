import type { CaseStudy } from "@/content/types";

/**
 * Layered architecture diagram rendered as semantic HTML (not an image), so it
 * is readable by screen readers, scales on mobile and prints cleanly.
 */
export function ArchitectureDiagram({ name, architecture }: { name: string; architecture: CaseStudy["architecture"] }) {
  return (
    <figure className="reveal" aria-labelledby="architecture-caption">
      <ol className="border border-line-strong">
        {architecture.layers.map((layer, index) => (
          <li key={layer.name} className="relative grid gap-3 border-t border-line p-4 first:border-t-0 sm:grid-cols-[11rem_1fr] sm:gap-6 sm:p-5">
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-xs text-subtle" aria-hidden="true">
                L{index + 1}
              </span>
              <p className="font-mono text-[0.78rem] uppercase tracking-[0.08em]">{layer.name}</p>
            </div>
            <ul className="flex flex-wrap gap-2" aria-label={`${layer.name} components`}>
              {layer.components.map((component) => (
                <li key={component} className="border border-line-strong bg-bg px-2.5 py-1.5 text-sm leading-snug">
                  {component}
                </li>
              ))}
            </ul>
            {index < architecture.layers.length - 1 && (
              <span aria-hidden="true" className="absolute -bottom-2.5 left-1/2 z-10 hidden size-5 -translate-x-1/2 items-center justify-center bg-bg font-mono text-xs sm:flex">
                ↓
              </span>
            )}
          </li>
        ))}
      </ol>
      <figcaption id="architecture-caption" className="mt-3 text-sm text-subtle">
        {name} — system layers, top (clients) to bottom (data and networks).
      </figcaption>
    </figure>
  );
}

export function FlowSteps({ steps }: { steps: string[] }) {
  return (
    <ol className="grid border-l border-t border-line sm:grid-cols-2 lg:grid-cols-3">
      {steps.map((step, index) => (
        <li key={step} className="border-r border-b border-line p-5">
          <span className="font-mono text-xs text-subtle">Step {String(index + 1).padStart(2, "0")}</span>
          <p className="mt-2 text-[0.95rem] leading-relaxed">{step}</p>
        </li>
      ))}
    </ol>
  );
}
