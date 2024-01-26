import { ApolloClient, InMemoryCache } from '@apollo/client';

// Create an instance of the Apollo client
export const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql', 
  cache: new InMemoryCache(),
});

export default client;
