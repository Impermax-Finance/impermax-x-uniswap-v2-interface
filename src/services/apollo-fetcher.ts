
import ApolloClient, { ApolloQueryResult } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { DocumentNode } from 'graphql';

const apolloFetcher = (
  subgraphUrl: string,
  query: DocumentNode
  // TODO: should type properly (`any`)
): Promise<ApolloQueryResult<any>> => {
  const client = new ApolloClient({
    link: new HttpLink({
      uri: subgraphUrl
    }),
    cache: new InMemoryCache()
  });

  return client.query({
    query: query,
    fetchPolicy: 'cache-first'
  });
};

export default apolloFetcher;
