import Link from 'next/link';

const internalMarkdownLinkPattern = /\[([^\]]+)\]\((\/[^)\s]+)\)/g;

export function ArticleParagraph({ text }: { text: string }) {
  const parts: Array<string | { label: string; href: string }> = [];
  let lastIndex = 0;

  for (const match of text.matchAll(internalMarkdownLinkPattern)) {
    const [fullMatch, label, href] = match;
    const index = match.index ?? 0;

    if (index > lastIndex) {
      parts.push(text.slice(lastIndex, index));
    }

    parts.push({ label, href });
    lastIndex = index + fullMatch.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return (
    <p>
      {parts.map((part, index) =>
        typeof part === 'string' ? (
          part
        ) : (
          <Link key={`${part.href}-${index}`} href={part.href}>
            {part.label}
          </Link>
        ),
      )}
    </p>
  );
}
