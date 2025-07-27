// part10/frontend/src/graphql/queries.js

import { gql } from '@apollo/client';

import { REPOSITORY_DATA, REVIEW_DATA, PAGE_INFO_DATA } from './fragments';

export const GET_REPOSITORIES = gql`
  query Repositories(
    $orderBy: AllRepositoriesOrderBy, 
    $orderDirection: OrderDirection,
    $searchKeyword: String,
    $first: Int,
    $after: String,
    ) {
    repositories(
      orderBy: $orderBy, 
      orderDirection: $orderDirection,
      searchKeyword: $searchKeyword,
      first: $first,
      after: $after
      ) {
      edges {
        node {
          ...RepositoryData
        }
        cursor
      }
      pageInfo {
        ...PageInfoData
      }
    }
  }
  ${REPOSITORY_DATA}
  ${PAGE_INFO_DATA}
`;

export const GET_REPOSITORY = gql`
  query Repository($id: ID!, $first: Int, $after: String) {
    repository(id: $id) {
        ...RepositoryData
        reviews(first: $first, after: $after) {
          edges {
            node {
              ...ReviewData
            }
            cursor
          }
          pageInfo {
            ...PageInfoData
          }
        }
    }
  }
  ${REPOSITORY_DATA}
  ${REVIEW_DATA}
  ${PAGE_INFO_DATA}
`;

export const GET_AUTHORIZED_USER = gql`
  query AuthorizedUser(
    $includeReviews: Boolean = false, 
    $first: Int, 
    $after: String
    ) {
    authorizedUser {
      id
      username
      reviews(first: $first, after: $after) @include(if: $includeReviews) {
        edges {
          node {
            ...ReviewData
          }
          cursor
        }
        pageInfo {
          ...PageInfoData
        }
      }
    }
  }
  ${REVIEW_DATA}
  ${PAGE_INFO_DATA}
`;
