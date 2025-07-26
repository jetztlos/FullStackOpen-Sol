// part8/library-frontend/src/ApolloProvider.jsx

import React from "react"
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  split
} from "@apollo/client"
import { WebSocketLink } from "@apollo/client/link/ws"
import { setContext } from "@apollo/client/link/context"
import { getMainDefinition } from "@apollo/client/utilities"

const httpLink = new HttpLink({ uri: "http://localhost:4000/graphql" })
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("app-user-token")
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null
    }
  }
})

const wsLink = new WebSocketLink({
  uri: "ws://localhost:4000/graphql",
  options: {
    reconnect: true,
    connectionParams: {
      authorization: localStorage.getItem("app-user-token")
        ? `Bearer ${localStorage.getItem("app-user-token")}`
        : null
    }
  }
})

const splitLink = split(
  ({ query }) => {
    const def = getMainDefinition(query)
    return def.kind === "OperationDefinition" && def.operation === "subscription"
  },
  wsLink,
  authLink.concat(httpLink)
)

export default function AppProvider({ children }) {
  const client = React.useMemo(
    () =>
      new ApolloClient({
        link: splitLink,
        cache: new InMemoryCache()
      }),
    []
  )
  return <ApolloProvider client={client}>{children}</ApolloProvider>
}
