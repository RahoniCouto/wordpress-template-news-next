import { graphqlRequest } from '@/lib/graphql';

export type GutenbergCoreColumnAttribute = {
  width: string | null;
};

export type GutenbergBlock = {
  __typename: string;
  name: string | null;
  clientId: string | null;
  parentClientId: string | null;
  attributes?: GutenbergCoreColumnAttribute | null;
};

export type GutenbergPage = {
  databaseId: number;
  uri: string | null;
  editorBlocks: Array<GutenbergBlock | null> | null;
};

type GutenbergPageData = {
  page: GutenbergPage | null;
};

type GutenbergPageVariables = {
  databaseId: number;
};

const GUTENBERG_PAGE_QUERY = `
  query GutenbergPageByDatabaseId($databaseId: ID!) {
    page(id: $databaseId, idType: DATABASE_ID) {
      databaseId
      uri
      editorBlocks(flatten: true) {
        __typename
        name
        clientId
        parentClientId

        ... on CoreColumn {
          attributes {
            width
          }
        }
      }
    }
  }
`;

export async function getGutenbergPage(
  databaseId: number,
): Promise<GutenbergPage | null> {
  const data = await graphqlRequest<GutenbergPageData, GutenbergPageVariables>(
    GUTENBERG_PAGE_QUERY,
    { databaseId },
  );

  return data.page;
}
