import type { GutenbergBlock } from '@/lib/gutenberg';

export type GutenbergTreeBlock = GutenbergBlock & {
  children: GutenbergTreeBlock[];
};

type OpenTreeNode = {
  clientId: string;
  node: GutenbergTreeBlock;
};

function describeBlock(block: GutenbergBlock, index: number): string {
  return `Gutenberg block at index ${index} (${block.kind}, ${block.__typename})`;
}

function requireClientId(block: GutenbergBlock, index: number): string {
  const { clientId } = block;

  if (clientId === null || clientId.trim() === '') {
    throw new Error(
      `${describeBlock(block, index)} is missing a valid clientId`,
    );
  }

  return clientId;
}

function requireParentClientId(
  block: GutenbergBlock,
  index: number,
): string | null {
  const { parentClientId } = block;

  if (parentClientId !== null && parentClientId.trim() === '') {
    throw new Error(
      `${describeBlock(block, index)} has an invalid empty parentClientId`,
    );
  }

  return parentClientId;
}

function createTreeBlock<TBlock extends GutenbergBlock>(
  block: TBlock,
): TBlock & { children: GutenbergTreeBlock[] } {
  return {
    ...block,
    children: [],
  };
}

export function flatListToTree(
  blocks: readonly GutenbergBlock[],
): GutenbergTreeBlock[] {
  const roots: GutenbergTreeBlock[] = [];
  const seenClientIds = new Set<string>();
  const openPath: OpenTreeNode[] = [];
  const openPathIndexByClientId = new Map<string, number>();

  for (const [index, block] of blocks.entries()) {
    const clientId = requireClientId(block, index);
    const parentClientId = requireParentClientId(block, index);

    if (seenClientIds.has(clientId)) {
      throw new Error(
        `${describeBlock(block, index)} has duplicate clientId "${clientId}"`,
      );
    }

    if (parentClientId === clientId) {
      throw new Error(
        `${describeBlock(block, index)} cannot reference itself as parent`,
      );
    }

    const node: GutenbergTreeBlock = createTreeBlock(block);

    if (parentClientId === null) {
      roots.push(node);
      openPath.length = 0;
      openPathIndexByClientId.clear();
      openPath.push({ clientId, node });
      openPathIndexByClientId.set(clientId, 0);
      seenClientIds.add(clientId);
      continue;
    }

    const parentIndex = openPathIndexByClientId.get(parentClientId);

    if (parentIndex === undefined) {
      if (seenClientIds.has(parentClientId)) {
        throw new Error(
          `${describeBlock(block, index)} references parentClientId "${parentClientId}" after that depth-first branch was closed`,
        );
      }

      throw new Error(
        `${describeBlock(block, index)} references parentClientId "${parentClientId}" before that parent appears in the flat depth-first list`,
      );
    }

    const parentNode = openPath[parentIndex].node;
    parentNode.children.push(node);

    for (
      let pathIndex = openPath.length - 1;
      pathIndex > parentIndex;
      pathIndex -= 1
    ) {
      openPathIndexByClientId.delete(openPath[pathIndex].clientId);
    }

    openPath.length = parentIndex + 1;
    openPath.push({ clientId, node });
    openPathIndexByClientId.set(clientId, openPath.length - 1);
    seenClientIds.add(clientId);
  }

  return roots;
}
