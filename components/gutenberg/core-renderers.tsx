import type { ReactNode } from 'react';

import { getRichTextProps } from '@/components/gutenberg/RichText';
import { CmsImage } from '@/components/media/CmsImage';
import type { GutenbergTreeBlock } from '@/lib/gutenberg-tree';

type CoreBlockKind = Extract<GutenbergTreeBlock['kind'], `core/${string}`>;

type CoreBlockOfKind<TKind extends CoreBlockKind> = Extract<
  GutenbergTreeBlock,
  { kind: TKind }
>;

type CoreBlockProps<TKind extends CoreBlockKind> = {
  block: CoreBlockOfKind<TKind>;
};

type CoreContainerProps<TKind extends CoreBlockKind> = CoreBlockProps<TKind> & {
  children: ReactNode;
};

type CoreGroupTagName =
  | 'div'
  | 'section'
  | 'article'
  | 'main'
  | 'aside'
  | 'header'
  | 'footer'
  | 'nav';

type HtmlButtonType = 'button' | 'submit' | 'reset';

const HEADING_TAGS = {
  1: 'h1',
  2: 'h2',
  3: 'h3',
  4: 'h4',
  5: 'h5',
  6: 'h6',
} as const;

const GROUP_TAG_NAMES: ReadonlySet<string> = new Set<CoreGroupTagName>([
  'div',
  'section',
  'article',
  'main',
  'aside',
  'header',
  'footer',
  'nav',
]);

function normalizeGroupTagName(tagName: string): CoreGroupTagName {
  if (GROUP_TAG_NAMES.has(tagName)) {
    return tagName as CoreGroupTagName;
  }

  return 'div';
}

function normalizeButtonType(buttonType: string): HtmlButtonType {
  if (
    buttonType === 'button' ||
    buttonType === 'submit' ||
    buttonType === 'reset'
  ) {
    return buttonType;
  }

  return 'button';
}

function normalizeImageDimension(value: string | null): number | undefined {
  if (value === null) {
    return undefined;
  }

  const normalizedValue = value.trim().toLowerCase();

  if (!/^\d+(?:px)?$/.test(normalizedValue)) {
    return undefined;
  }

  const dimension = Number.parseInt(normalizedValue, 10);

  return Number.isSafeInteger(dimension) ? dimension : undefined;
}

function getLegacyQuoteHtml(value: string, citation: string | null): string {
  if (!citation) {
    return value;
  }

  return `${value}<cite>${citation}</cite>`;
}

export function CoreGroupRenderer({
  children,
  block,
}: CoreContainerProps<'core/group'>) {
  switch (normalizeGroupTagName(block.tagName)) {
    case 'section':
      return <section>{children}</section>;
    case 'article':
      return <article>{children}</article>;
    case 'main':
      return <main>{children}</main>;
    case 'aside':
      return <aside>{children}</aside>;
    case 'header':
      return <header>{children}</header>;
    case 'footer':
      return <footer>{children}</footer>;
    case 'nav':
      return <nav>{children}</nav>;
    case 'div':
    default:
      return <div>{children}</div>;
  }
}

export function CoreColumnsRenderer({
  children,
}: CoreContainerProps<'core/columns'>) {
  return <div>{children}</div>;
}

export function CoreColumnRenderer({
  block,
  children,
}: CoreContainerProps<'core/column'>) {
  const style = block.width ? { flexBasis: block.width } : undefined;

  return <div style={style}>{children}</div>;
}

export function CoreParagraphRenderer({
  block,
}: CoreBlockProps<'core/paragraph'>) {
  return <p {...getRichTextProps(block.content)} />;
}

export function CoreHeadingRenderer({ block }: CoreBlockProps<'core/heading'>) {
  const HeadingTag = HEADING_TAGS[block.level];

  return <HeadingTag {...getRichTextProps(block.content)} />;
}

export function CoreImageRenderer({ block }: CoreBlockProps<'core/image'>) {
  if (!block.sourceUrl) {
    return null;
  }

  const image = (
    <CmsImage
      src={block.sourceUrl}
      alt={block.altText}
      width={normalizeImageDimension(block.width) ?? null}
      height={normalizeImageDimension(block.height) ?? null}
      title={block.title}
    />
  );

  return (
    <figure>
      {block.href ? (
        <a
          href={block.href}
          target={block.linkTarget ?? undefined}
          rel={block.rel ?? undefined}
        >
          {image}
        </a>
      ) : (
        image
      )}
      {block.caption ? (
        <figcaption {...getRichTextProps(block.caption)} />
      ) : null}
    </figure>
  );
}

export function CoreQuoteRenderer({
  block,
  children,
}: CoreContainerProps<'core/quote'>) {
  if (block.children.length === 0) {
    return (
      <blockquote
        {...getRichTextProps(getLegacyQuoteHtml(block.value, block.citation))}
      />
    );
  }

  return (
    <blockquote>
      {children}
      {block.citation ? <cite {...getRichTextProps(block.citation)} /> : null}
    </blockquote>
  );
}

export function CoreListRenderer({
  block,
  children,
}: CoreContainerProps<'core/list'>) {
  const hasChildren = block.children.length > 0;

  if (block.ordered) {
    const listProps = {
      reversed: block.reversed ?? undefined,
      start: block.start ?? undefined,
    };

    if (hasChildren) {
      return <ol {...listProps}>{children}</ol>;
    }

    return <ol {...listProps} {...getRichTextProps(block.values)} />;
  }

  if (hasChildren) {
    return <ul>{children}</ul>;
  }

  return <ul {...getRichTextProps(block.values)} />;
}

export function CoreListItemRenderer({
  block,
  children,
}: CoreContainerProps<'core/list-item'>) {
  if (block.children.length === 0) {
    return <li {...getRichTextProps(block.content)} />;
  }

  return (
    <li>
      {block.content ? <span {...getRichTextProps(block.content)} /> : null}
      {children}
    </li>
  );
}

export function CoreButtonsRenderer({
  children,
}: CoreContainerProps<'core/buttons'>) {
  return <div>{children}</div>;
}

export function CoreButtonRenderer({ block }: CoreBlockProps<'core/button'>) {
  if (block.tagName === 'button') {
    return (
      <button
        type={normalizeButtonType(block.buttonType)}
        title={block.title ?? undefined}
        {...getRichTextProps(block.text)}
      />
    );
  }

  return (
    <a
      href={block.url ?? undefined}
      target={block.linkTarget ?? undefined}
      rel={block.rel ?? undefined}
      title={block.title ?? undefined}
      {...getRichTextProps(block.text)}
    />
  );
}

export function CoreSeparatorRenderer() {
  return <hr />;
}
