// part10/frontend/src/graphql/fragments.js

import { gql } from "@apollo/client";

export const REPOSITORY_DATA = gql`
  fragment RepositoryData on Repository {
    id
    fullName
    ratingAverage
    reviewCount
    stargazersCount
    forksCount
    ownerAvatarUrl
    description
    language
    url
  }
`;

export const REVIEW_DATA = gql`
  fragment ReviewData on Review {
    id
    text
    rating
    createdAt
    user {
      id
      username
    }
    repository {
      id
      fullName
    }
  }
`;

export const PAGE_INFO_DATA = gql`
  fragment PageInfoData on PageInfo {
    endCursor
    startCursor
    hasNextPage
  }
`;
