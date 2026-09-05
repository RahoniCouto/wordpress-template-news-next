type GraphQLError = {
  message: string;
};

type GraphQLResponse<TData> = {
  data?: TData;
  errors?: GraphQLError[];
};

function getGraphQLEndpoint(): string {
  const endpoint = process.env.WORDPRESS_GRAPHQL_URL;

  if (!endpoint) {
    throw new Error("WORDPRESS_GRAPHQL_URL is not defined");
  }
  return endpoint;
}

export async function graphqlRequest<
  TData,
  TVariables extends Record<string, unknown> = Record<string, never>,
>(query: string, variables?: TVariables): Promise<TData> {
  const response = await fetch(getGraphQLEndpoint(), {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (!response.ok) {
    throw new Error(
      `GraphQL request failed with status ${response.status} ${response.statusText}`,
    );
  }

  let payload: GraphQLResponse<TData>;

  try {
    payload = (await response.json()) as GraphQLResponse<TData>;
  } catch {
    throw new Error("Failed to parse GraphQL response as JSON");
  }

  if (payload.errors?.length) {
    throw new Error(
      `GraphQL request failed with errors: ${payload.errors
        .map((e) => e.message)
        .join(", ")}`,
    );
  }

  if (payload.data === undefined) {
    throw new Error("GraphQL response is missing 'data' field");
  }

  return payload.data;
}
