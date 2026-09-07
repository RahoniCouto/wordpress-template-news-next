import { graphqlRequest } from '@/lib/graphql';

export type WtnResolvedImage = {
  databaseId: number | null;
  sourceUrl: string;
  altText: string;
  width: number | null;
  height: number | null;
};

export type WtnResolvedCategory = {
  databaseId: number;
  name: string;
  uri: string | null;
};

export type WtnResolvedEditorialPost = {
  databaseId: number;
  uri: string;
  title: string;
  excerpt: string | null;
  publishedAt: string;
  readingTimeMinutes: number | null;
  image: WtnResolvedImage | null;
  category: WtnResolvedCategory | null;
};

export type WtnResolvedAuthor = {
  databaseId: number;
  uri: string;
  displayName: string;
  editorialRole: string | null;
  publishedPostCount: number;
  avatar: WtnResolvedImage | null;
};

export type WtnEditorialHeroResolved = {
  mediaPosition: string;
  prioritizeImage: boolean;
  post: WtnResolvedEditorialPost;
};

export type WtnBreakingNewsResolved = {
  label: string;
  post: WtnResolvedEditorialPost;
};

export type WtnNewsSectionResolved = {
  layoutVariant: string;
  prioritizeImage: boolean;
  title: string | null;
  viewAllLabel: string | null;
  viewAllUrl: string | null;
  featuredPost: WtnResolvedEditorialPost;
  secondaryPosts: Array<WtnResolvedEditorialPost | null> | null;
};

export type WtnLatestNewsResolved = {
  layoutVariant: string;
  title: string;
  viewAllUrl: string | null;
  posts: Array<WtnResolvedEditorialPost | null> | null;
};

export type WtnFeaturedAuthorsResolved = {
  title: string;
  viewAllUrl: string | null;
  authors: Array<WtnResolvedAuthor | null> | null;
};

export type WtnAdSlotResolved = {
  type: string;
  placement: string;
  format: string;
  width: number;
  height: number;
  image: WtnResolvedImage | null;
  url: string | null;
  adsenseClientId: string | null;
  adSlotId: string | null;
};

export type WtnBlockResolved =
  | WtnEditorialHeroResolved
  | WtnBreakingNewsResolved
  | WtnNewsSectionResolved
  | WtnLatestNewsResolved
  | WtnFeaturedAuthorsResolved
  | WtnAdSlotResolved;

export type GutenbergBlock = {
  __typename: string;
  name: string | null;
  clientId: string | null;
  parentClientId: string | null;
  width?: string | null;
  resolved?: WtnBlockResolved | null;
};

export type GutenbergPage = {
  databaseId: number;
  uri: string | null;
  editorBlocks: Array<GutenbergBlock | null> | null;
};

type GutenbergBlockWire = {
  __typename: string;
  name: string | null;
  clientId: string | null;
  parentClientId: string | null;
  width?: string | null;
  editorialHeroResolved?: WtnEditorialHeroResolved | null;
  breakingNewsResolved?: WtnBreakingNewsResolved | null;
  newsSectionResolved?: WtnNewsSectionResolved | null;
  latestNewsResolved?: WtnLatestNewsResolved | null;
  featuredAuthorsResolved?: WtnFeaturedAuthorsResolved | null;
  adSlotResolved?: WtnAdSlotResolved | null;
};

type GutenbergPageWire = {
  databaseId: number;
  uri: string | null;
  editorBlocks: Array<GutenbergBlockWire | null> | null;
};

type GutenbergPageData = {
  page: GutenbergPageWire | null;
};

type GutenbergPageVariables = {
  databaseId: number;
};

const GUTENBERG_PAGE_QUERY = `
  fragment WtnResolvedImageFields on WtnResolvedImage {
    databaseId
    sourceUrl
    altText
    width
    height
  }

  fragment WtnResolvedCategoryFields on WtnResolvedCategory {
    databaseId
    name
    uri
  }

  fragment WtnResolvedEditorialPostFields on WtnResolvedEditorialPost {
    databaseId
    uri
    title
    excerpt
    publishedAt
    readingTimeMinutes
    image {
      ...WtnResolvedImageFields
    }
    category {
      ...WtnResolvedCategoryFields
    }
  }

  fragment WtnResolvedAuthorFields on WtnResolvedAuthor {
    databaseId
    uri
    displayName
    editorialRole
    publishedPostCount
    avatar {
      ...WtnResolvedImageFields
    }
  }

  query GutenbergPageByDatabaseId($databaseId: ID!) {
    page(id: $databaseId, idType: DATABASE_ID) {
      databaseId
      uri
      editorBlocks(flat: true) {
        __typename
        name
        clientId
        parentClientId

        ... on CoreColumn {
          width
        }

        ... on WtnBlocksEditorialHero {
          editorialHeroResolved: resolved {
            mediaPosition
            prioritizeImage
            post {
              ...WtnResolvedEditorialPostFields
            }
          }
        }

        ... on WtnBlocksBreakingNews {
          breakingNewsResolved: resolved {
            label
            post {
              ...WtnResolvedEditorialPostFields
            }
          }
        }

        ... on WtnBlocksNewsSection {
          newsSectionResolved: resolved {
            layoutVariant
            prioritizeImage
            title
            viewAllLabel
            viewAllUrl
            featuredPost {
              ...WtnResolvedEditorialPostFields
            }
            secondaryPosts {
              ...WtnResolvedEditorialPostFields
            }
          }
        }

        ... on WtnBlocksLatestNews {
          latestNewsResolved: resolved {
            layoutVariant
            title
            viewAllUrl
            posts {
              ...WtnResolvedEditorialPostFields
            }
          }
        }

        ... on WtnBlocksFeaturedAuthors {
          featuredAuthorsResolved: resolved {
            title
            viewAllUrl
            authors {
              ...WtnResolvedAuthorFields
            }
          }
        }

        ... on WtnBlocksAdSlot {
          adSlotResolved: resolved {
            type
            placement
            format
            width
            height
            image {
              ...WtnResolvedImageFields
            }
            url
            adsenseClientId
            adSlotId
          }
        }
      }
    }
  }
`;

function normalizeGutenbergBlock(
  block: GutenbergBlockWire | null,
): GutenbergBlock | null {
  if (!block) {
    return null;
  }

  const baseBlock: GutenbergBlock = {
    __typename: block.__typename,
    name: block.name,
    clientId: block.clientId,
    parentClientId: block.parentClientId,
  };

  switch (block.__typename) {
    case 'CoreColumn':
      return {
        ...baseBlock,
        width: block.width ?? null,
      };

    case 'WtnBlocksEditorialHero':
      return {
        ...baseBlock,
        resolved: block.editorialHeroResolved ?? null,
      };

    case 'WtnBlocksBreakingNews':
      return {
        ...baseBlock,
        resolved: block.breakingNewsResolved ?? null,
      };

    case 'WtnBlocksNewsSection':
      return {
        ...baseBlock,
        resolved: block.newsSectionResolved ?? null,
      };

    case 'WtnBlocksLatestNews':
      return {
        ...baseBlock,
        resolved: block.latestNewsResolved ?? null,
      };

    case 'WtnBlocksFeaturedAuthors':
      return {
        ...baseBlock,
        resolved: block.featuredAuthorsResolved ?? null,
      };

    case 'WtnBlocksAdSlot':
      return {
        ...baseBlock,
        resolved: block.adSlotResolved ?? null,
      };

    default:
      return baseBlock;
  }
}

function normalizeGutenbergPage(
  page: GutenbergPageWire | null,
): GutenbergPage | null {
  if (!page) {
    return null;
  }

  return {
    databaseId: page.databaseId,
    uri: page.uri,
    editorBlocks: page.editorBlocks?.map(normalizeGutenbergBlock) ?? null,
  };
}

export async function getGutenbergPage(
  databaseId: number,
): Promise<GutenbergPage | null> {
  const data = await graphqlRequest<GutenbergPageData, GutenbergPageVariables>(
    GUTENBERG_PAGE_QUERY,
    { databaseId },
  );

  return normalizeGutenbergPage(data.page);
}
