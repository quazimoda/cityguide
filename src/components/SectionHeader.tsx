export function SectionHeader({ eyebrow, title, description }: { eyebrow?: string; title: string; description: string }) {
  return (
    <div className="mb-8 max-w-3xl">
      {eyebrow ? <p className="mb-2 text-sm font-black uppercase tracking-[0.22em] text-orange-500">{eyebrow}</p> : null}
      <h2 className="text-3xl font-black tracking-tight text-current md:text-4xl">{title}</h2>
      <p className="mt-3 max-w-2xl text-base leading-7 text-current/70">{description}</p>
    </div>
  );
}
