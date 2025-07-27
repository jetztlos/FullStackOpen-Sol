// part10/frontend/src/graphql/mutations.js

import { gql } from '@apollo/client';

import { REVIEW_DATA } from './fragments';

export const AUTHORIZE = gql`
  mutation Authorize($username: String!, $password: String!) {
    authorize(credentials: { username: $username, password: $password }) {
      accessToken
    }
  }
`;

export const CREATE_REVIEW = gql`
  mutation CreateReview(
    $ownerName: String!
    $repositoryName: String!
    $rating: Int!
    $text: String
    ) {
    createReview(
      review: {
      ownerName: $ownerName
      repositoryName: $repositoryName
      rating: $rating
      text: $text
      }
    ) {
      repositoryId
      ...ReviewData
    }
  }
  ${REVIEW_DATA}
`;

export const DELETE_REVIEW = gql`
  mutation DeleteReview($id: ID!) {
    deleteReview(id: $id)
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser($username: String!, $password: String!) {
    createUser(user: { username: $username, password: $password }) {
      id
      username
    }
  }
`;
