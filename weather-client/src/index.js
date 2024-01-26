import React from 'react';
import { ApolloProvider, InMemoryCache, ApolloClient } from '@apollo/client';
import { createRoot } from 'react-dom/client'; // Import createRoot from react-dom/client

import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { client } from './apollo';

const root = createRoot(document.getElementById('root'));

export const apolloClient = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache(),
});

root.render(
  <React.StrictMode>
    <ApolloProvider client={apolloClient}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
);

reportWebVitals();


