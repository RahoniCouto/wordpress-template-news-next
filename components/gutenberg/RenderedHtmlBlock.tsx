import type { UnknownGutenbergBlock } from '@/lib/gutenberg';

type RenderedHtmlBlockProps = {
  block: UnknownGutenbergBlock;
};

export function RenderedHtmlBlock({ block }: RenderedHtmlBlockProps) {
  if (block.renderedHtml === null || block.renderedHtml.trim() === '') {
    return null;
  }

  return (
    <div
      data-gutenberg-rendered-html={block.name ?? block.__typename}
      dangerouslySetInnerHTML={{ __html: block.renderedHtml }}
    />
  );
}
