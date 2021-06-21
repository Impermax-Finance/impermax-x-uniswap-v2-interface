
// ray test touch <<
import ApolloClient, { ApolloQueryResult } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { DocumentNode } from 'graphql';

// TODO: should type properly (`any`)
const apolloFetcher = (
  subgraphUrl: string,
  query: DocumentNode
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
// ray test touch >>
