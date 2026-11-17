import { useId, type ReactNode } from "react";

interface TodoSectionProps {
  title: string;
  children: ReactNode;
}

export function TodoSection({ title, children }: TodoSectionProps) {
  const headingId = useId();

  return (
    <section aria-labelledby={headingId} className="mb-8 last:mb-0">
      <h2 id={headingId} className="text-lg font-semibold mb-3 text-gray-700">
        {title}
      </h2>
      {children}
    </section>
  );
}
