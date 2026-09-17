import type { ContentSection } from '@/types/content';
import { ArticleParagraph } from './ArticleParagraph';

export function ArticleSectionContent({ section }: { section: ContentSection }) {
  if (!section.content) {
    return section.body?.map((paragraph) => (
      <ArticleParagraph key={paragraph} text={paragraph} />
    ));
  }

  return section.content.map((block, index) => {
    if (block.type === 'paragraph') {
      return <ArticleParagraph key={`${block.type}-${index}`} text={block.text} />;
    }

    if (block.type === 'list') {
      const List = block.ordered ? 'ol' : 'ul';
      return (
        <List key={`${block.type}-${index}`}>
          {block.items.map((item) => (
            <li key={item}><ArticleParagraph text={item} /></li>
          ))}
        </List>
      );
    }

    return (
      <div className="article-table" key={`${block.type}-${index}`}>
        <table>
          <thead><tr>{block.headers.map((header) => <th key={header} scope="col">{header}</th>)}</tr></thead>
          <tbody>
            {block.rows.map((row) => (
              <tr key={row.join('|')}>{row.map((cell, cellIndex) => <td key={`${cell}-${cellIndex}`}>{cell}</td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  });
}
