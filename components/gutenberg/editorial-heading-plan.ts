import type { EditorialHeadingLevel } from '@/components/gutenberg/editorial-heading';
import { gutenbergRegistry } from '@/components/gutenberg/registry';
import type { GutenbergTreeBlock } from '@/lib/gutenberg-tree';

export type EditorialHeadingPlan = ReadonlyMap<
  GutenbergTreeBlock,
  EditorialHeadingLevel
>;

export function createEditorialHeadingPlan(
  blocks: readonly GutenbergTreeBlock[],
  mainHeadingAlreadyRendered: boolean,
): EditorialHeadingPlan {
  const plan = new Map<GutenbergTreeBlock, EditorialHeadingLevel>();
  let mainHeadingConsumed = mainHeadingAlreadyRendered;

  function visit(block: GutenbergTreeBlock) {
    if (block.kind === 'unknown') {
      return;
    }

    const registryEntry = gutenbergRegistry[block.kind];

    if (block.kind === 'core/heading' && block.level === 1) {
      mainHeadingConsumed = true;
    }

    if (registryEntry.rendersEditorialHeading(block)) {
      plan.set(block, mainHeadingConsumed ? 2 : 1);
      mainHeadingConsumed = true;
    }

    if (!registryEntry.supportsChildren) {
      return;
    }

    for (const child of block.children) {
      visit(child);
    }
  }

  for (const block of blocks) {
    visit(block);
  }

  return plan;
}
