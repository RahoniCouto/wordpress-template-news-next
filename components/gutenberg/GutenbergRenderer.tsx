import { Fragment } from 'react';
import type { ReactNode } from 'react';

import { RenderedHtmlBlock } from '@/components/gutenberg/RenderedHtmlBlock';
import { createEditorialHeadingPlan } from '@/components/gutenberg/editorial-heading-plan';
import type { EditorialHeadingPlan } from '@/components/gutenberg/editorial-heading-plan';
import { gutenbergRegistry } from '@/components/gutenberg/registry';
import type { GutenbergTreeBlock } from '@/lib/gutenberg-tree';

type GutenbergRendererProps = {
  blocks: readonly GutenbergTreeBlock[];
  mainHeadingAlreadyRendered: boolean;
};

function describeBlock(block: GutenbergTreeBlock): string {
  return `${block.kind} (${block.__typename})`;
}

function requireClientId(block: GutenbergTreeBlock): string {
  if (block.clientId === null || block.clientId.trim() === '') {
    throw new Error(
      `Gutenberg renderer received ${describeBlock(block)} without a valid clientId`,
    );
  }

  return block.clientId;
}

function isWtnNamespaceBlock(block: GutenbergTreeBlock): boolean {
  return (
    block.name?.startsWith('wtn-blocks/') === true ||
    block.__typename.startsWith('WtnBlocks')
  );
}

function isWtnBlock(block: GutenbergTreeBlock): boolean {
  if (block.kind === 'unknown') {
    return isWtnNamespaceBlock(block);
  }

  return block.kind.startsWith('wtn-blocks/');
}

function findWtnDescendant(
  block: GutenbergTreeBlock,
): GutenbergTreeBlock | null {
  for (const child of block.children) {
    if (isWtnBlock(child)) {
      return child;
    }

    const descendant = findWtnDescendant(child);

    if (descendant) {
      return descendant;
    }
  }

  return null;
}

function renderBlockList(
  blocks: readonly GutenbergTreeBlock[],
  headingPlan: EditorialHeadingPlan,
): ReactNode {
  return blocks.map((block) => (
    <Fragment key={requireClientId(block)}>
      {renderTreeBlock(block, headingPlan)}
    </Fragment>
  ));
}

function renderTreeBlock(
  block: GutenbergTreeBlock,
  headingPlan: EditorialHeadingPlan,
): ReactNode {
  if (block.kind === 'unknown') {
    if (isWtnNamespaceBlock(block)) {
      throw new Error(
        `WTN Gutenberg block ${describeBlock(block)} has no native React renderer`,
      );
    }

    const wtnDescendant = findWtnDescendant(block);

    if (wtnDescendant) {
      throw new Error(
        `Unsupported Gutenberg block ${describeBlock(block)} contains WTN descendant ${describeBlock(wtnDescendant)} and cannot use renderedHtml compatibility`,
      );
    }

    // renderedHtml is an opaque compatibility boundary. WordPress already
    // rendered this unknown block's innerBlocks, so React must not recurse
    // into block.children or the descendants would be duplicated.
    return <RenderedHtmlBlock block={block} />;
  }

  const registryEntry = gutenbergRegistry[block.kind];

  if (!registryEntry.supportsChildren && block.children.length > 0) {
    throw new Error(
      `Leaf Gutenberg block ${describeBlock(block)} unexpectedly contains ${block.children.length} child block(s)`,
    );
  }

  if (isWtnBlock(block)) {
    if (!('resolved' in block)) {
      throw new Error(
        `WTN registry entry ${block.kind} received a block without resolved data`,
      );
    }

    if (block.resolved === null) {
      return null;
    }
  }

  const children = registryEntry.supportsChildren
    ? renderBlockList(block.children, headingPlan)
    : null;
  const headingLevel = headingPlan.get(block) ?? null;

  if (registryEntry.rendersEditorialHeading(block) && headingLevel === null) {
    throw new Error(
      `Gutenberg heading plan is missing a level for ${describeBlock(block)}`,
    );
  }

  return registryEntry.render({
    block,
    children,
    headingLevel,
  });
}

export function GutenbergRenderer({
  blocks,
  mainHeadingAlreadyRendered,
}: GutenbergRendererProps) {
  const headingPlan = createEditorialHeadingPlan(
    blocks,
    mainHeadingAlreadyRendered,
  );

  return <>{renderBlockList(blocks, headingPlan)}</>;
}
