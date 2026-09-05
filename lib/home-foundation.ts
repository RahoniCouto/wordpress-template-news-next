import { graphqlRequest } from "@/lib/graphql";

type HomeFoundationPost = {
  databaseId: number;
  title: string;
  uri: string;
};

type HomeFoundationData = {
  posts: {
    nodes: HomeFoundationPost[];
  };
};

type HomeFoundationVariables = {
  first: number;
};

const HOME_FOUNDATION_QUERY = `
  query HomeFoundation($first: Int!) {
    posts(first: $first) {
      nodes {
        databaseId
        title
        uri
      }
    }
  }
`;

export async function getHomeFoundationPosts() {
  const data = await graphqlRequest<
    HomeFoundationData,
    HomeFoundationVariables
  >(HOME_FOUNDATION_QUERY, {
    first: 5,
  });

  return data.posts.nodes;
}
